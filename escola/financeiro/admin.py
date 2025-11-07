from django.contrib import admin
from .models import Mensalidade

@admin.register(Mensalidade)
class MensalidadeAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'mes', 'valor', 'pago', 'data_pagamento')
    
    search_fields = ('aluno__usuario__username', 'aluno__usuario__first_name', 'aluno__usuario__last_name')
    list_filter = ('pago', 'mes')