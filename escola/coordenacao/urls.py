from django.urls import path
from .views import CustomAuthToken 
from .views import (
    lista_salas, detalhe_sala, lista_eventos,
    lista_materiais, lista_colaboradores
)

urlpatterns = [
    path('salas/', lista_salas, name='lista_salas'),
    path('salas/<int:sala_id>/', detalhe_sala, name='detalhe_sala'),
    path('eventos/', lista_eventos, name='lista_eventos'),
    path('material/', lista_materiais, name='lista_materiais'),
    path('colaboradores/', lista_colaboradores, name='lista_colaboradores'),
    path('api-token-auth/', CustomAuthToken.as_view(), name='api_token_auth'),
]
