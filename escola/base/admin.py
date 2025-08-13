from django.contrib import admin
from .models import (
    Colaborador,
    EventoCalendario, Notificacao,
    MaterialDidatico, EmprestimoMaterial, SalaLaboratorio, ReservaSala,
    EventoExtracurricular
)
from pedagogico.models import Aluno, Disciplina, Nota, Falta
from disciplinar.models import Advertencia, Suspensao
from financeiro.models import Mensalidade

# --- Gestão Acadêmica ---
@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'turma')
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'turma__nome')
    list_filter = ('turma',)
    fieldsets = (
        ('Informações pessoais', {
            'fields': ('usuario', 'turma')
        }),
    )

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'turma')
    search_fields = ('nome', 'turma__nome')
    fieldsets = (
        ('Disciplina', {
            'fields': ('nome', 'turma')
        }),
    )

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'valor')
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('disciplina',)
    fieldsets = (
        ('Informações da nota', {
            'fields': ('aluno', 'disciplina', 'valor')
        }),
    )

@admin.register(Advertencia)
class AdvertenciaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data', 'motivo')
    search_fields = ('aluno__nome', 'motivo')
    list_filter = ('data',)
    fieldsets = (
        ('Advertência', {
            'fields': ('aluno', 'data', 'motivo')
        }),
    )

@admin.register(Suspensao)
class SuspensaoAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data_inicio', 'data_fim', 'motivo')
    search_fields = ('aluno__nome', 'motivo')
    list_filter = ('data_inicio', 'data_fim')
    fieldsets = (
        ('Suspensão', {
            'fields': ('aluno', 'data_inicio', 'data_fim', 'motivo')
        }),
    )

@admin.register(Falta)
class FaltaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'data', 'justificada')
    search_fields = ('aluno__nome', 'disciplina__nome')
    list_filter = ('data', 'justificada')
    fieldsets = (
        ('Falta', {
            'fields': ('aluno', 'disciplina', 'data', 'justificada')
        }),
    )

# --- Agenda Escolar e Notificações ---
@admin.register(EventoCalendario)
class EventoCalendarioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'data_inicio', 'data_fim', 'tipo')
    search_fields = ('titulo', 'descricao')
    list_filter = ('tipo', 'data_inicio')
    fieldsets = (
        ('Evento', {
            'fields': ('titulo', 'data_inicio', 'data_fim', 'tipo')
        }),
    )

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('destinatario', 'titulo', 'data_envio', 'lida')
    search_fields = ('destinatario', 'titulo')
    list_filter = ('lida', 'data_envio')
    fieldsets = (
        ('Notificação', {
            'fields': ('destinatario', 'titulo', 'mensagem', 'lida')
        }),
    )

# --- Materiais e Recursos ---
@admin.register(MaterialDidatico)
class MaterialDidaticoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'quantidade', 'disponivel')
    search_fields = ('nome', 'tipo')
    list_filter = ('disponivel',)
    fieldsets = (
        ('Material didático', {
            'fields': ('nome', 'tipo', 'quantidade', 'disponivel')
        }),
    )

@admin.register(EmprestimoMaterial)
class EmprestimoMaterialAdmin(admin.ModelAdmin):
    list_display = ('material', 'aluno', 'data_emprestimo', 'data_devolucao')
    search_fields = ('material__nome', 'aluno__nome')
    list_filter = ('data_emprestimo', 'data_devolucao')
    fieldsets = (
        ('Empréstimo de material', {
            'fields': ('material', 'aluno', 'data_emprestimo', 'data_devolucao')
        }),
    )

@admin.register(SalaLaboratorio)
class SalaLaboratorioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'capacidade')
    search_fields = ('nome', 'tipo')
    fieldsets = (
        ('Sala de laboratório', {
            'fields': ('nome', 'tipo', 'capacidade')
        }),
    )

@admin.register(ReservaSala)
class ReservaSalaAdmin(admin.ModelAdmin):
    list_display = ('sala', 'usuario', 'data_inicio', 'data_fim')
    search_fields = ('sala__nome', 'usuario')
    list_filter = ('data_inicio', 'data_fim')
    fieldsets = (
        ('Reserva de sala', {
            'fields': ('sala', 'usuario', 'data_inicio', 'data_fim')
        }),
    )

# --- Gestão Financeira ---
@admin.register(Mensalidade)
class MensalidadeAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'mes', 'valor', 'pago', 'data_pagamento')
    search_fields = ('aluno__nome', 'mes')
    list_filter = ('pago', 'mes')
    fieldsets = (
        ('Mensalidade', {
            'fields': ('aluno', 'mes', 'valor', 'pago', 'data_pagamento')
        }),
    )

# --- Eventos e Atividades Extracurriculares ---
@admin.register(EventoExtracurricular)
class EventoExtracurricularAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data', 'vagas')
    search_fields = ('nome',)
    list_filter = ('data',)
    fieldsets = (
        ('Evento extracurricular', {
            'fields': ('nome', 'data', 'vagas')
        }),
    )
