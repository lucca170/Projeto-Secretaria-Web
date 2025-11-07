# escola/pedagogico/admin.py
from django.contrib import admin
# ADICIONADO: EventoAcademico, Notificacao, Responsavel, PlanoDeAula
from .models import (
    Turma, 
    Aluno, 
    Disciplina, 
    Nota, 
    Falta, 
    EmprestimoMaterial,
    EventoAcademico,
    Notificacao,
    Responsavel,
    PlanoDeAula
)

@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'turno')
    search_fields = ('nome',)
    list_filter = ('turno',)

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'turma', 'status') # Adicionado status
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'turma__nome')
    list_filter = ('turma', 'status') # Adicionado status

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'professor', 'turma', 'carga_horaria') # Add carga_horaria
    search_fields = ('nome', 'professor__username', 'turma__nome')
    list_filter = ('turma', 'professor')

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'bimestre', 'valor') # Add bimestre
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('disciplina', 'bimestre') # Add bimestre

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

# --- REGISTROS NOVOS ADICIONADOS ABAIXO ---

@admin.register(EventoAcademico)
class EventoAcademicoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data_inicio', 'data_fim', 'turma', 'disciplina')
    search_fields = ('titulo', 'descricao')
    list_filter = ('tipo', 'data_inicio', 'turma', 'disciplina')

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('destinatario', 'mensagem', 'data_envio', 'lida')
    search_fields = ('destinatario__username', 'mensagem')
    list_filter = ('lida', 'data_envio')

@admin.register(Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    list_display = ('usuario',)
    search_fields = ('usuario__username',)

@admin.register(PlanoDeAula)
class PlanoDeAulaAdmin(admin.ModelAdmin):
    list_display = ('disciplina', 'data', 'conteudo_previsto')
    search_fields = ('disciplina__nome', 'conteudo_previsto')
    list_filter = ('data', 'disciplina')