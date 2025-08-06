from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import DesignerProfile, Design, Message, Booking, Payment, Notification
from .models import Booking

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'profile_image',
                  'first_name', 'last_name', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        print(f"Creating user with data: {validated_data}")
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        print(f"User created successfully: {user}")
        return user

class DesignerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DesignerProfile
        fields = ['id', 'user', 'bio', 'phone_number', 'company_name']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(f"Serialized DesignerProfile: {data}")
        return data

class DesignSerializer(serializers.ModelSerializer):
    designer = UserSerializer(read_only=True)
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Design
        fields = [
            'id', 'designer', 'title', 'description', 'features',
            'price', 'created_at', 'updated_at', 'image'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(f"Serialized Design: {data}")
        return data

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    design = DesignSerializer(read_only=True)

    sender_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='sender', write_only=True)
    receiver_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='receiver', write_only=True)
    design_id = serializers.PrimaryKeyRelatedField(queryset=Design.objects.all(), source='design', write_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'design', 'content', 'timestamp', 'is_read',
                  'sender_id', 'receiver_id', 'design_id']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(f"Serialized Message: {data}")
        return data
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'client', 'design', 'negotiated_price', 'status', 'notes', 'created_at', 'booking_date']
        read_only_fields = ['id', 'client', 'created_at', 'status']

    def validate_booking_date(self, value):
        from datetime import date
        if value and value < date.today():
            raise serializers.ValidationError("Booking date cannot be in the past.")
        return value

    def validate_design(self, value):
        if not value:
            raise serializers.ValidationError("Design is required.")
        return value
class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    booking_id = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all(), source='booking', write_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'booking', 'booking_id', 'amount', 'payment_method', 'transaction_id', 'paid_at', 'successful']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(f"Serialized Payment: {data}")
        return data

class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'user_id', 'message', 'is_read', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(f"Serialized Notification: {data}")
        return data




class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'user', 'design', 'booking_date', 'notes', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'status']

    def validate_booking_date(self, value):
        from datetime import date
        if value < date.today():
            raise serializers.ValidationError("Booking date cannot be in the past.")
        return value