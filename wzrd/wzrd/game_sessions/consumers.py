import json
import logging
import pydash as _


from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from wzrd.users.redis import auth_manager
from wzrd.users.models import User

from .models import Session


class GameSessionConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_info = {}
        self.session_name = None
        self.session_group_name = None

    @property
    def game_session(self):
        return Session.objects.filter(invitation_code=self.session_name).first()

    def connect(self):
        self.session_name = self.scope['url_route']['kwargs']['session_name']
        self.session_group_name = 'chat_%s' % self.session_name

        token = _.get(self.scope, "cookies.auth_token")
        self.user_info = auth_manager.get_user_info(token)
        if not self.user_info:
            return self.close(code=401)

        if not self.game_session:
            return self.close(code=404)

        # Join session group
        async_to_sync(self.channel_layer.group_add)(
            self.session_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.session_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None, **kwargs):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to session group
        async_to_sync(self.channel_layer.group_send)(
            self.session_group_name,
            {
                'type': 'send_back',
                'message': message
            }
        )

    def send_back(self, event):
        message = event["message"]
        game_session = self.game_session
        game_session.game_objects[message] = message
        game_session.save()
        self.send_json(content=game_session.game_objects)
