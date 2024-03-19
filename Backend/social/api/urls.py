from django.urls import path
from . import views

urlpatterns = [
    path('', views.Endpoints, name='endpoints'),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.user_logout, name='logout'),
]