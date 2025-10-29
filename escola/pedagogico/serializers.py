from rest_framework import serializers
from escola.base.models import Nota, Aluno, Disciplina

class NotaSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.CharField(source='aluno.nome', read_only=True)
    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)

    class Meta:
        model = Nota
        fields = ['id', 'aluno', 'aluno_nome', 'disciplina', 'disciplina_nome', 'valor', 'data']
        read_only_fields = ['id', 'aluno_nome', 'disciplina_nome']
