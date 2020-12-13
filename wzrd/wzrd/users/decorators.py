from django.http import JsonResponse
from functools import wraps

from .redis import auth_manager
from .models import User


def is_authorized(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        self.auth_token = request.COOKIES.get("auth_token")
        self.user = User.objects.filter(id=auth_manager.get_user_field(self.auth_token, "id")).first()
        if not self.user:
            if self.auth_token:
                auth_manager.delete_token(self.auth_token)
            return JsonResponse({"error": "Unauthorized"}, status=401)

        return func(self, request, *args, **kwargs)
    return wrapper


def set_auth_token(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        self.auth_token = request.COOKIES.get("auth_token")
        self.user = User.objects.filter(id=auth_manager.get_user_field(self.auth_token, "id")).first()
        return func(self, request, *args, **kwargs)
    return wrapper


def self_set_auth_token(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        self.auth_token = self.request.COOKIES.get("auth_token")
        self.user = User.objects.filter(id=auth_manager.get_user_field(self.auth_token, "id")).first()
        return func(self, *args, **kwargs)
    return wrapper


