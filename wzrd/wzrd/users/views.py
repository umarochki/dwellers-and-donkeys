import logging
import json
import pydash as _

from django.views import View
from rest_framework import status, viewsets
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect

from .models import User
from .redis import auth_manager
from .decorators import is_authorized
from .mixins import IsAuthorisedMixin


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
            auth_token = auth_manager.add_token(id=user.id, username=user.username)
            response.set_cookie("auth_token", auth_token)
            return response
        else:
            return HttpResponse("Bad credentials", status=401)


class UserViewSet(viewsets.ModelViewSet, IsAuthorisedMixin):
    @action(detail=False, methods=['POST'])
    def signup(self, request):
        try:
            body = json.loads(request.body)
        except json.decoder.JSONDecodeError:
            return HttpResponse("Bad request", status=400)
        username, password = _.at(body, "username", "password")
        User.objects.create_user(username=username, password=password)
        return HttpResponse("OK!", status=200)

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
