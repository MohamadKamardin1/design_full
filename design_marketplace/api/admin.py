from django.contrib import admin
from .models import User, DesignerProfile, Design, Message, Booking,Payment, Notification
# Register your models here.
admin.site.register(User)
admin.site.register(DesignerProfile)
admin.site.register(Design)
admin.site.register(Message)
admin.site.register(Booking)
admin.site.register(Payment)
admin.site.register(Notification)