from rest_framework import serializers
from escola.base.models import Aluno 

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'data_nascimento', 'cpf', 'rg', 'endereco'] 
 