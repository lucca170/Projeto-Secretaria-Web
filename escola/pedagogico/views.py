# escola/pedagogico/views.py
from django.shortcuts import render, redirect
from .forms import TurmaForm
from .models import Turma # Adicione esta linha

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