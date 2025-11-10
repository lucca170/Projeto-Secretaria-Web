# Em: escola/base/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm 
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    # Formulários que o admin deve usar
    add_form = CustomUserCreationForm 
    form = CustomUserChangeForm     
    model = Usuario
    
    # Colunas que aparecem na lista de usuários
    list_display = ['username', 'email', 'first_name', 'last_name', 'cargo', 'is_staff'] 
    
    # --- Layout para a PÁGINA DE EDIÇÃO ---
    # (Mantém os campos padrão do UserAdmin e adiciona o 'cargo')
    fieldsets = UserAdmin.fieldsets + (
        ('Informações Customizadas', {'fields': ('cargo',)}),
    )
            
    # --- Layout para a PÁGINA DE CRIAÇÃO ---
    # (Define os campos exatos para a tela "Add user")
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'cargo', 'password', 'password2'),
        }),
    )

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
admin.site.register(Usuario, UsuarioAdmin)