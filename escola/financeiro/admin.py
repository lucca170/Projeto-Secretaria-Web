from django.contrib import admin
from .models import Mensalidade

@admin.register(Mensalidade)
class MensalidadeAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'mes', 'valor', 'pago', 'data_pagamento')
    search_fields = ('aluno__nome',)
    list_filter = ('pago', 'mes')