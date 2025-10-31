# Em: escola/pedagogico/serializers.py
from .models import Nota, EventoAcademico, Aluno, Turma 
from rest_framework import serializers
from .models import Nota

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


class AlunoSerializer(serializers.ModelSerializer):
    """ Serializa o Aluno, puxando o nome do Usuario. """
    nome = serializers.CharField(source='usuario.get_full_name', read_only=True)
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)

    class Meta:
        model = Aluno
        # --- ALTERADO AQUI ---
        # Adicionamos 'usuario' à lista para que possa ser enviado no POST
        fields = ['id', 'usuario', 'nome', 'status', 'turma', 'turma_nome']
        # 'nome' e 'turma_nome' continuam read_only
        read_only_fields = ['nome', 'turma_nome']
        # ---------------------

class TurmaSerializer(serializers.ModelSerializer):
    """ Serializa a Turma. """
    turno_display = serializers.CharField(source='get_turno_display', read_only=True)
    
    class Meta:
        model = Turma
        # Este serializer já funciona para escrita (POST)
        fields = ['id', 'nome', 'turno', 'turno_display']
        read_only_fields = ['turno_display']