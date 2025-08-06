from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    DESIGNER = 'designer'
    CLIENT = 'client'
    ROLE_CHOICES = [
        (DESIGNER, 'Designer'),
        (CLIENT, 'Client'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return f'{self.username} ({self.role})'

class DesignerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='designer_profile')
    bio = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    company_name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f'Designer Profile: {self.user.username}'

class Design(models.Model):
    designer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='designs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    features = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='design_images/')

    def __str__(self):
        return self.title

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Message from {self.sender} to {self.receiver} on {self.design.title}'

class Booking(models.Model):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (CONFIRMED, 'Confirmed'),
        (CANCELLED, 'Cancelled'),
    ]

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='bookings')
    negotiated_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    booking_date = models.DateField(null=True, blank=True)  # Added for user-specified date

    def __str__(self):
        return f'Booking {self.id} by {self.client.username} for {self.design.title}'

class Payment(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=255, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    successful = models.BooleanField(default=False)

    def __str__(self):
        return f'Payment for booking {self.booking.id} - {"Success" if self.successful else "Pending"}'

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification for {self.user.username}: {self.message}'