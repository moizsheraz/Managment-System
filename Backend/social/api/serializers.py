from rest_framework import serializers
from .models import *
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.encoding import force_bytes

class UserSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','username', 'password', 'profile_pic', 'followers', 'following']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def get_followers(self, obj):
        return obj.followers.values_list('id', flat=True)

    def get_following(self, obj):
        return obj.following.values_list('id', flat=True)


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




class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        email = data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("No user is associated with this email address"))
        return data
    
    def save(self, request):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        current_site = get_current_site(request)
        domain = current_site.domain
        reset_link = reverse('password-reset-confirm', kwargs={'uidb64': uid, 'token': token})
        reset_url = f"http://{domain}{reset_link}"
        send_mail(
            'Password Reset',
            f'Use the link below to reset your password:\n{reset_url}',
            'noreply@example.com',
            [email],
            fail_silently=False,
        )


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        try:
            uid = self.context['uid']
            token = self.context['token']
            user_pk = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_pk)
            if not default_token_generator.check_token(user, token):
                raise serializers.ValidationError(_('Invalid token'))
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError(_('Invalid token'))
        return attrs
    
    def save(self):
        uid = self.context['uid']
        token = self.context['token']
        user_pk = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_pk)
        user.set_password(self.validated_data['new_password'])
        user.save()

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']