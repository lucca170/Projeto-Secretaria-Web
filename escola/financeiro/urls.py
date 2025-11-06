from django.urls import path
from .views import (
    lista_mensalidades, adicionar_mensalidade,
    lista_transacoes, adicionar_transacao
)

urlpatterns = [
    path('mensalidades/', lista_mensalidades, name='lista_mensalidades'),
    path('mensalidades/adicionar/', adicionar_mensalidade, name='adicionar_mensalidade'),
    path('transacoes/', lista_transacoes, name='lista_transacoes'),
    path('transacoes/adicionar/', adicionar_transacao, name='adicionar_transacao'),
]