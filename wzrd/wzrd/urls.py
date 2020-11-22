from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers

import wzrd.game_sessions.views as games_views
import wzrd.users.views as users_views

from .settings import API_PREFIX


router = routers.SimpleRouter()
router.trailing_slash = "/?"
router.register(r'games', games_views.GameSessionViewSet, 'game')

urlpatterns = [
    url('^admin/', admin.site.urls),
    url(f'^{API_PREFIX}', include([
        url('', include(router.urls)),
        url('auth/login', users_views.LoginWithCredentials.as_view(), name="login")
    ])),
    url('^games$', games_views.index, name="games"),
    url(r'^games/(?P<room_name>[\w\d]+)', games_views.room, name='room'),
]
