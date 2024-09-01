from django.urls import path
from . import views

urlpatterns = [
    path('post/<int:post_id>/', views.comment_view, name='comment_view'),
]
                                                