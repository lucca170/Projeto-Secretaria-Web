# Em: escola/coordenacao/serializers.py
from rest_framework import serializers
from .models import MaterialDidatico, SalaLaboratorio, ReservaSala

class MaterialDidaticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialDidatico
        fields = '__all__'

class SalaLaboratorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaLaboratorio
        fields = '__all__'

class ReservaSalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaSala
        fields = '__all__'