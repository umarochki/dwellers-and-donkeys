import logging
import json
import pydash as _
from nickname_generator import generate

from django.views import View
from rest_framework import status, viewsets
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect

from wzrd.utils import generate_key

from .models import User
from .redis import auth_manager
from .mixins import IsAuthorisedMixin
from .serializers import UserSerializer
from .decorators import is_authorized, set_auth_token


class LoginWithCredentials(View):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get(self, request):
        if auth_manager.check_token_from_request(request):
            return HttpResponseRedirect("/")
        return HttpResponseRedirect("/login")

    def post(self, request):
        try:
            body = json.loads(request.body)
        except json.decoder.JSONDecodeError:
            return HttpResponse("Bad request", status=400)
        username, password = _.at(body, "username", "password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            response = HttpResponse("OK!", status=200)
            auth_token = auth_manager.add_token(user)
            response.set_cookie("auth_token", auth_token)
            return response
        else:
            return HttpResponse("Bad credentials", status=401)


class UserViewSet(viewsets.ModelViewSet, IsAuthorisedMixin):
    @set_auth_token
    @action(detail=False, methods=['POST'])
    def signup(self, request):
        temporary_user = None
        if self.auth_token:
            user_info = auth_manager.get_user_info(self.auth_token)
            if user_info.get("is_temporary"):
                temporary_user = User.objects.get(id=user_info["id"])
            else:
                return HttpResponse("You're already logged in", status=400)
        try:
            body = json.loads(request.body)
        except json.decoder.JSONDecodeError:
            return HttpResponse("Bad request", status=400)

        serializer = UserSerializer(data=body)
        if not serializer.is_valid():
            return JsonResponse({"errors": serializer.errors}, status=400)

        response = HttpResponse("OK!", status=201)
        user = temporary_user or User.objects.create_user(**body)
        if temporary_user:
            if "password" not in body:
                return JsonResponse({"errors": {"password": "This field is required"}}, status=400)
            user.update(**{"is_temporary": False, **body})
            user.save()

        auth_token = auth_manager.add_token(user)
        response.set_cookie("auth_token", auth_token)
        return response

    @action(detail=False, methods=['GET', 'POST'])
    def quickstart(self, request):
        response = HttpResponse("OK!", status=201)
        username = generate('en')  # TODO: query param 'lang'
        user = User.objects.create(username=username, is_temporary=True)
        auth_token = auth_manager.add_token(user)
        response.set_cookie("auth_token", auth_token)
        return response

    @is_authorized
    @action(detail=False, methods=['GET', 'POST'])
    def logout(self, request):
        response = HttpResponseRedirect("/login")
        auth_manager.delete_token(self.auth_token)
        response.delete_cookie("auth_token")
        return response

    @is_authorized
    @action(detail=False, methods=['GET'])
    def me(self, request):
        return JsonResponse(auth_manager.get_user_info(self.auth_token), status=200)
