import os
import logging
import pydash as _

from rest_framework import viewsets
from rest_framework.response import Response
from django.http.response import HttpResponse

from wzrd.settings import API_PREFIX, DEFAULT_MEDIA_ROOT, DEFAULT_MEDIA_URL
from wzrd.games.models import Session
from wzrd.users.decorators import is_authorized, self_set_auth_token
from wzrd.users.mixins import IsAuthorisedMixin

from .models import Media
from .utils import link_to_hash
from .serializers import MediaSerializer, ListMapSerializer


class MediaViewSet(viewsets.ModelViewSet, IsAuthorisedMixin):
    model_class = Media
    serializer_class = MediaSerializer

    @self_set_auth_token
    def get_queryset(self):
        pk = _.get(self, "request.parser_context.kwargs.pk")
        if pk:
            return self.model_class.objects.filter(pk=pk)
        return self.model_class.objects.filter(creator=self.user.id)

    @is_authorized
    def create(self, request, *args, **kwargs):
        request.data._mutable = True
        request.data.update({
            "creator": self.user.id
        })
        request.data._mutable = False
        res = super().create(request, *args, **kwargs)
        return res


class AvailableMapViewSet(MediaViewSet):
    serializer_class = ListMapSerializer

    @self_set_auth_token
    def get_queryset(self):
        return super().get_queryset().filter(type="map")

    @is_authorized
    def list(self, request, *args, **kwargs):
        res = []
        host = request.META.get("HTTP_X_FORWARDED_HOST")
        for filename in os.listdir(DEFAULT_MEDIA_ROOT):
            link = f"http://{host}{DEFAULT_MEDIA_URL}{filename}"
            res.append({
                "file": link,
                "name": filename[:filename.rfind(".")],
                "hash": link_to_hash(link)
            })

        game_id = request.GET.get("game_id")
        if game_id:
            session = Session.objects.filter(invitation_code=game_id).first()
            if not session:
                return Response("Game not found!", status=404)
            queryset = self.model_class.objects.filter(creator=session.game_master)
        else:
            queryset = self.filter_queryset(self.get_queryset())
        res += self.get_serializer(queryset, many=True).data
        return Response(res)


