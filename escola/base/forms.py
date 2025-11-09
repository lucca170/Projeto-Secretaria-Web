# Em: escola/base/forms.py
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm
from .models import Usuario

class CustomUserCreationForm(UserCreationForm):
    """
<<<<<<< HEAD
    Formulário para a página "Add user" (Criar usuário)
    """
    class Meta(UserCreationForm.Meta):
        model = Usuario
        # Informa ao form para processar estes campos ADICIONAIS
=======
    Formulário para a página "Add user"
    """
    class Meta(UserCreationForm.Meta):
        model = Usuario
        # Adiciona nossos campos customizados aos campos padrão (username, password, password2)
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
        fields = UserCreationForm.Meta.fields + ('email', 'first_name', 'last_name', 'cargo')

class CustomUserChangeForm(UserChangeForm):
    """
<<<<<<< HEAD
    Formulário para a página "Edit user" (Editar usuário)
=======
    Formulário para a página "Edit user"
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    """
    class Meta:
        model = Usuario
        # Define quais campos aparecem na página de edição
        fields = ('username', 'email', 'first_name', 'last_name', 'cargo', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')

class CustomAuthenticationForm(AuthenticationForm):
    pass