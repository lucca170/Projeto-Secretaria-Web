# Em: escola/pedagogico/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction

# --- ALTERADO ---
# Adicionado Disciplina, PlanoDeAula, e EventoExtracurricular
from .models import (
    Nota, 
    EventoAcademico, 
    Aluno, 
    Turma, 
    Disciplina, 
    PlanoDeAula,
)

Usuario = get_user_model()

# ===================================================================
# SERIALIZERS QUE VOCÊ JÁ TINHA
# ===================================================================

class NotaSerializer(serializers.ModelSerializer):
    """
    Serializa o model Nota, incluindo nomes de aluno e disciplina
    para facilitar o frontend.
    """
    
    # Pega o nome completo do aluno (ex: "Gabriel Vinhal")
    aluno_nome = serializers.CharField(source='aluno.usuario.get_full_name', read_only=True)
    
    # Pega o nome da disciplina (ex: "Matemática")
    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)

    class Meta:
        model = Nota
        
        # Campos que a API vai mostrar/receber
        fields = [
            'id', 
            'aluno', # ID do aluno
            'aluno_nome', # Nome (só leitura)
            'disciplina', # ID da disciplina
            'disciplina_nome', # Nome (só leitura)
            'valor' # A nota
        ]
        
        read_only_fields = ['aluno_nome', 'disciplina_nome']

class EventoAcademicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAcademico
        fields = '__all__' # Serializa todos os campos do modelo      

class AlunoCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para criar um novo Aluno E seu Usuário correspondente.
    Recebe dados do usuário (nome, email, cpf) e dados do aluno (turma).
    """
    # Campos do Usuário que vamos receber
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=False)
    cpf = serializers.CharField(write_only=True, required=True, max_length=14)
    
    class Meta:
        model = Aluno
        # 'usuario' será criado automaticamente, 'turma' e 'status' vêm do payload
        fields = ['first_name', 'last_name', 'email', 'cpf', 'turma', 'status']

    def validate_cpf(self, value):
        """ Valida se o CPF (username) já existe. """
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Já existe um usuário com este CPF.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        # 1. Separar os dados
        user_data = {
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'email': validated_data.pop('email', ''),
            'username': validated_data.pop('cpf'), # CPF é o Username
        }
        
        # 2. Criar o Usuário
        try:
            user = Usuario.objects.create_user(
                username=user_data['username'],
                password='12345678', # Senha padrão
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                email=user_data['email'],
                cargo='aluno' # Define o cargo
            )
        except Exception as e:
            raise serializers.ValidationError(f"Erro ao criar usuário: {e}")

        # 3. Criar o Aluno (com os dados restantes em validated_data)
        # validated_data agora só contém 'turma' e 'status'
        aluno = Aluno.objects.create(usuario=user, **validated_data)
        return aluno

class AlunoSerializer(serializers.ModelSerializer):
    """ Serializa o Aluno, puxando o nome do Usuario. """
    nome = serializers.CharField(source='usuario.get_full_name', read_only=True)
    # --- CORREÇÃO: Adicionado 'allow_null=True' para turmas não definidas ---
    turma_nome = serializers.CharField(source='turma.nome', read_only=True, allow_null=True)
    cpf = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Aluno
        fields = ['id', 'usuario', 'nome', 'cpf', 'status', 'turma', 'turma_nome']
        read_only_fields = ['nome', 'turma_nome', 'cpf']

class TurmaSerializer(serializers.ModelSerializer):
    """ Serializa a Turma. """
    turno_display = serializers.CharField(source='get_turno_display', read_only=True)
    
    class Meta:
        model = Turma
        fields = ['id', 'nome', 'turno', 'turno_display']
        read_only_fields = ['turno_display']


# ===================================================================
# --- NOVOS SERIALIZERS (ADICIONADOS AGORA) ---
# ===================================================================

class DisciplinaSerializer(serializers.ModelSerializer):
    """
    Serializa a Disciplina, incluindo o nome do professor.
    """
    # Opcional: Mostrar o nome do professor
    professor_nome = serializers.CharField(source='professor.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Disciplina
        # Ajuste os campos conforme o seu models.py
        fields = ['id', 'nome', 'carga_horaria', 'professor', 'professor_nome']
        read_only_fields = ['professor_nome']


class PlanoDeAulaSerializer(serializers.ModelSerializer):
    """
    Serializa o Plano de Aula.
    """
    # Aninhar a disciplina para mostrar detalhes (opcional)
    disciplina = DisciplinaSerializer(read_only=True)
    
    # Campo para receber o ID da disciplina ao criar/atualizar
    disciplina_id = serializers.PrimaryKeyRelatedField(
        queryset=Disciplina.objects.all(), source='disciplina', write_only=True
    )

    class Meta:
        model = PlanoDeAula
        # Ajuste os campos conforme o seu models.py
        fields = [
            'id', 
            'disciplina', # (read_only, aninhado)
            'disciplina_id', # (write_only)
            'data', 
            'conteudo_previsto', 
            'atividades'
        ]
        read_only_fields = ['disciplina']
