from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from .serializers import *
# Create your views here.

@api_view(['GET'])
def Endpoints(request):
    endpoints = {
        'Register': '/register',
        'Login': '/login',
        'Logout': '/logout',

        'Get Posts': '/get_posts',
        'Get Post': '/get_post/id',
        'Create Post': '/create_post',
        'Update Post': '/update_post/id',
        'Delete Post': '/delete_post/id',
        }
    
    return Response(endpoints, status=status.HTTP_200_OK)


# api view for registering a user   
@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User Created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# api view for logging in a user
@api_view(['POST'])
def login_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

# api view for logging out a user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    if request.method == 'POST':
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# api view for creating a post
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, FileUploadParser])
def create_post(request):
    if request.method == 'POST':
        mutable_data = request.data.copy()
        mutable_data['author'] = request.user.id
        serializer = PostSerializer(data=mutable_data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# api view for updating a post
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, FileUploadParser])
def update_post(request, pk):
    if request.method == 'PUT':
        try:
            post = Post.objects.get(id=pk)
            if post.author == request.user:
                mutable_data = request.data.copy()
                mutable_data['author'] = request.user.id
                serializer = PostSerializer(post, data=mutable_data, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'You are not authorized to update this post'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# api view for getting all posts
@api_view(['GET'])
def get_posts(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# api view for getting a single post
@api_view(['GET'])
def get_post(request, pk):
    if request.method == 'GET':
        try:
            post = Post.objects.get(id=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  

# api view for deleting a post
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    if request.method == 'DELETE':
        try:
            post = Post.objects.get(id=pk)
            if post.author == request.user:
                post.delete()
                return Response({'message': 'Post deleted successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'You are not authorized to delete this post'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)