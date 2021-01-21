from djongo import models as djongo_models
from django.db import models
import orjson


class GameObjectsField(djongo_models.JSONField):
    def get_prep_value(self, value):
        if not isinstance(value, dict):
            raise ValueError(
                f'Value: {value} must be of type dict/list'
            )
        return orjson.dumps(value, option=orjson.OPT_NON_STR_KEYS)

    def from_db_value(self, value, expression, connection):
        if isinstance(value, dict):
            return value
        return orjson.loads(value)


class Hero(models.Model):
    name = models.TextField(blank=True)
    race = models.TextField(blank=True, default="Human")
    sex = models.TextField(blank=True, default="TREBUSHET")


class Session(models.Model):
    name = models.TextField(blank=True, default="Sample Game")
    description = models.TextField(blank=True, default="")
    map = models.TextField(blank=True, default="Global")
    game_master = models.IntegerField(blank=True, default=-1)
    last_object_id = models.IntegerField(blank=True, default=1)
    game_objects = GameObjectsField(blank=True, default=dict)
    active_users = GameObjectsField(blank=True, default=dict)
    chat = djongo_models.JSONField(blank=True, default=list)
    invitation_code = models.TextField(blank=True, default="XXXXXX")
    is_private = models.BooleanField(blank=True, default=False)

    @property
    def current_game_objects(self):
        if self.map not in self.game_objects:
            self.game_objects[self.map] = {}
        return self.game_objects[self.map]


class HeroSession(models.Model):
    base = models.ForeignKey(Hero, related_name="hero_sessions", related_query_name="hero_session", on_delete=models.CASCADE)
    session = models.ForeignKey(Session, related_name="heroes", related_query_name="hero", on_delete=models.CASCADE)
    game_data = GameObjectsField(blank=True, default=dict)
