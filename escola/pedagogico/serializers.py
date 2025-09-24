# escola/pedagogico/serializers.py

from rest_framework import serializers
from .models import Aluno, Turma
from escola.disciplinar.models import Advertencia, Suspensao

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turma
        fields = ['id', 'nome', 'turno']

class AdvertenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertencia
        fields = ['data', 'motivo']

class SuspensaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suspensao
        fields = ['data_inicio', 'data_fim', 'motivo']

class AlunoSerializer(serializers.ModelSerializer):
    # Relacionamentos aninhados para mostrar dados completos
    turma = TurmaSerializer(read_only=True)
    advertencias = AdvertenciaSerializer(many=True, read_only=True, source='advertencias_aluno')
    suspensoes = SuspensaoSerializer(many=True, read_only=True, source='suspensoes_aluno')
    
    # Campos derivados do modelo de usuário relacionado
    nome = serializers.CharField(source='usuario.get_full_name', read_only=True)
    matricula = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Aluno
        # Lista de campos que a API irá retornar
        fields = ['id', 'nome', 'matricula', 'turma', 'advertencias', 'suspensoes']