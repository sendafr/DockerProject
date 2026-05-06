from django.shortcuts import redirect
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer

User = get_user_model()


# ─── Register ─────────────────────────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ─── Logout (Blacklist Refresh Token) ─────────────────────────────────────────
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {'message': 'Logged out successfully.'},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return Response(
                {'error': 'Invalid token.'},
                status=status.HTTP_400_BAD_REQUEST
            )


# ─── Profile (Read + Update + Delete) ─────────────────────────────────────────
class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response(
            {'message': 'Account deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT
        )


# ─── Change Password ──────────────────────────────────────────────────────────
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.update(request.user, serializer.validated_data)
            return Response(
                {'message': 'Password changed successfully.'},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






"""User= get_user_model()
#
class UserCreate(generics.CreateAPIView):
    users= User.objects.all()
    serializer_class= UserSerializer
    pagination_class= AllowAny

@api_view(['POST'])
def create_user(request):
    #Register a new user
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create a Django User for authentication
        user = User.objects.create_user(
            name=user.name,
            email=user.email,
            password=request.data.get('password')
        )
        return Response(
            {"message": "User registered successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view([ 'PUT', 'DELETE'])
def user_detail(request, pk):
    #
    GET: Retrieve a specific user
    PUT: Update a specific user
    DELETE: Delete a specific user
    
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    
    if request.method == 'PUT':
        data=request.data
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User updated successfully", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )





class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class= UserSerializer
    pagination_class=[IsAuthenticated]

    def get_object(self):
        return self.request.user

@login_required
def google_login_callback(request):
    user = request.user

    Social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:",Social_accounts )


    social_account = Social_accounts.first()
    if not social_account:
        print("No social Account for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account, account_provider="google"). first()


    if token:
        print('google token found:',token.token)
        reflesh = RefreshToken.for_user(user)
        access_token = str(reflesh.access_token)
        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    else:
        print('No access_token found for user:',user)
        return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')
    
@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data= json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)
            if not google_access_token:
                return JsonResponse({'detail':'access token is missing.'},status=400)
            return JsonResponse({'valid':True})
        except json.JSONDecodeError:
            return JsonResponse({'detail':'invali json'}, status=400)
    return JsonResponse({'detail':'method not allowed'}, status=405 )
"""