from django.contrib import admin
from .models import Aluno, Disciplina, Nota, Falta, EmprestimoMaterial, EventoExtracurricular # <-- ADICIONADOS AQUI

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'turma')
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'turma__nome')
    list_filter = ('turma',)

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'professor', 'turma')
    search_fields = ('nome', 'professor__username', 'professor__first_name', 'professor__last_name', 'turma__nome')

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'valor')
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('disciplina',)

@admin.register(Falta)
class FaltaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'data', 'justificada')
    search_fields = ('aluno__nome', 'disciplina__nome')
    list_filter = ('data', 'justificada')

# BLOCOS DE CÓDIGO MOVIDOS PARA CÁ
@admin.register(EmprestimoMaterial)
class EmprestimoMaterialAdmin(admin.ModelAdmin):
    list_display = ('material', 'aluno', 'data_emprestimo', 'data_devolucao')
    search_fields = ('material__nome', 'aluno__nome')
    list_filter = ('data_emprestimo', 'data_devolucao')

@admin.register(EventoExtracurricular)
class EventoExtracurricularAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data', 'vagas')
    search_fields = ('nome',)
    list_filter = ('data',)