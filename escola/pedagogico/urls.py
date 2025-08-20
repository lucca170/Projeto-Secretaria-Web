from django.urls import path
from .views import adicionar_turma, lista_turmas

urlpatterns = [
    path('turmas/', lista_turmas, name='lista_turmas'),
    path('turmas/adicionar/', adicionar_turma, name='adicionar_turma'),
]