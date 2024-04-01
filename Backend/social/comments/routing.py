from django.urls import re_path, path
from .consumers import CommentConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

websocket_urlpatterns = [
    re_path(r'ws/comments/(?P<post_id>\d+)/$', CommentConsumer.as_asgi()),
    path('ws/comments/', CommentConsumer.as_asgi())

]

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
