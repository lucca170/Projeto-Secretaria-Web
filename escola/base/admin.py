# Em: escola/base/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
<<<<<<< HEAD
=======
# Importamos os DOIS formulários
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
from .forms import CustomUserCreationForm, CustomUserChangeForm 
from .models import Usuario

class UsuarioAdmin(UserAdmin):
<<<<<<< HEAD
    # Formulários que o admin deve usar
    add_form = CustomUserCreationForm 
    form = CustomUserChangeForm     
    model = Usuario
    
    # Colunas que aparecem na lista de usuários
    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff'] 
    
    # --- Layout para a PÁGINA DE EDIÇÃO ---
    # (Mantém os campos padrão do UserAdmin e adiciona o 'cargo')
=======
    add_form = CustomUserCreationForm # Formulário para "Adicionar"
    form = CustomUserChangeForm     # Formulário para "Editar"
    model = Usuario
    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff'] 
    
    # Layout para a PÁGINA DE EDIÇÃO (Adiciona 'cargo' ao layout padrão)
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    fieldsets = UserAdmin.fieldsets + (
        ('Informações Customizadas', {'fields': ('cargo',)}),
    )
            
<<<<<<< HEAD
    # --- Layout para a PÁGINA DE CRIAÇÃO ---
    # (Define os campos exatos para a tela "Add user")
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
=======
    # Layout para a PÁGINA DE CRIAÇÃO (Corrigido para incluir senhas)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # Inclui todos os campos do nosso formulário de criação
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
            'fields': ('username', 'email', 'first_name', 'last_name', 'cargo', 'password', 'password2'),
        }),
    )

<<<<<<< HEAD
    # --- A FUNÇÃO CRÍTICA QUE ESTÁ FALTANDO ---
    # Esta função diz ao admin para usar o 'add_fieldsets'
    # ao criar um usuário, e o 'fieldsets' ao editar um.
    def get_fieldsets(self, request, obj=None):
        if not obj:
            # Se 'obj' é None, estamos na página "Adicionar Usuário"
            # Então, usamos o layout 'add_fieldsets'
            return self.add_fieldsets
        
        # Caso contrário, estamos editando um usuário existente
        # Então, usamos o layout padrão 'fieldsets'
        return super().get_fieldsets(request, obj)

# Registra o seu modelo Usuario com esta classe customizada
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
admin.site.register(Usuario, UsuarioAdmin)