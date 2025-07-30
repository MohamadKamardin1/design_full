from rest_framework import generics, permissions
from .models import User, Design, Booking, Invoice, Location
from .serializers import SignupSerializer, DesignSerializer, BookingSerializer, InvoiceSerializer, LocationSerializer

# Signup
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer

# Designs CRUD
class DesignListCreate(generics.ListCreateAPIView):
    queryset = Design.objects.all()
    serializer_class = DesignSerializer

# Bookings
class BookingListCreate(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

# Location
class LocationCreate(generics.CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
