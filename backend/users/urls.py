from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import UserLoginView

urlpatterns = [
    path('signin/', UserLoginView.as_view(), name='user-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]