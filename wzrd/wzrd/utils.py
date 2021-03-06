import os
import binascii


def generate_key(length=20, upper=False):
    res = binascii.hexlify(os.urandom(length)).decode()
    if upper:
        return res.upper()
    return res


def is_invite_key(token):
    return isinstance(token, str) and len(token) == 12
