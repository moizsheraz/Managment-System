from django.urls import path
from . import views

urlpatterns = [
    path('', views.Endpoints, name='endpoints'),

    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.user_logout, name='logout'),

    path('create_post/', views.create_post, name='create_post'),
    path('get_posts/', views.get_posts, name='get_posts'),
    path('update_post/<int:pk>/', views.update_post, name='update_post'),
    path('get_post/<int:pk>/', views.get_post, name='get_post'),
    path('delete_post/<int:pk>/', views.delete_post, name='delete_post'),

    path('profile/<int:pk>/', views.get_profile, name='profile'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('delete_profile/', views.delete_profile, name='delete_profile'),

    path('search/', views.search, name='search'),
]