from django.urls import path
from .views import lista_mensalidades

urlpatterns = [
    path('mensalidades/', lista_mensalidades, name='lista_mensalidades'),
]