import logging
import pydash as _

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect

from wzrd.utils import generate_key
from wzrd.users.decorators import is_authorized, self_set_auth_token
from wzrd.users.mixins import IsAuthorisedMixin

from .models import Session, Hero, HeroSession
from .serializers import DetailGameSessionSerializer, HeroSerializer, HeroSessionSerializer


class HeroViewSet(viewsets.ModelViewSet, IsAuthorisedMixin):
    model_class = Hero
    serializer_class = HeroSerializer

    @self_set_auth_token
    def get_queryset(self):
        if not self.user:
            return self.model_class.objects.none()
        return self.user.heroes.all()

    @is_authorized
    def list(self, request, *args, **kwargs):
        res = super().list(request, *args, **kwargs).data
        return JsonResponse(res, safe=False, status=200)

    @is_authorized
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @is_authorized
    @action(detail=False, methods=['GET'])
    def active(self, request, *args, **kwargs):
        queryset = HeroSession.objects.filter(base__user=self.user)
        self.serializer_class = HeroSessionSerializer

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.user
        }


class GameSessionViewSet(viewsets.ModelViewSet, IsAuthorisedMixin):
    model_class = Session
    serializer_class = DetailGameSessionSerializer

    @self_set_auth_token
    def get_queryset(self):
        queryset = self.model_class.objects.none()
        pk = _.get(self, "request.parser_context.kwargs.pk")
        if pk:
            return self.model_class.objects.filter(pk=pk)
        queryset |= self.model_class.objects.filter(is_private=False)
        queryset |= self.model_class.objects.filter(game_master=self.user.id)
        return queryset

    @is_authorized
    def create(self, request, *args, **kwargs):
        request.data.update({
            "invitation_code": generate_key(length=6, upper=True),
            "game_master": self.user.id
        })
        return super().create(request, *args, **kwargs)

    @is_authorized
    def list(self, request, *args, **kwargs):
        res = super().list(request, *args, **kwargs).data
        return JsonResponse(res, safe=False, status=200)

    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.user
        }

