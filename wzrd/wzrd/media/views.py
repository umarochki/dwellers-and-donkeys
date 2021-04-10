import pydash as _
from rest_framework import viewsets

from wzrd.users.decorators import is_authorized, self_set_auth_token
from wzrd.users.mixins import IsAuthorisedMixin

from .models import Media
from .serializers import MediaSerializer


class MediaViewSet(viewsets.ModelViewSet, IsAuthorisedMixin):
    model_class = Media
    serializer_class = MediaSerializer

    @self_set_auth_token
    def get_queryset(self):
        queryset = self.model_class.objects.none()
        pk = _.get(self, "request.parser_context.kwargs.pk")
        if pk:
            return self.model_class.objects.filter(pk=pk)
        queryset |= self.model_class.objects.filter(creator=self.user.id)
        return queryset

    @is_authorized
    def create(self, request, *args, **kwargs):
        request.data._mutable = True
        request.data.update({
            "creator": self.user.id
        })
        request.data._mutable = False
        return super().create(request, *args, **kwargs)
