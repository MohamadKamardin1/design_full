from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
    ('designer', 'Designer'),
    ('client', 'Client'),
    ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    groups = models.ManyToManyField(
        Group,
        related_name='core_user_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='core_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

class Design(models.Model):
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='designs/')
    designer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="designs")

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
    )
    PAYMENT_STATUS = (
        ('HALF', 'Half Paid'),
        ('FULL', 'Fully Paid'),
        ('NONE', 'Not Paid'),
    )
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    designer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_bookings")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='NONE')

class Invoice(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class Location(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    shared_at = models.DateTimeField(auto_now_add=True)
