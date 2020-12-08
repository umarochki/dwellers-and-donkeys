from django.http import JsonResponse
from .redis import auth_manager


def is_authorized(func):
    def wrapper(self, request, *args, **kwargs):
        self.auth_token = request.COOKIES.get("auth_token")
        if not self.auth_token or not auth_manager.check_token(self.auth_token):
            return JsonResponse({"error": "No auth token"}, status=401)
        return func(self, request, *args, **kwargs)
    return wrapper


def set_auth_token(func):
    def wrapper(self, request, *args, **kwargs):
        self.auth_token = request.COOKIES.get("auth_token")
        return func(self, request, *args, **kwargs)
    return wrapper
