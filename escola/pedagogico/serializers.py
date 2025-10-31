# Em: escola/pedagogico/serializers.py
from .models import Nota, EventoAcademico
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