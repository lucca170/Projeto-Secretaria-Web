from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# CORREÇÃO: Importar o nome correto da classe do forms.py
from .forms import CustomUserCreationForm 
from .models import Usuario

# Esta classe personaliza como os usuários são exibidos na área de admin
class UsuarioAdmin(UserAdmin):
    # CORREÇÃO: Usar o nome correto da classe aqui também
    add_form = CustomUserCreationForm 
    model = Usuario
    # Garante que 'cargo' seja exibido na lista de usuários
    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff'] 
    
    # Adiciona o campo 'cargo' ao editar um usuário
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('cargo',)}),
    )
    # Adiciona o campo 'cargo' ao criar um usuário
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('cargo',)}),
    )

# Registra o seu modelo de usuário personalizado com a personalização acima
admin.site.register(Usuario, UsuarioAdmin)
