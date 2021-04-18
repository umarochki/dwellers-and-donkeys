import logging
from six.moves.urllib import parse as urlparse

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from .models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('file', 'id', 'created', 'creator')
