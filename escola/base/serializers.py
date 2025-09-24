from rest_framework import serializers
from .models import Usuario

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('pk', 'email', 'first_name', 'last_name', 'cargo')
        read_only_fields = ('email', )