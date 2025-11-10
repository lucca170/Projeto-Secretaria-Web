from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.serializers import AuthTokenSerializer # <-- Importação necessária

User = get_user_model()

# --- CLASSE QUE FALTAVA ---
class CustomAuthTokenSerializer(AuthTokenSerializer):
    """
    Serializer customizado para o login. 
    O AuthTokenSerializer padrão já usa 'username' e 'password',
    que é o que precisamos (o 'username' é o CPF).
    """
    # Não precisamos de código extra aqui, só da definição da classe.
    pass
# --- FIM DA CLASSE QUE FALTAVA ---


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo de Usuário customizado.
    """
    
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
            'aluno_id',
            'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_aluno_id(self, obj):
        if hasattr(obj, 'aluno_profile'):
            return obj.aluno_profile.id
        return None

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            cargo=validated_data.get('cargo', None)
        )
        return user