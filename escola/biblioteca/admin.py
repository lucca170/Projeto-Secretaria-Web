# Em: escola/biblioteca/admin.py
from django.contrib import admin
from .models import Autor, Livro, Emprestimo

@admin.register(Autor)
class AutorAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)

@admin.register(Livro)
class LivroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'isbn', 'quantidade_total', 'quantidade_disponivel')
    search_fields = ('titulo', 'autor__nome', 'isbn')
    list_filter = ('autor',)

@admin.register(Emprestimo)
class EmprestimoAdmin(admin.ModelAdmin):
    list_display = ('livro', 'aluno', 'data_emprestimo', 'data_devolucao_prevista', 'data_devolucao_real')
    search_fields = ('livro__titulo', 'aluno__usuario__username')
    list_filter = ('data_emprestimo', 'data_devolucao_prevista', 'data_devolucao_real')