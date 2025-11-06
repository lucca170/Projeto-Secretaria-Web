# escola/pedagogico/admin.py
from django.contrib import admin
from .models import Turma, Aluno, Disciplina, Nota, Falta, EmprestimoMaterial

@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'turno')
    search_fields = ('nome',)
    list_filter = ('turno',)

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'turma')
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'turma__nome')
    list_filter = ('turma',)

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'professor', 'turma')
    search_fields = ('nome', 'professor__username', 'turma__nome')
    list_filter = ('turma', 'professor')

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'valor')
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('disciplina',)

@admin.register(Falta)
class FaltaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'data', 'justificada')
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('data', 'justificada')

@admin.register(EmprestimoMaterial)
class EmprestimoMaterialAdmin(admin.ModelAdmin):
    list_display = ('material', 'aluno', 'data_emprestimo', 'data_devolucao')
    search_fields = ('material__nome', 'aluno__usuario__username')
    list_filter = ('data_emprestimo', 'data_devolucao')
