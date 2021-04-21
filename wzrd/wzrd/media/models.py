import logging
import os

from django.db import models

from wzrd.settings import MEDIA_ROOT
from .utils import media_slug


class Media(models.Model):
    file = models.ImageField(upload_to=media_slug, max_length=256, null=True)
    type = models.CharField(max_length=16, null=True, blank=True)
    name = models.TextField(null=True, default="Untitled")
    created = models.DateTimeField(auto_now_add=True)
    creator = models.IntegerField(null=True, blank=True)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        file_path = f"{MEDIA_ROOT}/{self.filename}"
        if not os.path.isfile(file_path):
            return logging.warning(f"Media ({self.id}) {self.filename} is already deleted")
        os.remove(file_path)
