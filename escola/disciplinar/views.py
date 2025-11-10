from rest_framework import viewsets, permissions
from .models import Advertencia, Suspensao
from .serializers import AdvertenciaSerializer, SuspensaoSerializer
from escola.base.permissions import IsCoordenacao, IsProfessor, IsAluno

class AdvertenciaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Advertências.
    Apenas Coordenação pode Criar, Editar ou Deletar.
    Alunos e Professores podem ver.
    """
    queryset = Advertencia.objects.all()
    serializer_class = AdvertenciaSerializer

    def get_permissions(self):
        """ Define permissões baseadas na ação. """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCoordenacao]
        else: # list, retrieve
            permission_classes = [permissions.IsAuthenticated, (IsCoordenacao | IsProfessor | IsAluno)]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """ Filtra o queryset com base no 'aluno_id' da URL. """
        queryset = super().get_queryset()
        aluno_id = self.request.query_params.get('aluno_id')
        if aluno_id:
            queryset = queryset.filter(aluno_id=aluno_id)
        
        # --- CORREÇÃO APLICADA AQUI ---
        # 1. Verifica se o usuário TEM o atributo 'cargo'
        # 2. Se tiver, verifica se é 'aluno'
        if hasattr(self.request.user, 'cargo') and self.request.user.cargo == 'aluno':
            if hasattr(self.request.user, 'aluno_profile'):
                queryset = queryset.filter(aluno=self.request.user.aluno_profile)
            else:
                # É um aluno sem perfil, não deve ver nada
                queryset = queryset.none() 
        
        # Se não tiver o atributo 'cargo' (ex: superadmin), o 'if' falha com segurança
        # e o filtro de aluno não é aplicado, permitindo que o admin veja tudo.
            
        return queryset

class SuspensaoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Suspensões.
    """
    queryset = Suspensao.objects.all()
    serializer_class = SuspensaoSerializer

    def get_permissions(self):
        """ Define permissões baseadas na ação. """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [permissions.IsAuthenticated, (IsCoordenacao | IsProfessor | IsAluno)]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """ Filtra o queryset com base no 'aluno_id' da URL. """
        queryset = super().get_queryset()
        aluno_id = self.request.query_params.get('aluno_id')
        if aluno_id:
            queryset = queryset.filter(aluno_id=aluno_id)

        # --- CORREÇÃO APLICADA AQUI ---
        # 1. Verifica se o usuário TEM o atributo 'cargo'
        # 2. Se tiver, verifica se é 'aluno'
        if hasattr(self.request.user, 'cargo') and self.request.user.cargo == 'aluno':
            if hasattr(self.request.user, 'aluno_profile'):
                queryset = queryset.filter(aluno=self.request.user.aluno_profile)
            else:
                 # É um aluno sem perfil, não deve ver nada
                queryset = queryset.none()
                
        return queryset