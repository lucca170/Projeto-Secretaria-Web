# DENTRO DO ARQUIVO: escola/pedagogico/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# 1. Defina o nome do seu app para criar o namespace
app_name = 'pedagogico'

# 2. Configure o router para as suas views da API
router = DefaultRouter()
router.register(r'alunos', views.AlunoViewSet, basename='aluno')
router.register(r'turmas', views.TurmaViewSet, basename='turma')

# 3. Mantenha APENAS as URLs da API (do router)
urlpatterns = [
    path('', include(router.urls)),
]