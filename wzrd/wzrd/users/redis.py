import json
from redis import Redis

from wzrd.utils import generate_key
from .models import User


class AuthRedisManager:
    def __init__(self):
        self._redis = Redis(host='redis', port=6379)

    def add_token(self, user):
        fields = {
            field: getattr(user, field)
            for field in ("id", "username", "first_name", "is_temporary")
            if getattr(user, field) is not None
        }
        token = generate_key(length=20)
        self._redis.set(token, json.dumps(fields))
        return token

    def delete_token(self, token):
        if not token:
            return
        self._redis.delete(token)

    def check_token(self, token):
        if not token:
            return False
        return self._redis.exists(token)

    def get_user_info(self, token):
        if not token:
            return {}
        json_data = self._redis.get(token)
        if not json_data:
            return {}
        return json.loads(json_data)

    def get_user_field(self, token, field):
        user_info = self.get_user_info(token)
        if user_info:
            return user_info.get(field)

    def check_token_from_request(self, request):
        auth_token = request.COOKIES.get("auth_token")
        if auth_token and self.check_token(auth_token):
            return True
        return False

    def get_user_from_request(self, request):
        auth_token = request.COOKIES.get("auth_token")
        user_id = self.get_user_field(auth_token)
        return User.objects.filter(id=user_id).first()

    def get_user_info_from_request(self, request):
        auth_token = request.COOKIES.get("auth_token")
        return self.get_user_info(auth_token)


auth_manager = AuthRedisManager()
