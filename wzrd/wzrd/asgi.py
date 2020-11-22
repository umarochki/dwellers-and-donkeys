import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import wzrd.routing
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wzrd.settings")


application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            wzrd.routing.websocket_urlpatterns
        )
    ),
})
