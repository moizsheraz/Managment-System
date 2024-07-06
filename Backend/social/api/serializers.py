from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'password', 'profile_pic']
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
        likes_data = validated_data.pop('likes', [])
        if image:
            post = Post.objects.create(**validated_data)
        else:
            post = Post.objects.create(**validated_data)
        post.likes.set(likes_data)
        return post
    

class ProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=False, allow_null=True, allow_empty_file=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'bio', 'phone_number', 'address', 'gender', 'profile_pic']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'