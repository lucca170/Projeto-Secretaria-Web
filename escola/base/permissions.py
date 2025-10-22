from rest_framework import permissions

class IsProfessor(permissions.BasePermission):
    """
    Permissão customizada para permitir acesso apenas a Professores.
    """
    def has_permission(self, request, view):
        # Usando 'cargo' como definido no seu models.py
        return request.user and request.user.is_authenticated and request.user.cargo == 'professor'

class IsAluno(permissions.BasePermission):
    """
    Permissão customizada para permitir acesso apenas a Alunos.
    """
    def has_permission(self, request, view):
        # Usando 'cargo'
        return request.user and request.user.is_authenticated and request.user.cargo == 'aluno'

class IsCoordenacao(permissions.BasePermission): # O nome da classe pode ficar
    """
    Permissão customizada para permitir acesso apenas ao Administrador.
    """
    def has_permission(self, request, view):
        # Usando 'cargo' e o valor 'administrador' do seu models.py
        return request.user and request.user.is_authenticated and request.user.cargo == 'administrador'

# Você pode adicionar outras permissões aqui se precisar (ex: IsFinanceiro)