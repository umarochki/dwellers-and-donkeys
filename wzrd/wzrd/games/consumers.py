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
    UPDATE_FIELDS = ("xy", "wh", "sprite")
    DRAW_ACTIONS = (
        "draw_pencil_started",
        "draw_pencil_moved",
        "draw_pencil_stopped",
        "draw_eraser_started",
        "draw_eraser_moved",
        "draw_eraser_stopped",
        "draw_polygon_started",
        "draw_polygon_middle",
        "draw_polygon_stopped",
        "draw_polygon_moved",
        "draw_polygon_add",
        "region_obstacle_add",
    )
    TOGGLE_ACTIONS = (
        "toggle_night",
        "toggle_rain",
    )
    UPDATE_ACTIONS = (
        "update",
        "update_and_start",
        "update_and_save",
    )
    MAP_ACTIONS = (
        "map", "global_map",
    )
    OBJECT_ACTIONS = (
        "add", "delete", "clear",
    )
    CHAT_ACTIONS = (
        "roll", "chat",
    )
    MISC = (
        "refresh", "active_users",
    )
    ACTION_TYPES = (
        *OBJECT_ACTIONS,
        *UPDATE_ACTIONS,
        *TOGGLE_ACTIONS,
        *CHAT_ACTIONS,
        *DRAW_ACTIONS,
        *MAP_ACTIONS,
        *MISC
    )

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
    def get_herosession_by_user(self, session, user, serializer=None):
        model = HeroSession.objects.filter(session=session, base__user=user).first()
        if model and serializer:
            model = serializer.to_representation(model)
        return model

    @database_sync_to_async
    def delete_herosession_by_id(self, herosession_id):
        herosession = HeroSession.objects.filter(id=herosession_id - 10000).first()
        return not herosession or herosession.delete()

    @database_sync_to_async
    def get_all_herosessions(self, session, serializer=None):
        qs = HeroSession.objects.filter(session=session)
        if qs and serializer:
            qs = list(map(serializer.to_representation, qs))
        return qs

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
            logging.warning(f"WebSocket UNAUTHORIZED with token {token}")
            return self.close(code=4401)

        user = await self.get_user()
        game_session = await get_game_session(self.session_name)

        if not game_session:
            logging.warning(f"WebSocket GAMESESSION  {self.session_name} not found")
            return self.close(code=4400)
        await self.add_session_to_user(user, game_session)

        user_id = str(user.id)
        user_obj = {"id": user_id, "username": user.username}
        game_session.active_users[user_id] = user_obj

        await self.save_game_session([game_session])
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
            await self.save_game_session([game_session])
            await self.start_sending("send_all_but_me", {
                "type": "disconnect",
                "meta": user_id
            })

        await self.channel_layer.group_discard(self.session_name, self.channel_name)

    async def error_response(self, msg):
        logging.warning(f"[WS {self.session_name}] {msg}")
        json_data = {
            "type": "error",
            "meta": msg
        }
        await self.start_sending("send_me", json_data)

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        json_data = json.loads(text_data)
        action_type = json_data["type"]
        meta = json_data["meta"] = json_data.get("meta") or {}
        save = []

        if action_type not in self.ACTION_TYPES:
            return await self.error_response(f"Tried non-existant action_type {action_type}")

        game_session = await get_game_session(self.session_name)
        if not game_session:
            return await self.error_response("Game session not found!")

        message_type = "send_all_but_me"
        if action_type == "add":
            message_type = "send_all"
            object_id = str(game_session.last_object_id)

            if meta["type"] == "hero":
                hero_id = meta.pop("hero_id", None)
                if not hero_id:
                    return await self.error_response("Hero_id was not provided!")

                user = await self.get_user()
                hero = await self.add_herosession(user, game_session, hero_id, meta)

                if not hero:
                    return await self.error_response(f"Hero [{meta}] not found!")

                json_data["meta"] = HeroSessionSerializer().to_representation(instance=hero)
                json_data["meta"]["me"] = False
                await self.start_sending("send_all_but_me", json_data)
                json_data["meta"]["me"] = True
                return await self.start_sending("send_me", json_data)
            else:
                game_session.current_game_objects[object_id] = meta
                json_data["meta"]["id"] = object_id
                game_session.last_object_id += 1
                save = [game_session]

        elif action_type in self.UPDATE_ACTIONS:
            obj_id = str(meta["id"])
            if len(obj_id) >= 5:
                obj = await get_hero_session(int(obj_id))
            else:
                obj = game_session.current_game_objects.get(obj_id)

            if not obj:
                return await self.error_response(f"Object [{meta['id']}] not found!")

            # changes = _.pick(meta, *self.UPDATE_FIELDS)
            if not self.validate_fields(meta):
                return await self.error_response("Field validation failed!")

            obj.update(meta)

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
                    return await self.error_response(f"Object [{meta['id']}] not found!")
            else:
                if object_id not in game_session.current_game_objects:
                    return await self.error_response(f"Object [{meta['id']}] not found!")

                del game_session.current_game_objects[object_id]
                save = [game_session]

        elif action_type == "refresh":
            message_type = "send_me"
            serializer = HeroSessionSerializer()
            hero_sessions = await self.get_all_herosessions(game_session, serializer)
            heroes = {
                str(hero['id']): hero for hero in hero_sessions
            }

            user = await self.get_user()
            json_data["meta"] = {
                "active_users": list(game_session.active_users.values()),
                "game_objects": {**game_session.current_game_objects, **heroes},
                "chat": game_session.chat,
                "map": game_session.map,
                "maps": list(_.omit(game_session.game_objects, "Global").keys()),
                "my_hero": await self.get_herosession_by_user(game_session, user, serializer),
                "is_gm": user.id == game_session.game_master,
            }

        elif action_type in self.MAP_ACTIONS:
            message_type = "send_all"
            game_session.map = meta if action_type == "map" else "Global"

            serializer = HeroSessionSerializer()
            hero_sessions = await self.get_all_herosessions(game_session, serializer)
            heroes = {
                str(hero['id']): hero for hero in hero_sessions
            }
            if action_type == "map":
                json_data["meta"] = {
                    "game_objects": {**game_session.current_game_objects, **heroes},
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

        elif action_type in self.DRAW_ACTIONS:
            if action_type.startswith("draw"):
                json_data["meta"]["sender"] = self.user_info["id"]  # ToDo: save polygons/etc to game_objects

        elif action_type in self.TOGGLE_ACTIONS:
            pass  # ToDo: save state
        else:
            return await self.error_response(f"Action type '{action_type}' is not available!")

        await self.start_sending(message_type, json_data)
        if save:
            await self.save_game_session(save)

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
