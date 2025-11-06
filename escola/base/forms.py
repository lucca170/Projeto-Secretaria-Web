from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Usuario

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Usuario
        # CORREÇÃO: 
        # 1. O campo de cargo é 'cargo', não 'tipo_usuario'
        # 2. O modelo usa 'first_name' e 'last_name', não 'nome_completo'
        fields = UserCreationForm.Meta.fields + ('cargo', 'email', 'first_name', 'last_name',) 

class CustomAuthenticationForm(AuthenticationForm):
    # Não precisa de Meta aqui para o login padrão
    pass # Usa a implementação padrão do AuthenticationForm