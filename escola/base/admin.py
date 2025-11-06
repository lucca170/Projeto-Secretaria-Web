from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm 
from .models import Usuario

# Esta classe personaliza como os usuários são exibidos na área de admin
class UsuarioAdmin(UserAdmin):
    add_form = CustomUserCreationForm 
    model = Usuario
    # Garante que 'cargo' seja exibido na lista de usuários
    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff'] 
    
    # --- INÍCIO DA CORREÇÃO ---
    # Substitua as linhas 'fieldsets' e 'add_fieldsets' por estas:

    # Estes são os campos para a PÁGINA DE EDIÇÃO de um usuário
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
        # Adiciona seu campo 'cargo' em uma nova seção
        ('Informações Customizadas', {'fields': ('cargo',)}),
    )

    # Estes são os campos para a PÁGINA DE CRIAÇÃO de um novo usuário
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # Garanta que todos os campos do seu 'CustomUserCreationForm' estão aqui
            'fields': ('username', 'first_name', 'last_name', 'email', 'cargo', 'password', 'password2'),
        }),
    )
    # --- FIM DA CORREÇÃO ---

# Registra o seu modelo de usuário personalizado com a personalização acima
admin.site.register(Usuario, UsuarioAdmin)