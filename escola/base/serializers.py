from rest_framework import serializers
from .models import Usuario
# IMPORTAÇÃO ADICIONAL ABAIXO
from rest_framework.authtoken.models import Token 

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('pk', 'email', 'first_name', 'last_name', 'cargo')
        read_only_fields = ('email', )

# ADICIONE ESTE NOVO SERIALIZER ABAIXO
class CustomTokenSerializer(serializers.ModelSerializer):
    # Aninhando o UserDetailsSerializer para incluir os dados do usuário
    user = UserDetailsSerializer(read_only=True)

    class Meta:
        model = Token
        fields = ('key', 'user') # Definimos que a resposta terá a chave e o usuário