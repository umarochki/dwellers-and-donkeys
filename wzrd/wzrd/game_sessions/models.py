from djongo import models as djongo_models
from django.db import models


class Session(models.Model):
    name = models.TextField(blank=True, default="Sample Game")
    description = models.TextField(blank=True, default="")
    game_master = models.IntegerField(blank=True, default=0)
    game_objects = djongo_models.JSONField(blank=True, default=[])

    invitation_code = models.TextField(blank=True, default="XXXXXX")
    is_private = models.BooleanField(blank=True, default=False)
