# Em: escola/base/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# Importamos os DOIS formulários
from .forms import CustomUserCreationForm, CustomUserChangeForm 
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    add_form = CustomUserCreationForm # Formulário para "Adicionar"
    form = CustomUserChangeForm     # Formulário para "Editar"
    model = Usuario
    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff'] 
    
    # Layout para a PÁGINA DE EDIÇÃO (Adiciona 'cargo' ao layout padrão)
    fieldsets = UserAdmin.fieldsets + (
        ('Informações Customizadas', {'fields': ('cargo',)}),
    )
            
    # Layout para a PÁGINA DE CRIAÇÃO (Corrigido para incluir senhas)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # Inclui todos os campos do nosso formulário de criação
            'fields': ('username', 'email', 'first_name', 'last_name', 'cargo', 'password', 'password2'),
        }),
    )

admin.site.register(Usuario, UsuarioAdmin)