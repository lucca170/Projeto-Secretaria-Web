<<<<<<< HEAD
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.crypto import get_random_string 
=======
# Em: escola/pedagogico/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

from .models import (
    Nota, 
    EventoAcademico, 
    Aluno, 
    Turma, 
    Disciplina, 
    PlanoDeAula,
<<<<<<< HEAD
    Materia,
    Falta # <-- 1. IMPORTE O MODELO 'Falta'
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
)

Usuario = get_user_model()

<<<<<<< HEAD

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ['id', 'nome']

class NotaCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = ['id', 'aluno', 'disciplina', 'bimestre', 'valor']
    def validate(self, data):
        if not self.instance: 
=======
# ===================================================================
# NOVO SERIALIZER PARA NOTAS (Criação/Edição)
# ===================================================================
class NotaCreateUpdateSerializer(serializers.ModelSerializer):
    """ Serializer otimizado para criar ou atualizar notas. """
    class Meta:
        model = Nota
        fields = ['id', 'aluno', 'disciplina', 'bimestre', 'valor']

    def validate(self, data):
        # Garante que a nota só pode ser lançada uma vez
        if not self.instance: # Apenas na criação (POST)
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
            if Nota.objects.filter(
                aluno=data['aluno'], 
                disciplina=data['disciplina'], 
                bimestre=data['bimestre']
            ).exists():
                raise serializers.ValidationError("Esta nota já foi lançada para este bimestre.")
        return data

<<<<<<< HEAD
class NotaSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.usuario.get_full_name', read_only=True)
    disciplina_nome = serializers.CharField(source='disciplina.materia.nome', read_only=True)
=======
# ===================================================================
# SERIALIZERS QUE VOCÊ JÁ TINHA (com leves modificações)
# ===================================================================

class NotaSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.usuario.get_full_name', read_only=True)
    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

    class Meta:
        model = Nota
        fields = [
            'id', 
            'aluno', 
            'aluno_nome', 
            'disciplina', 
            'disciplina_nome', 
<<<<<<< HEAD
            'bimestre', 
=======
            'bimestre', # Adicionado
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
            'valor'
        ]
        read_only_fields = ['aluno_nome', 'disciplina_nome']

class EventoAcademicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAcademico
        fields = '__all__' 

class AlunoCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=False)
    cpf = serializers.CharField(write_only=True, required=True, max_length=14)
<<<<<<< HEAD
    temp_password = serializers.CharField(read_only=True) 

    class Meta:
        model = Aluno
        fields = ['first_name', 'last_name', 'email', 'cpf', 'turma', 'status', 'temp_password']
    
=======
    
    class Meta:
        model = Aluno
        fields = ['first_name', 'last_name', 'email', 'cpf', 'turma', 'status']

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    def validate_cpf(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Já existe um usuário com este CPF.")
        return value
<<<<<<< HEAD
    
=======

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    @transaction.atomic
    def create(self, validated_data):
        user_data = {
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'email': validated_data.pop('email', ''),
            'username': validated_data.pop('cpf'), 
        }
        
<<<<<<< HEAD
        password = get_random_string(length=10)
        
        try:
            user = Usuario.objects.create_user(
                username=user_data['username'],
                password=password, 
=======
        try:
            user = Usuario.objects.create_user(
                username=user_data['username'],
                password='12345678', 
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                email=user_data['email'],
                cargo='aluno'
            )
        except Exception as e:
            raise serializers.ValidationError(f"Erro ao criar usuário: {e}")
<<<<<<< HEAD
            
        aluno = Aluno.objects.create(usuario=user, **validated_data)
        
        aluno.temp_password = password
        
=======

        aluno = Aluno.objects.create(usuario=user, **validated_data)
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
        return aluno

class AlunoSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='usuario.get_full_name', read_only=True)
    turma_nome = serializers.CharField(source='turma.nome', read_only=True, allow_null=True)
    cpf = serializers.CharField(source='usuario.username', read_only=True)
<<<<<<< HEAD
=======

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    class Meta:
        model = Aluno
        fields = ['id', 'usuario', 'nome', 'cpf', 'status', 'turma', 'turma_nome']
        read_only_fields = ['nome', 'turma_nome', 'cpf']

<<<<<<< HEAD

class TurmaSerializer(serializers.ModelSerializer):
    turno_display = serializers.CharField(source='get_turno_display', read_only=True)
=======
class TurmaSerializer(serializers.ModelSerializer):
    turno_display = serializers.CharField(source='get_turno_display', read_only=True)
    
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    class Meta:
        model = Turma
        fields = ['id', 'nome', 'turno', 'turno_display']
        read_only_fields = ['turno_display']


<<<<<<< HEAD
class DisciplinaSerializer(serializers.ModelSerializer):
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)
    materia_nome = serializers.CharField(source='materia.nome', read_only=True)
    professores_nomes = serializers.StringRelatedField(many=True, read_only=True, source='professores')
    
    class Meta:
        model = Disciplina
        fields = [
            'id', 
            'materia', 
            'materia_nome',
            'carga_horaria', 
            'professores', 
            'professores_nomes', 
            'turma', 
            'turma_nome'
        ]
        read_only_fields = ['materia_nome', 'professores_nomes', 'turma_nome']
=======
# ===================================================================
# --- NOVOS SERIALIZERS (ADICIONADOS AGORA) ---
# ===================================================================

class DisciplinaSerializer(serializers.ModelSerializer):
    """
    Serializa a Disciplina, incluindo o nome da turma.
    """
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)
    professor_nome = serializers.CharField(source='professor.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Disciplina
        fields = [
            'id', 'nome', 'carga_horaria', 'professor', 'professor_nome', 
            'turma', 'turma_nome'
        ]
        read_only_fields = ['professor_nome', 'turma_nome']
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c


class PlanoDeAulaSerializer(serializers.ModelSerializer):
    disciplina = DisciplinaSerializer(read_only=True)
    disciplina_id = serializers.PrimaryKeyRelatedField(
        queryset=Disciplina.objects.all(), source='disciplina', write_only=True
    )
<<<<<<< HEAD
=======

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    class Meta:
        model = PlanoDeAula
        fields = [
            'id', 
            'disciplina', 
            'disciplina_id', 
            'data', 
            'conteudo_previsto', 
            'atividades'
        ]
<<<<<<< HEAD
        read_only_fields = ['disciplina']

# --- 2. ADICIONE ESTE NOVO SERIALIZER NO FINAL ---
class FaltaSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.usuario.get_full_name', read_only=True)
    disciplina_nome = serializers.CharField(source='disciplina.materia.nome', read_only=True)
    
    class Meta:
        model = Falta
        # 'justificada' é false por padrão
        fields = ['id', 'aluno', 'aluno_nome', 'disciplina', 'disciplina_nome', 'data', 'justificada']
        read_only_fields = ['aluno_nome', 'disciplina_nome']
=======
        read_only_fields = ['disciplina']
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
