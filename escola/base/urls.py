from django.urls import path
from .views import (
    registrar, fazer_login, fazer_logout, home,
    lista_salas, detalhe_sala, lista_disciplinas,
    lista_alunos_para_boletim, boletim_aluno,
    CustomLoginView, lista_materiais, lista_emprestimos,
    lista_mensalidades, lista_colaboradores
)

urlpatterns = [
    path('registrar/', registrar, name='registrar'),
    path('login/', fazer_login, name='login'),
    path('logout/', fazer_logout, name='logout'),
    path('', home, name='home'),
    path('salas/', lista_salas, name='lista_salas'),
    path('salas/<int:sala_id>/', detalhe_sala, name='detalhe_sala'),
    path('disciplinas/', lista_disciplinas, name='lista_disciplinas'),
    path('alunos/', lista_alunos_para_boletim, name='lista_alunos'),
    path('boletim/<int:aluno_id>/', boletim_aluno, name='boletim_aluno'),
    path('material/', lista_materiais, name='lista_materiais'),
    path('emprestimos/', lista_emprestimos, name='lista_emprestimos'),
    path('mensalidades/', lista_mensalidades, name='lista_mensalidades'),
    path('colaboradores/', lista_colaboradores, name='lista_colaboradores'),
    path('api/login/', CustomLoginView.as_view(), name='api_login'),
]

