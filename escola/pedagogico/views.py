# escola/pedagogico/views.py

from django.shortcuts import render, redirect
from .forms import TurmaForm, AlunoForm
from .models import Turma, Aluno

# Imports para a API
from rest_framework import viewsets
from .serializers import AlunoSerializer, TurmaSerializer

from rest_framework.permissions import IsAuthenticated # Importar



# SUAS VIEWS ANTIGAS (baseadas em templates)
def adicionar_turma(request):
    if request.method == 'POST':
        form = TurmaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_turmas')
    else:
        form = TurmaForm()
    return render(request, 'pedagogico/adicionar_turma.html', {'form': form})

def lista_turmas(request):
    turmas = Turma.objects.all()
    return render(request, 'pedagogico/lista_turmas.html', {'turmas': turmas})

def adicionar_aluno(request):
    if request.method == 'POST':
        form = AlunoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_turmas')
    else:
        form = AlunoForm()
    return render(request, 'pedagogico/adicionar_aluno.html', {'form': form})

# NOVAS VIEWS DA API
class AlunoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que os alunos sejam visualizados ou editados.
    """
    queryset = Aluno.objects.select_related('usuario', 'turma').prefetch_related('advertencias_aluno', 'suspensoes_aluno').all().order_by('usuario__first_name')
    serializer_class = AlunoSerializer

class TurmaViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que as turmas sejam visualizadas ou editadas.
    """
    queryset = Turma.objects.all()
    serializer_class = TurmaSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Adicionar esta linha
    queryset = Aluno.objects.select_related('usuario', 'turma').prefetch_related('advertencias', 'suspensoes').all().order_by('usuario__first_name')
    serializer_class = AlunoSerializer

class TurmaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] # Adicionar esta linha
    queryset = Turma.objects.all()
    serializer_class = TurmaSerializer
