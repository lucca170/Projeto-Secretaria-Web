from django.contrib import admin
from .models import Advertencia, Suspensao

@admin.register(Advertencia)
class AdvertenciaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data', 'motivo')
    search_fields = ('aluno__nome', 'motivo')
    list_filter = ('data',)

@admin.register(Suspensao)
class SuspensaoAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data_inicio', 'data_fim', 'motivo')
    search_fields = ('aluno__nome', 'motivo')
    list_filter = ('data_inicio', 'data_fim')
