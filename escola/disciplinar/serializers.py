# Em: escola/disciplinar/serializers.py
from rest_framework import serializers
from .models import Advertencia, Suspensao
from escola.pedagogico.models import Aluno # Para buscar o Aluno

class AdvertenciaSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.usuario.get_full_name', read_only=True)

    class Meta:
        model = Advertencia
        # Inclui 'aluno' para que possamos passá-lo ao criar
        fields = ['id', 'aluno', 'aluno_nome', 'data', 'motivo']
        read_only_fields = ['aluno_nome']

class SuspensaoSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.usuario.get_full_name', read_only=True)

    class Meta:
        model = Suspensao
        fields = ['id', 'aluno', 'aluno_nome', 'data_inicio', 'data_fim', 'motivo']
        read_only_fields = ['aluno_nome']