from rest_framework import serializers
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token

class CustomAuthTokenSerializer(AuthTokenSerializer):
    """
    Serializer customizado para o login, que retorna mais dados do usuário.
    """
    def validate(self, attrs):
        # Chama a validação padrão (usuário/senha)
        attrs = super().validate(attrs)
        
        # Pega o usuário validado
        user = attrs['user']
        
        # Adiciona os dados extras que queremos retornar
        attrs['user_data'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # CORREÇÃO: O campo no seu model é 'cargo'
            'role': user.cargo 
        }
        return attrs