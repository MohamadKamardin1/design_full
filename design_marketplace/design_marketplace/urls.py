from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.authtoken import views as drf_views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from api.views import RegisterAPIView, LogoutAPIView
from api.views import CsrfExemptAuthToken
from api.views import BookingViewSet
from django.conf import settings
from django.conf.urls.static import static


schema_view = get_schema_view(
   openapi.Info(
      title="Design Marketplace API",
      default_version='v1',
      description="API documentation for Design Marketplace",
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    # Session login/logout for browsable API
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # Token auth login
    path('api-token-auth/', CsrfExemptAuthToken.as_view(), name='api-token-auth'),

    # Custom Registration & Logout
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/logout/', LogoutAPIView.as_view(), name='logout'),
   path('api/bookings/', BookingViewSet.as_view({'get': 'list', 'post': 'create'}), name='booking-create'),
    # API docs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)