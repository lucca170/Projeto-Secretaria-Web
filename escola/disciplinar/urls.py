# Em: escola/disciplinar/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Cria o roteador
router = DefaultRouter()
router.register(r'advertencias', views.AdvertenciaViewSet, basename='advertencia')
router.register(r'suspensoes', views.SuspensaoViewSet, basename='suspensao')

urlpatterns = [
    # Adiciona as rotas da API
    path('api/', include(router.urls)),
    
    # Suas views de template (se houver) podem vir aqui
]