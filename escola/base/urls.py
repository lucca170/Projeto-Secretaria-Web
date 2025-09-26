# escola/base/urls.py

from django.urls import path
from . import views
from .views import (
    lista_salas, detalhe_sala,
    lista_alunos, lista_disciplinas, lista_notas, lista_eventos,
    lista_materiais, lista_emprestimos, lista_mensalidades, lista_colaboradores,
    boletim_aluno, lista_alunos_para_boletim
    # REMOVEMOS O 'RegistrarUsuarioView' DAQUI
)

urlpatterns = [
    path('boletim/aluno/<int:aluno_id>/', views.boletim_aluno, name='boletim_aluno'),
    path('boletim/alunos/', views.lista_alunos_para_boletim, name='lista_alunos_para_boletim'),
    # REMOVEMOS A LINHA DO 'registrar/' DAQUI
    path('boletim/', lista_alunos_para_boletim, name='lista_alunos_para_boletim'),
    path('boletim/<int:aluno_id>/', boletim_aluno, name='boletim_aluno'),
    path('salas/', lista_salas, name='lista_salas'),
    path('salas/<int:sala_id>/', detalhe_sala, name='detalhe_sala'),
    path('alunos/', lista_alunos, name='lista_alunos'),
    path('disciplinas/', lista_disciplinas, name='lista_disciplinas'),
    path('notas/', lista_notas, name='lista_notas'),
    path('eventos/', lista_eventos, name='lista_eventos'),
    path('material/', lista_materiais, name='lista_materiais'),
    path('emprestimos/', lista_emprestimos, name='lista_emprestimos'),
    path('mensalidades/', lista_mensalidades, name='lista_mensalidades'),
    path('colaboradores/', lista_colaboradores, name='lista_colaboradores'),
]