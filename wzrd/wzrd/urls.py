from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers

import wzrd.games.views as games_views
import wzrd.users.views as users_views

from .settings import API_PREFIX


router = routers.SimpleRouter()
router.trailing_slash = "/?"
router.register(r"games", games_views.GameSessionViewSet, "game")
router.register(r"heroes", games_views.HeroViewSet, "hero")


urlpatterns = [
    url("^admin/", admin.site.urls),
    url(f"^{API_PREFIX}", include([
        url("", include(router.urls)),
        url("auth/me", users_views.UserViewSet.as_view({"get": "me"}), name="me"),
        url("auth/login", users_views.LoginWithCredentials.as_view(), name="login"),
        url("auth/signup", users_views.UserViewSet.as_view({"post": "signup"}), name="signup"),
        url("auth/logout", users_views.UserViewSet.as_view({"get": "logout", "post": "logout"}), name="logout"),
        url("auth/quickstart", users_views.UserViewSet.as_view({"get": "quickstart", "post": "quickstart"}), name="quickstart"),
        url("heroes/active", games_views.HeroViewSet.as_view({"get": "active"}), name="active"),
    ])),
]
