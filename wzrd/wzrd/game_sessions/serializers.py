from rest_framework import serializers

from wzrd.users.redis import auth_manager
from wzrd.utils import generate_key

from .models import Session


class DetailGameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ("id", "name", "description", "game_master", "is_private", "invitation_code", "game_objects")

    def create(self, validated_data):
        user_info = auth_manager.get_user_info_from_request(self.context["request"])
        validated_data["invitation_code"] = generate_key(length=6, upper=True)
        validated_data["game_master"] = user_info.get("id", 0)
        return super().create(validated_data)

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["game_objects"] = instance.game_objects
        return res
