import logging
import pydash as _

from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import action

from wzrd.utils import generate_key, is_invite_key
from wzrd.users.mixins import IsAuthorisedMixin
from wzrd.users.decorators import is_authorized, self_set_auth_token

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
        queryset |= self.model_class.objects.filter(is_private=False)
        queryset |= self.model_class.objects.filter(game_master=self.user.id)
        return queryset

    @is_authorized
    def retrieve(self, request, *args, **kwargs):
        pk = _.get(self, "request.parser_context.kwargs.pk")
        if is_invite_key(pk):
            self.lookup_field = "invitation_code"
            self.kwargs[self.lookup_field] = pk
        return super().retrieve(request, *args, **kwargs)

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

    @is_authorized
    @action(detail=False, methods=['GET'])
    def history(self, request, *args, **kwargs):
        qs = self.user.sessions.exclude(game_master=self.user.id)
        serializer = self.get_serializer(qs, many=True, short=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    @is_authorized
    @action(detail=False, methods=['GET'])
    def gm(self, request, *args, **kwargs):
        qs = self.model_class.objects.filter(game_master=self.user.id)
        serializer = self.get_serializer(qs, many=True, short=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.user
        }


