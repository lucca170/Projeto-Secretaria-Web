
from django.contrib import admin
from .models import (
    User,
    Notificacao,
    EventoCalendario,
    MaterialDidatico,
    # EmprestimoMaterial,  <-- REMOVIDO
    SalaLaboratorio,
    ReservaSala,
    # EventoExtracurricular, <-- REMOVIDO
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

@admin.register(SalaLaboratorio)
class SalaLaboratorioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'capacidade')
    search_fields = ('nome', 'tipo')

@admin.register(ReservaSala)
class ReservaSalaAdmin(admin.ModelAdmin):
    list_display = ('sala', 'usuario', 'data_inicio', 'data_fim')
    search_fields = ('sala__nome', 'usuario')
    list_filter = ('data_inicio', 'data_fim')

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