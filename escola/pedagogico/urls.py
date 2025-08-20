from django.urls import path
from .views import (
    adicionar_turma, lista_turmas,
    lista_alunos, lista_disciplinas, lista_notas, lista_emprestimos,
    boletim_aluno, lista_alunos_para_boletim
)

urlpatterns = [
    path('turmas/', lista_turmas, name='lista_turmas'),
    path('turmas/adicionar/', adicionar_turma, name='adicionar_turma'),
    path('alunos/', lista_alunos, name='lista_alunos'),
    path('disciplinas/', lista_disciplinas, name='lista_disciplinas'),
    path('notas/', lista_notas, name='lista_notas'),
    path('emprestimos/', lista_emprestimos, name='lista_emprestimos'),
    path('boletim/', lista_alunos_para_boletim, name='lista_alunos_para_boletim'),
    path('boletim/<int:aluno_id>/', boletim_aluno, name='boletim_aluno'),
]