from rest_framework import serializers
from .models import Session


class DetailGameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('id', 'name', 'description', 'game_master', 'is_private')

    def create(self, validated_data):
        validated_data.update({'game_master': self.context["request"].user.id})
        return super().create(validated_data)
