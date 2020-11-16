from django.db import models


class Session(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True, null=True)
    game_master = models.IntegerField(blank=True, null=True)

    is_private = models.BooleanField(default=False)
