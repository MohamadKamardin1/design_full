from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    DesignerProfileViewSet,
    DesignViewSet,
    MessageViewSet,
    PaymentViewSet,
    NotificationViewSet,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'designer-profiles', DesignerProfileViewSet)
router.register(r'designs', DesignViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
