from django.http import JsonResponse
from .redis import auth_manager


def is_authorized(func):
    def wrapper(self, request, *args, **kwargs):
        auth_token = request.COOKIES.get("auth_token")
        if not auth_token or not auth_manager.check_token(auth_token):
            return JsonResponse({"error": "No auth token"}, status=401)
        return func(self, request, *args, auth_token=auth_token, **kwargs)
    return wrapper




