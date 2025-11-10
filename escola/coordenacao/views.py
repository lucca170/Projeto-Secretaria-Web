# Em: escola/coordenacao/views.py
from rest_framework import viewsets, permissions
from .models import MaterialDidatico, SalaLaboratorio, ReservaSala
from .serializers import MaterialDidaticoSerializer, SalaLaboratorioSerializer, ReservaSalaSerializer
from escola.base.permissions import IsCoordenacao # <-- IMPORTAÇÃO NECESSÁRIA

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

# Esta view customizada de login já existia e deve ser mantida
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

# --- VIEWSETS ATUALIZADAS COM PERMISSÕES CORRETAS ---

class MaterialDidaticoViewSet(viewsets.ModelViewSet):
    """
    API para gerenciar Materiais Didáticos.
    """
    queryset = MaterialDidatico.objects.all()
    serializer_class = MaterialDidaticoSerializer
    
    def get_permissions(self):
        # Apenas Coordenacao pode editar/criar/deletar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCoordenacao]
        # Todos logados podem ver
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class SalaLaboratorioViewSet(viewsets.ModelViewSet):
    """
    API para gerenciar Salas e Laboratórios.
    """
    queryset = SalaLaboratorio.objects.all()
    serializer_class = SalaLaboratorioSerializer

    def get_permissions(self):
        # Apenas Coordenacao pode editar/criar/deletar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCoordenacao]
        # Todos logados podem ver
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class ReservaSalaViewSet(viewsets.ModelViewSet):
    """
    API para gerenciar Reservas de Salas.
    """
    queryset = ReservaSala.objects.all()
    serializer_class = ReservaSalaSerializer
    
    def get_permissions(self):
        # Apenas Coordenacao pode deletar uma reserva
        if self.action in ['destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCoordenacao]
        # Todos logados (professores) podem criar/listar/ver
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
