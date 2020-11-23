import logging

from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse

from django.shortcuts import render
from django.views import View

from wzrd.users.redis import auth_manager


class LoginWithCredentials(View):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get(self, request):
        if auth_manager.check_token_from_request(request):
            return HttpResponse("Already logged in", 200)
        return render(request, 'login.html')

    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            response = HttpResponse('ok') #HttpResponseRedirect("/")
            auth_token = auth_manager.add_token(id=user.id, username=user.id)
            response.set_cookie("auth_token", auth_token)
            return response
        else:
            return JsonResponse({"error": "Bad credentials"}, status=401)
