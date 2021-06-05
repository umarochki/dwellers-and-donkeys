from django.contrib.auth.views import PasswordResetView, PasswordResetDoneView, PasswordResetConfirmView, PasswordResetCompleteView
from django.conf.urls import url, include, re_path
from django.contrib import admin
from rest_framework import routers

import wzrd.games.views as games_views
import wzrd.users.views as users_views
import wzrd.media.views as media_views

from .settings import API_PREFIX


router = routers.SimpleRouter()
router.trailing_slash = "/?"
router.register(r"games", games_views.GameSessionViewSet, "game")
router.register(r"heroes", games_views.HeroViewSet, "hero")
router.register(r"media", media_views.MediaViewSet, "media")
router.register(r"maps", media_views.AvailableMapViewSet, "media")

urlpatterns = [
    url("^admin/", admin.site.urls),
    url(f"^{API_PREFIX}", include([
        url("", include(router.urls)),
        url("auth/me", users_views.UserViewSet.as_view({"get": "me"}), name="me"),
        url("auth/login", users_views.LoginWithCredentials.as_view(), name="login"),
        url("auth/signup", users_views.UserViewSet.as_view({"post": "signup"}), name="signup"),
        url("auth/logout", users_views.UserViewSet.as_view({"get": "logout", "post": "logout"}), name="logout"),
        url("auth/quickstart", users_views.UserViewSet.as_view({"get": "quickstart", "post": "quickstart"}), name="quickstart"),
        url("auth/google/", include('google_auth.urls'), name="google_auth"),
        url("auth/google/authorize", users_views.GoogleAuthenticationExtended.as_view(), name="authenticate"),
        url("auth/google_auth", users_views.UserViewSet.as_view({"get": "google_auth"}), name="google_auth"),
        url("heroes/active", games_views.HeroViewSet.as_view({"get": "active"}), name="active"),
        re_path('^auth/reset-password/?$', PasswordResetView.as_view(), name='password_reset'),
        re_path('^auth/reset-password/done/?$', PasswordResetDoneView.as_view(), name='password_reset_done'),
        re_path('^auth/reset-password/confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)$',
                PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
        re_path('^auth/reset-password/complete/?$', PasswordResetCompleteView.as_view(),
                name='password_reset_complete'),
    ])),
]
