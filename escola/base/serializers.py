from rest_framework import serializers
from django.contrib.auth import get_user_model # <-- MUDANÇA AQUI

User = get_user_model() # <-- MUDANÇA AQUI

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo de Usuário customizado.
    """
    
    # Adiciona o ID do aluno ao serializer do usuário, se existir
    aluno_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'cargo',
            'aluno_id', # <-- Campo customizado
            'password'  # Apenas para escrita (criação)
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_aluno_id(self, obj):
        # 'obj' é a instância de User
        # Tenta acessar o 'aluno_profile' relacionado
        if hasattr(obj, 'aluno_profile'):
            return obj.aluno_profile.id
        return None # Retorna None se não for aluno

    def create(self, validated_data):
        # Cria um novo usuário com senha hash
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            cargo=validated_data.get('cargo', None)
        )
        return user