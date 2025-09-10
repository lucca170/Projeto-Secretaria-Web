from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import UsuarioCreationForm
from .models import Usuario

# Esta classe personaliza como os usuários são exibidos na área de admin
class UsuarioAdmin(UserAdmin):
    add_form = UsuarioCreationForm
    model = Usuario
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
