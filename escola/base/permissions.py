# Em: escola/base/permissions.py
from rest_framework import permissions

class IsProfessor(permissions.BasePermission):
    """
    Permissão customizada para permitir acesso apenas a Professores.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.cargo == 'professor'

class IsAluno(permissions.BasePermission):
    """
    Permissão customizada para permitir acesso apenas a Alunos.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.cargo == 'aluno'

class IsCoordenacao(permissions.BasePermission): 
    """
    Permissão customizada para permitir acesso à equipe administrativa.
    (Modificado para incluir Administrador, Coordenador, Diretor e TI)
    """
    def has_permission(self, request, view):
        # Verifica se o usuário está logado
        if not (request.user and request.user.is_authenticated):
            return False
        
        # Lista de cargos permitidos
        allowed_roles = ['administrador', 'coordenador', 'diretor', 'ti']
        
        # Retorna True se o cargo do usuário estiver na lista
        return request.user.cargo in allowed_roles