# escola/base/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Campos que aparecem na lista de usuários
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'cargo')
    list_filter = ('cargo', 'is_staff', 'is_superuser', 'groups')

    # A mágica está aqui. Nós pegamos os 'fieldsets' originais do UserAdmin
    # e adicionamos uma nova seção para os nossos campos customizados.
    
    # Campos para a tela de EDIÇÃO de um usuário
    fieldsets = UserAdmin.fieldsets + (
        ('Campos Personalizados', {'fields': ('cargo', 'cpf')}),
    )
    
    # Campos para a tela de CRIAÇÃO de um usuário
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Campos Personalizados', {'fields': ('cargo', 'cpf', 'first_name', 'last_name', 'email')}),
    )