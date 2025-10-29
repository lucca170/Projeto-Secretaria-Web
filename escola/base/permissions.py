from rest_framework import permissions

class IsProfessor(permissions.BasePermission):
    """
    Permissão customizada para permitir acesso apenas a Professores.
    """
    def has_permission(self, request, view):
        # CORREÇÃO: O campo no seu model é 'cargo'
        return request.user and request.user.is_authenticated and request.user.cargo == 'professor'

class IsAluno(permissions.BasePermission):
    """
    Permissão customizada para permitir acesso apenas a Alunos.
    """
    def has_permission(self, request, view):
        # CORREÇÃO: O campo no seu model é 'cargo'
        return request.user and request.user.is_authenticated and request.user.cargo == 'aluno'

class IsCoordenacao(permissions.BasePermission): # O nome da classe pode ficar
    """
    Permissão customizada para permitir acesso apenas ao Administrador.
    """
    def has_permission(self, request, view):
        # CORREÇÃO: O campo no seu model é 'cargo' e o valor é 'administrador'
        return request.user and request.user.is_authenticated and request.user.cargo == 'administrador'
