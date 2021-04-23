import json
import logging
import pydash as _
from datetime import datetime

from async_lru import alru_cache
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from wzrd.users.redis import auth_manager
from wzrd.users.models import User

from . game_mechanics import roll
from .models import Session, HeroSession
from .serializers import HeroSessionSerializer


@alru_cache(maxsize=256)
async def get_game_session(session_name):
    @database_sync_to_async
    def request():
        return Session.objects.filter(invitation_code=session_name).first()
    return await request()


@alru_cache(maxsize=1024)
async def get_hero_session(hero_session_id):
    @database_sync_to_async
    def request():
        return HeroSession.objects.filter(id=hero_session_id - 10000).first()
    return await request()


class GameSessionConsumer(AsyncJsonWebsocketConsumer):
    UPDATE_FIELDS = ("xy", "sprite")
    ACTION_TYPES = ("add", "delete", "update", "update_and_save", "update_and_start",
                    "map", "global_map", "refresh", "clear", "active_users", "roll",
                    "chat", "add_hero",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_info = {}
        self.session_name = None

    @database_sync_to_async
    def get_user(self):
        return User.objects.get(id=self.user_info["id"])

    @database_sync_to_async
    def add_herosession(self, user, session, hero_id, game_data):
        hero = user.heroes.filter(id=hero_id).first()
        if not hero:
            return None
        return HeroSession.objects.create(base=hero, session=session, game_data=game_data)

    @database_sync_to_async
    def get_herosession_by_id(self, herosession_id):
        return HeroSession.objects.filter(id=herosession_id-10000).first()

    @database_sync_to_async
    def delete_herosession_by_id(self, herosession_id):
        herosession = HeroSession.objects.filter(id=herosession_id - 10000).first()
        return not herosession or herosession.delete()

    @database_sync_to_async
    def get_all_herosessions(self, session):
        return HeroSession.objects.get(session=session)

    @database_sync_to_async
    def add_session_to_user(self, user, game_session):
        if not user.sessions.filter(id=game_session.id).exists():
            user.sessions.add(game_session)
            user.save()

    @database_sync_to_async
    def save_game_session(self, save):
        for model in save:
            model.save()

    def is_game_master_for(self, game_session):
        return game_session.game_master == self.user_info["id"]

    async def connect(self):
        self.session_name = self.scope["url_route"]["kwargs"]["session_name"]

        token = _.get(self.scope, "cookies.auth_token")
        self.user_info = auth_manager.get_user_info(token)

        if not self.user_info:
            return self.close(code=4401)

        user = await self.get_user()
        game_session = await get_game_session(self.session_name)

        if not game_session:
            return self.close(code=4400)
        await self.add_session_to_user(user, game_session)

        user_id = str(user.id)
        user_obj = {"id": user_id, "username": user.username}
        game_session.active_users[user_id] = user_obj

        await self.save_game_session(game_session)
        await self.start_sending("send_all_but_me", {
            "type": "connect",
            "meta": user_obj
        })

        # Join session group
        await self.channel_layer.group_add(self.session_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        game_session = await get_game_session(self.session_name)
        user_id = str(self.user_info.get("id"))
        if user_id and user_id in game_session.active_users:
            del game_session.active_users[user_id]
            await self.save_game_session(game_session)
            await self.start_sending("send_all_but_me", {
                "type": "disconnect",
                "meta": user_id
            })

        await self.channel_layer.group_discard(self.session_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        json_data = json.loads(text_data)
        action_type = json_data["type"]
        meta = json_data.get("meta")
        save = []

        if action_type not in self.ACTION_TYPES:
            json_data["type"] = "error"
            json_data["meta"] = f"Tried non-existant action_type {action_type}"
            logging.warning(f"[WS {self.session_name}] Tried non-existant action_type {action_type}")
            return await self.start_sending("send_me", json_data)

        game_session = await get_game_session(self.session_name)
        if not game_session:
            json_data["type"] = "error"
            json_data["meta"] = "Game session not found!"
            logging.warning(f"[WS {self.session_name}] Game session not found!")
            return await self.start_sending("send_me", json_data)

        message_type = "send_all_but_me"
        if action_type == "add":
            message_type = "send_all"
            object_id = str(game_session.last_object_id)

            if meta["type"] == "hero":
                hero_id = meta.pop("hero_id", None)
                if not hero_id:
                    json_data["type"] = "error"
                    json_data["meta"] = "hero_id was not provided!"
                    logging.warning(f"[WS {self.session_name}] hero_id was not provided!")
                    return await self.start_sending("send_me", json_data)

                user = await self.get_user()
                hero = await self.add_herosession(user, game_session, hero_id, meta)

                if not hero:
                    json_data["type"] = "error"
                    json_data["meta"] = f"Hero [{meta}] not found!"
                    logging.warning(f"[WS {self.session_name} ADD HERO] Hero [{meta}] not found!")
                    return await self.start_sending("send_me", json_data)

                json_data["meta"] = HeroSessionSerializer().to_representation(instance=hero)
            else:
                game_session.current_game_objects[object_id] = meta
                json_data["meta"]["id"] = object_id
                game_session.last_object_id += 1
                save = [game_session]

        elif action_type in ("update", "update_and_save", "update_and_start"):
            obj_id = str(meta["id"])
            if len(obj_id) >= 5:
                obj = await get_hero_session(int(obj_id))
            else:
                obj = game_session.current_game_objects.get(obj_id)

            if not obj:
                json_data["type"] = "error"
                json_data["meta"] = f"Object [{meta['id']}] not found!"
                logging.warning(f"[WS {self.session_name} UPDATE] Object [{meta['id']}] not found!")
                return await self.start_sending("send_me", json_data)

            changes = _.pick(meta, *self.UPDATE_FIELDS)
            if not self.validate_fields(changes):
                json_data["type"] = "error"
                json_data["meta"] = "Field validation failed!"
                logging.warning(f"[WS {self.session_name} UPDATE] Field validation failed!")
                return await self.start_sending("send_me", json_data)

            obj.update(changes)

            if action_type == "update_and_save":
                json_data["type"] = "update"
                if len(obj_id) >= 5:
                    save = [obj]
                else:
                    save = [game_session]

        elif action_type == "delete":
            object_id = str(meta["id"])

            if len(object_id) == 5:
                error = await self.delete_herosession_by_id(int(object_id))
                if error:
                    json_data["type"] = "error"
                    json_data["meta"] = f"Object [{meta['id']}] not found!"
                    logging.warning(f"[WS {self.session_name} DELETE] Object [{meta['id']}] not found!")
                    return await self.start_sending("send_me", json_data)
            else:
                if object_id not in game_session.current_game_objects:
                    json_data["type"] = "error"
                    json_data["meta"] = f"Object [{meta['id']}] not found!"
                    logging.warning(f"[WS {self.session_name} DELETE] Object [{meta['id']}] not found!")
                    return await self.start_sending("send_me", json_data)

                del game_session.current_game_objects[object_id]
                save = [game_session]

        elif action_type == "refresh":
            message_type = "send_me"
            heroes = {
                r['id']: r
                for r in map(HeroSessionSerializer().to_representation, await self.get_all_herosessions())
            }

            json_data["meta"] = {
                "active_users": list(game_session.active_users.values()),
                "game_objects": {**game_session.current_game_objects, **heroes},
                "chat": game_session.chat,
                "map": game_session.map,
                "maps": list(_.omit(game_session.game_objects, "Global").keys())
            }

        elif action_type in ("map", "global_map"):
            message_type = "send_all"
            game_session.map = meta if action_type == "map" else "Global"
            if action_type == "map":
                json_data["meta"] = {
                    "game_objects": {**game_session.current_game_objects, **game_session.dummy_heroes},
                    "map": meta
                }
            else:
                json_data["meta"] = {"game_objects": game_session.current_game_objects}
            save = [game_session]

        elif action_type == "clear":
            game_session.current_game_objects.clear()
            game_session.last_object_id = 1
            save = [game_session]

        elif action_type == "chat":
            message_type = "send_all"
            json_data["meta"] = {
                "type": "message",
                "time": datetime.strftime(datetime.utcnow(), "%Y-%m-%dT%H:%M:%S%zZ"),
                "message": meta,
                "sender": self.user_info["username"],
            }
            game_session.chat.append(json_data["meta"])
            save = [game_session]

        elif action_type == "roll":
            total, rolled = roll(meta)
            chat_message = {
                "type": "roll",
                "time": datetime.strftime(datetime.utcnow(), "%Y-%m-%dT%H:%M:%S%zZ"),
                "dice": meta,
                "total": total,
                "rolls": rolled,
                "sender": self.user_info["username"],
            }
            game_session.chat.append(chat_message)

            message_type = "send_all"
            json_data["type"] = "chat"
            json_data["meta"] = chat_message

        elif action_type == "active_users":
            message_type = "send_me"
            json_data["meta"] = game_session.active_users

        if save:
            await self.save_game_session(save)

        return await self.start_sending(message_type, json_data)

    async def start_sending(self, message_type, json_data):
        return await self.channel_layer.group_send(self.session_name, {
            "type": message_type,
            "message": json_data,
            "sender": self.channel_name
        })

    @staticmethod
    def validate_fields(obj):
        if not isinstance(obj, dict):
            return False

        for k, v in obj.items():
            if k in ("xy", "wh"):
                if not isinstance(v, list):
                    return False
        return True

    async def send_me(self, event):
        if self.channel_name == event["sender"]:
            return await self.send_json(content=event["message"])

    async def send_all(self, event):
        await self.send_json(content=event["message"])

    async def send_all_but_me(self, event):
        if self.channel_name != event["sender"]:
            await self.send_json(content=event["message"])
