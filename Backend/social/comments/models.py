from django.db import models
from api.models import *

# Create your models here.
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    c_auther = models.ForeignKey(User, on_delete=models.CASCADE)
    c_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.c_text