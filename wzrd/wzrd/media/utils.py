import logging
import uuid

from os.path import splitext
from datetime import datetime
from slugify import slugify


def media_slug(instance, filename):
    time = datetime.now().strftime("%y%m%d_%H%M%S")
    uid = uuid.uuid4().hex
    name, ext = splitext(filename)
    return '_'.join([time, uid, slugify(name)])[:250] + ext

