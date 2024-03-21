from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        image = self.context['request'].FILES.get('image')
        if image:
            post = Post.objects.create(**validated_data)
        else:
            post = Post.objects.create(**validated_data)
        return post