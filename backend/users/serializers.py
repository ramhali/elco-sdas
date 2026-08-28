from rest_framework import serializers

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from django.core.exceptions import ValidationError as DjangoValidationError

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)