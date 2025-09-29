from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'alunos', views.AlunoViewSet, basename='aluno')
router.register(r'turmas', views.TurmaViewSet, basename='turma')

urlpatterns = [
    path('adicionar_aluno/', views.adicionar_aluno, name='adicionar_aluno'),
    path('adicionar_turma/', views.adicionar_turma, name='adicionar_turma'),
    path('turmas/', views.lista_turmas, name='lista_turmas'),
    
   path('', include(router.urls)),
]