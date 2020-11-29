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
    ACTION_TYPES = ('add', 'delete', 'update')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_info = {}
        self.session_name = None

    def get_game_session(self):
        return Session.objects.filter(invitation_code=self.session_name).first()

    def connect(self):
        self.session_name = self.scope['url_route']['kwargs']['session_name']

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
        text_data_json = json.loads(text_data)
        action_type = text_data_json['type']
        message = text_data_json['meta']

        if action_type in self.ACTION_TYPES:
            async_to_sync(self.channel_layer.group_send)(
                self.session_name,
                {
                    'type': action_type,
                    'message': message
                }
            )
        else:
            return self.close(code=4400)

    @staticmethod
    def validate_fields(obj):
        if not isinstance(obj, dict):
            return False

        for k, v in obj.items():
            if k == "xy":
                if not isinstance(v, list):
                    return False
        return True

    def add(self, event):
        game_session = self.get_game_session()
        object_id = game_session.last_object_id
        game_session.game_objects[object_id] = {"id": object_id, **event["message"]}
        game_session.last_object_id += 1
        game_session.save()
        self.send_json(content=game_session.game_objects)

    def update(self, event):
        game_session = self.get_game_session()
        obj = game_session.game_objects.get(str(event["message"]["id"]))
        if not obj:
            return self.close(code=4404)

        changes = _.pick(event["message"], *self.UPDATE_FIELDS)
        if not self.validate_fields(changes):
            self.close(code=4404)
        obj.update(changes)
        game_session.save()
        self.send_json(content=game_session.game_objects)

    def delete(self, event):
        object_id = str(event["message"]["id"])
        game_session = self.get_game_session()
        if object_id not in game_session.game_objects:
            return self.close(code=4404)

        del game_session.game_objects[object_id]
        game_session.save()
        self.send_json(content=game_session.game_objects)
