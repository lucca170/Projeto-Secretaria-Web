
from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from . import views
from .views import (
    adicionar_turma, lista_turmas,
    lista_alunos, lista_disciplinas, lista_notas, lista_emprestimos,
    boletim_aluno, lista_alunos_para_boletim,
    adicionar_aluno
)

app_name = 'pedagogico'

urlpatterns = [
    path('turmas/adicionar/', adicionar_turma, name='adicionar_turma'),
    path('turmas/', lista_turmas, name='lista_turmas'),
    path('alunos/', lista_alunos, name='lista_alunos'),
    path('alunos/adicionar/', adicionar_aluno, name='adicionar_aluno'),
    path('disciplinas/', lista_disciplinas, name='lista_disciplinas'),
    path('notas/', lista_notas, name='lista_notas'),
    path('emprestimos/', lista_emprestimos, name='lista_emprestimos'),
    path('boletim/', lista_alunos_para_boletim, name='lista_alunos_para_boletim'),
    path('boletim/<int:aluno_id>/', boletim_aluno, name='boletim_aluno'),
]

router = DefaultRouter()

router.register(r'api/alunos', views.AlunoViewSet, basename='aluno') 

template_urlpatterns = [
    # Exemplo de URL antiga:
    # path('adicionar_aluno/', views.adicionar_aluno_view, name='adicionar_aluno'),
]

# urlpatterns para a API (registradas pelo router)
api_urlpatterns = router.urls

# Combina as duas listas (se houver URLs de template)
urlpatterns = template_urlpatterns + api_urlpatterns

