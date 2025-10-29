from django.urls import path
from .views import (
    adicionar_turma,
    listar_turmas,
)

app_name = 'pedagogico'

urlpatterns = [
    path('turmas/adicionar/', adicionar_turma, name='adicionar_turma'),
    path('turmas/', listar_turmas, name='listar_turmas'),
]