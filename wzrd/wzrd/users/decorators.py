from django.http import JsonResponse
from functools import wraps

from .redis import auth_manager
from .models import User


def is_authorized(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        self.auth_token = request.COOKIES.get("auth_token")
        if not self.auth_token or not auth_manager.check_token(self.auth_token):
            return JsonResponse({"error": "No auth token"}, status=401)
        self.user = User.objects.filter(id=auth_manager.get_user_field(self.auth_token, "id")).first()
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


