from django.shortcuts import render, get_object_or_404
# --- CORREÇÃO AQUI ---
from escola.pedagogico.models import EventoAcademico # O nome correto é EventoAcademico
from .models import MaterialDidatico, Colaborador, SalaLaboratorio 
# --- FIM DA CORREÇÃO ---

def lista_salas(request):
    salas = SalaLaboratorio.objects.all()
    return render(request, 'coordenacao/lista_salas.html', {'salas': salas})

def detalhe_sala(request, sala_id):
    sala = get_object_or_404(SalaLaboratorio, id=sala_id)
    return render(request, 'coordenacao/detalhe_sala.html', {'sala': sala})

def lista_eventos(request):
    eventos = EventoAcademico.objects.all() # O nome da variável aqui não importa
    return render(request, 'coordenacao/lista_eventos.html', {'eventos': eventos})

def lista_materiais(request):
    materiais = MaterialDidatico.objects.all()
    return render(request, 'coordenacao/lista_materiais.html', {'materiais': materiais})

def lista_colaboradores(request):
    colaboradores = Colaborador.objects.all()
    return render(request, 'coordenacao/lista_colaboradores.html', {'colaboradores': colaboradores})

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })