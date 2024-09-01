from .models import *
from rest_framework import serializers

class CommentSerializer(serializers.ModelSerializer):
    c_auther_username = serializers.ReadOnlyField(source='c_auther.username')
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['c_auther', 'post']

    def create(self, validated_data):
        validated_data['c_auther'] = self.context['request'].user
        validated_data['post'] = self.context['post_id']
        return super().create(validated_data)
