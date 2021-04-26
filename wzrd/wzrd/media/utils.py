import logging
import uuid
import hashlib
from os.path import splitext
from datetime import datetime
from slugify import slugify


def link_to_hash(link: str):
    return hashlib.md5(link.encode("utf-8")).hexdigest()


def media_slug(instance, filename):
    time = datetime.now().strftime("%y%m%d_%H%M%S")
    uid = uuid.uuid4().hex
    name, ext = splitext(filename)
    return '_'.join([time, uid, slugify(name)])[:250] + ext
