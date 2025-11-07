from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'eventos-academicos', views.EventoAcademicoViewSet, basename='eventoacademico')
router.register(r'alunos', views.AlunoViewSet, basename='aluno')
router.register(r'turmas', views.TurmaViewSet, basename='turma')
router.register(r'disciplinas', views.DisciplinaViewSet, basename='disciplina')
router.register(r'notas', views.NotaViewSet, basename='nota')


urlpatterns = [
    # API
    path('api/', include(router.urls)),

    # URLs de Template (Mantidas por enquanto, mas a API é o foco)
    # path('turmas/adicionar/', views.adicionar_turma, name='adicionar_turma'),
    # path('turmas/', views.listar_turmas, name='listar_turmas'),
    
    # Relatórios
    path('relatorio/aluno/<int:aluno_id>/', views.relatorio_desempenho_aluno, name='relatorio_desempenho_aluno'),
    path('relatorio/aluno/<int:aluno_id>/pdf/', views.download_boletim_pdf, name='download_boletim_pdf'),
    
    # --- CORREÇÃO AQUI ---
    # Faltava um '=' em 'name='
    path('relatorio/faltas/', views.relatorio_geral_faltas, name='relatorio_faltas'), 
    
    path('relatorio/gerencial/', views.relatorio_gerencial, name='relatorio_gerencial'),
    
    # Agenda
    path('calendario/', views.calendario_academico, name='calendario_academico'),
    path('agenda/professor/', views.planos_de_aula_professor, name='agenda_professor'),
]