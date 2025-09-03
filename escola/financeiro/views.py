from django.shortcuts import render
from .models import Mensalidade

def lista_mensalidades(request):
    mensalidades = Mensalidade.objects.all()
    return render(request, 'financeiro/lista_mensalidades.html', {'mensalidades': mensalidades})