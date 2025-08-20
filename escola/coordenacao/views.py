from django.shortcuts import render, get_object_or_404
from .models import EventoCalendario, MaterialDidatico, Colaborador, SalaLaboratorio

def lista_salas(request):
    salas = SalaLaboratorio.objects.all()
    return render(request, 'coordenacao/lista_salas.html', {'salas': salas})

def detalhe_sala(request, sala_id):
    sala = get_object_or_404(SalaLaboratorio, id=sala_id)
    return render(request, 'coordenacao/detalhe_sala.html', {'sala': sala})

def lista_eventos(request):
    eventos = EventoCalendario.objects.all()
    return render(request, 'coordenacao/lista_eventos.html', {'eventos': eventos})

def lista_materiais(request):
    materiais = MaterialDidatico.objects.all()
    return render(request, 'coordenacao/lista_materiais.html', {'materiais': materiais})

def lista_colaboradores(request):
    colaboradores = Colaborador.objects.all()
    return render(request, 'coordenacao/lista_colaboradores.html', {'colaboradores': colaboradores})