from django.db import models
from django.contrib.auth.models import AbstractUser

from mdsetup.models import Employee

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    employee = models.OneToOneField(
        Employee,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="user"
    )
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )