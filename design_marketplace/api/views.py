from django.contrib.auth import get_user_model, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q

from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from .models import DesignerProfile, Design, Message, Booking, Payment, Notification, User
from .serializers import (
    UserSerializer, DesignerProfileSerializer, DesignSerializer,
    MessageSerializer, BookingSerializer, PaymentSerializer, NotificationSerializer
)

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class CsrfExemptAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        print("🔐 Login request received:", request.data)
        response = super().post(request, *args, **kwargs)
        print("🔐 Login response:", response.data)
        return response

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("📥 Registration data:", request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            print("✅ Registration successful for:", user.username)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
            }, status=status.HTTP_201_CREATED)
        print("❌ Registration failed with errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("🚪 Logging out user:", request.user.username)
        request.user.auth_token.delete()
        logout(request)
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class DesignerProfileViewSet(viewsets.ModelViewSet):
    queryset = DesignerProfile.objects.all()
    serializer_class = DesignerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class DesignViewSet(viewsets.ModelViewSet):
    queryset = Design.objects.all()
    serializer_class = DesignSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        print("📡 Design list requested by:", request.user)
        try:
            response = super().list(request, *args, **kwargs)
            print("✅ Designs fetched successfully")
            return response
        except Exception as e:
            print("🔥 Failed to fetch designs:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        print(f"🔍 Retrieving Design with id={kwargs.get('pk')} for user={request.user}")
        try:
            response = super().retrieve(request, *args, **kwargs)
            print("✅ Design retrieved successfully")
            return response
        except Exception as e:
            print("🔥 Failed to retrieve design:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

    def perform_create(self, serializer):
        print("🛠 Creating Design for user:", self.request.user)
        try:
            serializer.save(designer=self.request.user)
            print("✅ Design created successfully")
        except Exception as e:
            print("🔥 Failed to create design:", str(e))

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print("✉️ Fetching messages for user:", user)
        qs = self.queryset.filter(Q(sender=user) | Q(receiver=user)).order_by('-timestamp')
        print("🔍 Retrieved message count:", qs.count())
        return qs

    def perform_create(self, serializer):
        print("✉️ Creating message from:", self.request.user)
        serializer.save(sender=self.request.user)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print("📋 Fetching bookings for user:", user)
        if hasattr(user, 'role') and user.role == User.DESIGNER:
            qs = self.queryset.filter(design__designer=user)
        else:
            qs = self.queryset.filter(client=user)
        print("🔍 Retrieved booking count:", qs.count())
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        print("📋 Creating booking for user:", user)
        if user.role != User.CLIENT:
            print("🔥 User is not a client, cannot create booking")
            return Response(
                {'error': 'Only clients can create bookings.'},
                status=status.HTTP_403_FORBIDDEN
            )
        design_id = self.request.data.get('design')
        try:
            design = Design.objects.get(id=design_id)
        except Design.DoesNotExist:
            print("🔥 Design not found:", design_id)
            return Response(
                {'error': 'Design does not exist.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            booking = serializer.save(client=user, design=design)
            print("✅ Booking created successfully:", booking)
            # Create notification for designer
            Notification.objects.create(
                user=design.designer,
                message=f"New booking for your design '{design.title}' by {user.username}"
            )
            print("🔔 Notification created for designer:", design.designer)
        except Exception as e:
            print("🔥 Failed to create booking:", str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print("💸 Fetching payments for user:", user)
        if hasattr(user, 'role') and user.role == User.DESIGNER:
            qs = self.queryset.filter(booking__design__designer=user)
        else:
            qs = self.queryset.filter(booking__client=user)
        print("🔍 Retrieved payment count:", qs.count())
        return qs

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print("🔔 Fetching notifications for user:", self.request.user)
        qs = self.queryset.filter(user=self.request.user).order_by('-created_at')
        print("🔍 Notification count:", qs.count())
        return qs