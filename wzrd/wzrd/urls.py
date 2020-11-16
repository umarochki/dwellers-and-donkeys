from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers

import wzrd.game_sessions.views as games_views

router = routers.DefaultRouter()
router.register(r'games', games_views.GameSessionViewSet, 'game')

urlpatterns = [
    url('^admin/', admin.site.urls),
    url('^api/v1/', include(router.urls))
]
