from rest_framework import serializers

from .models import Session, Hero, HeroSession


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = ("id", "name", "race", "sex")

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
        for field in HeroSerializer.Meta.fields:
            res[field] = getattr(instance.base, field)
        res["game_data"] = instance.game_data
        return res


class DetailGameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ("id", "name", "description", "game_master", "is_private", "invitation_code", "game_objects")

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["game_objects"] = instance.game_objects
        return res