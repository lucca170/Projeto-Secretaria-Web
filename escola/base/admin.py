# escola/base/admin.py
from django.contrib import admin
from .models import (
    Colaborador, EventoCalendario, Notificacao,
    MaterialDidatico, SalaLaboratorio, ReservaSala
)

@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'cargo')
    search_fields = ('nome', 'cpf')

@admin.register(EventoCalendario)
class EventoCalendarioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'data_inicio', 'data_fim', 'tipo')
    search_fields = ('titulo', 'descricao')
    list_filter = ('tipo', 'data_inicio')

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('destinatario', 'titulo', 'data_envio', 'lida')
    search_fields = ('destinatario', 'titulo')
    list_filter = ('lida', 'data_envio')

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