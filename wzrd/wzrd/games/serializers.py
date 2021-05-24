import logging
import pydash as _

from rest_framework import serializers
from .models import Session, Hero, HeroSession


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = ("id", "name", "race", "sex", "sprite", "description", "preview")

    def create(self, validated_data):
        user = self.context["user"]
        instance = super().create(validated_data)
        if user:
            user.heroes.add(instance)
        return instance


class HeroSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = ("id", )

    def create(self, validated_data):
        user = self.context["user"]
        instance = super().create(validated_data)
        if user:
            user.heroes.add(instance)
        return instance

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["id"] = res["id"] + 10000
        for field in HeroSerializer.Meta.fields:
            if field == "id":
                continue
            res[field] = getattr(instance.base, field)
        res.update(instance.game_data)
        return res


class DetailGameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ("id", "name", "description", "game_master", "is_private", "invitation_code")

    def __init__(self, *args, **kwargs):
        self.short = kwargs.pop("short", False)
        super().__init__(*args, **kwargs)

    def to_representation(self, instance):
        res = super().to_representation(instance)
        if not self.short:
            res["game_objects"] = instance.game_objects
        return res
