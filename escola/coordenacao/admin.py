# escola/coordenacao/admin.py
from django.contrib import admin
from .models import (
    Colaborador, 
    # EventoCalendario e Notificacao removidos daqui
    MaterialDidatico, 
    SalaLaboratorio, 
    ReservaSala,
    RelatorioGerencial # Adicionado para garantir
)

@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'cargo')
    search_fields = ('nome', 'cpf')

# REMOVIDO: O @admin.register(EventoCalendario)
# REMOVIDO: O @admin.register(Notificacao)

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
    search_fields = ('sala__nome', 'usuario__username') # Atualizado para buscar no FK
    list_filter = ('data_inicio', 'data_fim')

# ADICIONADO: Registro do RelatorioGerencial que faltava
@admin.register(RelatorioGerencial)
class RelatorioGerencialAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data_geracao')
    list_filter = ('tipo',)