import json
import logging
import pydash as _


from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from wzrd.users.redis import auth_manager
from wzrd.users.models import User
from .models import Session


class GameSessionConsumer(JsonWebsocketConsumer):
    UPDATE_FIELDS = ("xy", "sprite")
    ACTION_TYPES = ("add", "delete", "update", "refresh", "clear")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_info = {}
        self.session_name = None

    def get_game_session(self):
        return Session.objects.filter(invitation_code=self.session_name).first()

    def connect(self):
        self.session_name = self.scope["url_route"]["kwargs"]["session_name"]

        token = _.get(self.scope, "cookies.auth_token")
        self.user_info = auth_manager.get_user_info(token)
        # if not self.user_info:
        #     return self.close(code=401)

        if not self.get_game_session():
            
            return self.close(code=4400)

        # Join session group
        async_to_sync(self.channel_layer.group_add)(
            self.session_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.session_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None, **kwargs):
        json_data = json.loads(text_data)
        action_type = json_data["type"]
        meta = json_data.get("meta")

        if action_type not in self.ACTION_TYPES:
            json_data["type"] = "error"
            json_data["meta"] = f"Tried non-existant action_type {action_type}"
            logging.warning(f"[WS {self.session_name}] Tried non-existant action_type {action_type}")
            return self.start_sending("send_me", json_data)

        game_session = self.get_game_session()
        if not game_session:
            json_data["type"] = "error"
            json_data["meta"] = "Game session not found!"
            logging.warning(f"[WS {self.session_name}] Game session not found!")
            return self.start_sending("send_me", json_data)

        message_type = "send_all_but_me"
        if action_type == "add":
            object_id = game_session.last_object_id
            game_session.game_objects[object_id] = meta
            json_data["meta"]["id"] = object_id
            game_session.last_object_id += 1
            game_session.save()

        elif action_type == "update":
            obj = game_session.game_objects.get(str(meta["id"]))
            if not obj:
                json_data["type"] = "error"
                json_data["meta"] = f"Tried non-existant action_type {action_type}"
                logging.warning(f"[WS {self.session_name} UPDATE] Object [{meta['id']}] not found!")
                return self.start_sending("send_me", json_data)

            changes = _.pick(meta, *self.UPDATE_FIELDS)
            if not self.validate_fields(changes):
                json_data["type"] = "error"
                json_data["meta"] = "Field validation failed!"
                logging.warning(f"[WS {self.session_name} UPDATE] Field validation failed!")
                return self.start_sending("send_me", json_data)

            obj.update(changes)
            game_session.save()

        elif action_type == "delete":
            object_id = str(meta["id"])
            if object_id not in game_session.game_objects:
                json_data["type"] = "error"
                json_data["meta"] = f"Object [{meta['id']}] not found!"
                logging.warning(f"[WS {self.session_name} DELETE] Object [{meta['id']}] not found!")
                return self.start_sending("send_me", json_data)

            del game_session.game_objects[object_id]
            game_session.save()

        elif action_type == "refresh":
            message_type = "send_me"
            json_data["meta"] = {
                "game_objects": list(game_session.game_objects.values()),
            }

        elif action_type == "clear":
            game_session.game_objects = {}
            game_session.last_object_id = 1
            game_session.save()

        self.start_sending(message_type, json_data)

    def start_sending(self, message_type, json_data):
        async_to_sync(self.channel_layer.group_send)(
            self.session_name,
            {
                "type": message_type,
                "message": json_data,
                "sender": self.channel_name
            }
        )

    @staticmethod
    def validate_fields(obj):
        if not isinstance(obj, dict):
            return False

        for k, v in obj.items():
            if k == "xy":
                if not isinstance(v, list):
                    return False
        return True

    def send_me(self, event):
        if self.channel_name == event["sender"]:
            return self.send_json(content=event["message"])

    def send_all(self, event):
        self.send_json(content=event["message"])

    def send_all_but_me(self, event):
        if self.channel_name != event["sender"]:
            self.send_json(content=event["message"])
