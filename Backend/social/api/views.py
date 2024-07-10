from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, parser_classes
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, generics
# from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
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
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User Created'}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# api view for logging in a user
# @api_view(['POST'])
# def login_user(request):
#     if request.method == 'POST':
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         user = authenticate(username=username, password=password)

#         if user:
#             token, created = Token.objects.get_or_create(user=user)
#             return Response({'token': token.key}, status=status.HTTP_200_OK)

#         return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

# api view for logging out a user
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def user_logout(request):
#     if request.method == 'POST':
#         try:
#             request.user.auth_token.delete()
#             return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
@permission_classes([AllowAny])
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


# api view for getting user profile
@api_view(['GET'])
@permission_classes([AllowAny])
def get_profile(request, pk):
    if request.method == 'GET':
        try:
            profile = User.objects.get(id=pk)
            if profile:
                serializer = ProfileSerializer(profile)
                print(serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# api view for updating user profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    if request.method == 'PUT':
        try:
            profile = User.objects.get(id=request.user.id)
            data = request.data.copy()
            if 'profile_pic' not in data or not data['profile_pic']:
                data.pop('profile_pic', None)
            
            serializer = ProfileSerializer(profile, data=data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# api view for deleting a user
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request):
    if request.method == 'DELETE':
        try:
            user = User.objects.get(id=request.user.id)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


# api view for searching posts, tags, and users
@api_view(['GET'])
@permission_classes([AllowAny])
def search(request):
    if request.method == 'GET':
        query = request.query_params.get('query')
        posts = Post.objects.filter(caption__icontains=query) | Post.objects.filter(tag__tag__icontains=query) | Post.objects.filter(author__username__icontains=query)
        
        post_serializer = PostSerializer(posts, many=True)
        
        response = {
            'posts': post_serializer.data
        }
        
        return Response(response, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)


# api call for getting the tags with id and name
@api_view(['GET'])
@permission_classes([AllowAny])
def get_tags(request):
    if request.method == 'GET':
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

# api call for getting user_id and username
@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)


# api for like 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user = request.user

    if user in post.likes.all():
        return Response({'status': 'Already Liked'}, status=200)
    else:
        post.likes.add(user)
        return Response({'status': 'Liked Successfully'}, status=201)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlike_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user = request.user

    if user in post.likes.all():
        post.likes.remove(user)
        return Response({'status': 'unliked'}, status=204)
    else:
        return Response({'status': 'not liked'}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_liked_posts(request):
    user = request.user
    liked_posts = Post.objects.filter(likes=user).values_list('id', flat=True)
    return Response({'liked_posts': list(liked_posts)}, status=200)

class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(request=request)
            return Response({'message': 'Password reset link has been sent to your email'}, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'uid': uidb64, 'token': token})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)


class FollowUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        following_id = request.data.get('following_id')
        following_user = User.objects.get(id=following_id)
        follow, created = Follow.objects.get_or_create(follower=request.user, following=following_user)
        if created:
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        following_id = request.data.get('following_id')
        following_user = User.objects.get(id=following_id)
        Follow.objects.filter(follower=request.user, following=following_user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FollowersList(generics.ListAPIView):
    serializer_class = FollowSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        print(user.followers.all())
        return user.followers.all()
    
# api view for getting one user
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user(request, pk):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# get all profiles
@api_view(['GET'])
@permission_classes([AllowAny])
def get_profiles(request):
    if request.method == 'GET':
        profiles = User.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

# api view for getting posts of that user who is followed by the current user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followed_posts(request):
    if request.method == 'GET':
        following = request.user.following.all()
        following_users = [follow.following for follow in following]
        following_users.append(request.user)
        posts = Post.objects.filter(author__in=following_users)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)