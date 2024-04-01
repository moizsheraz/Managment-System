import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Comment
from api.models import *
from django.contrib.auth.models import AnonymousUser


class CommentConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = 'comments'
        self.user = self.scope['user']
        self.post_id = self.scope['url_route']['kwargs']['post_id']
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )
        self.accept()
        
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['c_text']
        self.user = self.scope["user"]

        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                'type': 'comment_message',
                'message': message,
                'user_id': self.user.id if self.user and not isinstance(self.user, AnonymousUser) else None,
                'post_id': self.post_id
            }
        )

        if self.user and not isinstance(self.user, AnonymousUser):
            Comment.objects.create(c_text=message, c_auther=self.user, post_id=self.post_id)

    def comment_message(self, event):
        message = event['message']
        user_id = event['user_id']
        post_id = event['post_id']

        self.send(text_data=json.dumps({
            'c_text': message,
            'user_id': user_id,
            'post_id': post_id
        }))

