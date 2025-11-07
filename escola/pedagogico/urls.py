from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'eventos-academicos', views.EventoAcademicoViewSet, basename='eventoacademico')
router.register(r'alunos', views.AlunoViewSet, basename='aluno')
router.register(r'turmas', views.TurmaViewSet, basename='turma')
router.register(r'disciplinas', views.DisciplinaViewSet, basename='disciplina')
router.register(r'notas', views.NotaViewSet, basename='nota')
router.register(r'materias', views.MateriaViewSet, basename='materia')


urlpatterns = [
    # API
    path('api/', include(router.urls)),

    # Relatórios
    path('relatorio/aluno/<int:aluno_id>/', views.relatorio_desempenho_aluno, name='relatorio_desempenho_aluno'),
    path('relatorio/aluno/<int:aluno_id>/pdf/', views.download_boletim_pdf, name='download_boletim_pdf'),
    path('relatorio/faltas/', views.relatorio_geral_faltas, name='relatorio_faltas'), 
    path('relatorio/gerencial/', views.relatorio_gerencial, name='relatorio_gerencial'),
    
    # Agenda
    path('calendario/', views.calendario_academico, name='calendario_academico'),
    path('agenda/professor/', views.planos_de_aula_professor, name='agenda_professor'),
]