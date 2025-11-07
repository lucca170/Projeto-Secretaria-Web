# Em: escola/base/forms.py
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm
from .models import Usuario

class CustomUserCreationForm(UserCreationForm):
    """
    Formulário para a página "Add user"
    """
    class Meta(UserCreationForm.Meta):
        model = Usuario
        # Adiciona nossos campos customizados aos campos padrão (username, password, password2)
        fields = UserCreationForm.Meta.fields + ('email', 'first_name', 'last_name', 'cargo')

class CustomUserChangeForm(UserChangeForm):
    """
    Formulário para a página "Edit user"
    """
    class Meta:
        model = Usuario
        # Define quais campos aparecem na página de edição
        fields = ('username', 'email', 'first_name', 'last_name', 'cargo', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')

class CustomAuthenticationForm(AuthenticationForm):
    pass