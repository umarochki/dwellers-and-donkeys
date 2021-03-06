import logging

from rest_framework import serializers

from .models import Media
from .utils import link_to_hash


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('file', 'id', 'created', 'creator', 'name', 'type')

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res['hash'] = link_to_hash(res['file'])
        return res


class ListMapSerializer(MediaSerializer):
    class Meta:
        model = Media
        fields = ('file', 'name')

