import logging
import pydash as _
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response

from .models import Session
from .serializers import DetailGameSessionSerializer


# Create your views here
class GameSessionViewSet(viewsets.ModelViewSet):
    model_class = Session
    serializer_class = DetailGameSessionSerializer

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_queryset(self):
        queryset = self.model_class.objects.filter(is_private=False)

        # TODO: сделать ключ вместо id
        game_id = _.get(self, "request.parser_context.kwargs.pk")

        if game_id:
            queryset |= self.model_class.objects.filter(id=game_id)
        if self.request.user.id is not None:
            queryset |= self.model_class.objects.filter(game_master=self.request.user.id)
        return queryset

    def list(self, request, *args, **kwargs):
        res = super().list(request, *args, **kwargs).data
        return Response(res, status=200)

    def get_serializer_context(self):
        return {
            'request': self.request,
        }



