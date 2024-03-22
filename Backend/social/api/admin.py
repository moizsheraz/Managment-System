from django.contrib import admin
from .models import User, Post, Tag
# Register your models here.
from rest_framework.authtoken.admin import TokenAdmin
class CustomTokenAdmin(TokenAdmin):
    search_fields = ['key', 'user__username']
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Tag)