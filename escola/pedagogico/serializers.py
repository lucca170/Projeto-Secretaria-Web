from rest_framework import serializers
from .models import Aluno, Nota, EventoAcademico, Turma, Materia, Disciplina, PlanoDeAula, Falta # <-- Adicionado 'Falta'
from escola.base.serializers import UserSerializer

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = '__all__'

class DisciplinaSerializer(serializers.ModelSerializer):
    # Serializadores aninhados para legibilidade
    materia = MateriaSerializer() 
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)
    materia_nome = serializers.CharField(source='materia.nome', read_only=True)

    class Meta:
        model = Disciplina
        fields = ['id', 'materia', 'turma', 'turma_nome', 'materia_nome', 'professores']

class AlunoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer() 
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)

    class Meta:
        model = Aluno
        fields = ['id', 'usuario', 'turma', 'turma_nome', 'status', 'matricula']

class AlunoCreateSerializer(serializers.ModelSerializer):
    # Serializer usado para CRIAR um aluno, associado a um novo usuário
    usuario = UserSerializer()

    class Meta:
        model = Aluno
        fields = ['usuario', 'turma', 'status', 'matricula']

    def create(self, validated_data):
        # (A lógica de criação de usuário foi movida para a view)
        ...

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turma
        fields = '__all__'

class NotaSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.usuario.username', read_only=True)
    disciplina_nome = serializers.CharField(source='disciplina.materia.nome', read_only=True)

    class Meta:
        model = Nota
        fields = ['id', 'aluno', 'aluno_nome', 'disciplina', 'disciplina_nome', 'bimestre', 'valor']

class NotaCreateUpdateSerializer(serializers.ModelSerializer):
    # Serializer simplificado para criar ou atualizar notas
    class Meta:
        model = Nota
        fields = ['id', 'aluno', 'disciplina', 'bimestre', 'valor']
        
class EventoAcademicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoAcademico
        fields = '__all__'

class PlanoDeAulaSerializer(serializers.ModelSerializer):
    disciplina = DisciplinaSerializer() # Aninhado para detalhes

    class Meta:
        model = PlanoDeAula
        fields = ['id', 'disciplina', 'data', 'conteudo_previsto', 'atividades']

# --- NOVO SERIALIZER ADICIONADO ---
class FaltaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Falta
        fields = '__all__'