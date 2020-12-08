from django.contrib.auth.models import AbstractUser
from django.db import models

from wzrd.game_sessions.models import Session
from .managers import UserManager


class User(AbstractUser):
    username = models.TextField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_temporary = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    sessions = models.ManyToManyField(Session)

    def update(self, *args, **kwargs):
        for k, v in kwargs.items():
            if k == "password":
                self.set_password(v)
            else:
                setattr(self, k, v)

