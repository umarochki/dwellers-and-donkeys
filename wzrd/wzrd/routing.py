from django.conf.urls import url
import wzrd.games.consumers as consumers


websocket_urlpatterns = [
    url(r'ws/games/(?P<session_name>[\w\d]+)$', consumers.GameSessionConsumer.as_asgi()),
]
