from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, blank=True)
    name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    phone_number = models.CharField(max_length= 200, blank=True)
    address = models.CharField(max_length=100, blank=True)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=1, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics', blank=True, default='avatar.svg')
    

    def __str__(self):
        return self.user.username


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    caption = models.TextField(blank=True)  # e.g: any motivational quote
    tag = models.ForeignKey('Tag', max_length=100, on_delete=models.SET_NULL, null=True)         # e.g: happy, excited, sad
    image = models.ImageField(upload_to='post_pics', blank=True, default='default.jpg')
    date_posted = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.author.username}'s post"


class Tag(models.Model):
    tag = models.CharField(max_length=100)

    def __str__(self):
        return self.tag