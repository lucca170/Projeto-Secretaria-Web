# escola/disciplinar/admin.py
from django.contrib import admin
from .models import Advertencia, Suspensao

@admin.register(Advertencia)
class AdvertenciaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data', 'motivo')
   
    search_fields = ('aluno__usuario__username', 'aluno__usuario__first_name', 'aluno__usuario__last_name')
    list_filter = ('data',)

@admin.register(Suspensao)
class SuspensaoAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data_inicio', 'data_fim', 'motivo')
    []
    search_fields = ('aluno__usuario__username', 'aluno__usuario__first_name', 'aluno__usuario__last_name')
    list_filter = ('data_inicio',)