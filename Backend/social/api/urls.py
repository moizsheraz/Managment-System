from django.urls import path
from . import views
from .views import PasswordResetView, PasswordResetConfirmView, FollowUser, FollowersList
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', views.Endpoints, name='endpoints'),

    path('register/', views.register_user, name='register'),

    path("token/obtain/", TokenObtainPairView.as_view(), name="token_create"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path('get_users/', views.get_users, name='get_user'),
    path('get_user/<int:pk>/', views.get_user, name='get_user'),

    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),


    path('create_post/', views.create_post, name='create_post'),
    path('get_posts/', views.get_posts, name='get_posts'),
    path('update_post/<int:pk>/', views.update_post, name='update_post'),
    path('get_post/<int:pk>/', views.get_post, name='get_post'),
    path('delete_post/<int:pk>/', views.delete_post, name='delete_post'),

    path('get_tags/', views.get_tags, name='get_tags'),


    path('profile/<int:pk>/', views.get_profile, name='profile'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('delete_profile/', views.delete_profile, name='delete_profile'),

    path('search/', views.search, name='search'),

    path('like/<int:post_id>/', views.like_post, name='like-post'),
    path('unlike/<int:post_id>/', views.unlike_post, name='unlike-post'),
    path('liked_posts/', views.get_liked_posts, name='get-liked-posts'),

    path('follow/', FollowUser.as_view(), name='follow_user'),
    path('unfollow/', FollowUser.as_view(), name='unfollow_user'),
    path('followers/<int:user_id>/', FollowersList.as_view(), name='followers_list'),
]