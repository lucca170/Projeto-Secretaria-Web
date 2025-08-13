# Crie este arquivo se não existir para registrar os modelos do app coordenacao no admin.

from django.contrib import admin
from .models import (
    User,
    Notificacao,
    EventoCalendario,
    MaterialDidatico,
    EmprestimoMaterial,
    SalaLaboratorio,
    ReservaSala,
    EventoExtracurricular,
    RelatorioGerencial,
    Colaborador,
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'tipo', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'tipo')
    list_filter = ('tipo', 'is_staff', 'is_active')

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('destinatario', 'titulo', 'data_envio', 'lida')
    search_fields = ('destinatario', 'titulo')
    list_filter = ('lida', 'data_envio')

@admin.register(EventoCalendario)
class EventoCalendarioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'data_inicio', 'data_fim', 'tipo')
    search_fields = ('titulo', 'descricao')
    list_filter = ('tipo', 'data_inicio')

@admin.register(MaterialDidatico)
class MaterialDidaticoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'quantidade', 'disponivel')
    search_fields = ('nome', 'tipo')
    list_filter = ('disponivel',)

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

@admin.register(ReservaSala)
class ReservaSalaAdmin(admin.ModelAdmin):
    list_display = ('sala', 'usuario', 'data_inicio', 'data_fim')
    search_fields = ('sala__nome', 'usuario')
    list_filter = ('data_inicio', 'data_fim')

@admin.register(EventoExtracurricular)
class EventoExtracurricularAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data', 'vagas')
    search_fields = ('nome',)
    list_filter = ('data',)

@admin.register(RelatorioGerencial)
class RelatorioGerencialAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'data_geracao', 'tipo')
    search_fields = ('titulo', 'tipo')
    list_filter = ('tipo', 'data_geracao')

@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'cargo')
    search_fields = ('nome', 'cpf', 'cargo')
    list_filter = ('cargo',)
