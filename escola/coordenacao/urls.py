# Em: escola/coordenacao/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomAuthToken, MaterialDidaticoViewSet, SalaLaboratorioViewSet, ReservaSalaViewSet

# Cria o roteador
router = DefaultRouter()
router.register(r'materiais', MaterialDidaticoViewSet, basename='material')
router.register(r'salas', SalaLaboratorioViewSet, basename='sala')
router.register(r'reservas', ReservaSalaViewSet, basename='reserva')

urlpatterns = [
    # Mantém a view de login antiga (se ainda for usada)
    path('api-token-auth/', CustomAuthToken.as_view(), name='api_token_auth'),
    
    # Adiciona as rotas da API
    path('api/', include(router.urls)),
]