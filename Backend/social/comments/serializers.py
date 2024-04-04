from .models import *
from rest_framework import serializers

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    def create(self, validated_data):
        validated_data['c_auther'] = self.context['request'].user
        validated_data['post'] = self.context['post_id']
        comment = Comment.objects.create(**validated_data)
        return comment