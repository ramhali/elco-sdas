from django.db import models

# Create your models here.
class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    dept_code = models.CharField(max_length=10, unique=True)
    dept_name = models.CharField(max_length=255)

    class Meta:
        ordering = ["dept_name"]

    def __str__(self):
        return self.dept_name
    
class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    designation = models.CharField(max_length=255)
    title = models.CharField(max_length=255, null=True)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255)
    extension = models.CharField(max_length=10, null=True)

    dept = models.ForeignKey(Department,
                                   on_delete=models.SET_NULL,
                                   related_name="employees",
                                   null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["last_name"]

    def __str__(self):
        parts = [self.title, self.first_name, self.last_name]
        name = " ".join(filter(None, parts))

        if self.extension:
            return f"{name}, {self.extension}"
        
        return name