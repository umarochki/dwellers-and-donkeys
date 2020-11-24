import logging
import json
import pydash as _

from django.views import View
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect

from wzrd.users.redis import auth_manager


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
            auth_token = auth_manager.add_token(id=user.id, username=user.id)
            response.set_cookie("auth_token", auth_token)
            return response
        else:
            return HttpResponse("Bad credentials", status=401)
