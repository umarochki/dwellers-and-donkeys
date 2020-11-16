from django.contrib.auth.models import AbstractUser
from django.db import models

from wzrd.game_sessions.models import Session
from .managers import UserManager


class User(AbstractUser):

    username = models.TextField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()

    sessions = models.ManyToManyField(Session)
