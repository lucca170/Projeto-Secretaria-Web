from django.shortcuts import render, get_object_or_404
from .models import EventoCalendario, MaterialDidatico, EmprestimoMaterial, Colaborador, SalaLaboratorio
from pedagogico.models import Aluno, Disciplina, Nota
from financeiro.models import Mensalidade

def lista_salas(request):
    salas = SalaLaboratorio.objects.all()
    return render(request, 'base/lista_salas.html', {'salas': salas})

def detalhe_sala(request, sala_id):
    sala = get_object_or_404(SalaLaboratorio, id=sala_id)
    return render(request, 'base/detalhe_sala.html', {'sala': sala})

def lista_alunos(request):
    alunos = Aluno.objects.all()
    return render(request, 'base/lista_alunos.html', {'alunos': alunos})

def lista_disciplinas(request):
    disciplinas = Disciplina.objects.all()
    return render(request, 'base/lista_disciplinas.html', {'disciplinas': disciplinas})

def lista_notas(request):
    notas = Nota.objects.all()
    return render(request, 'base/lista_notas.html', {'notas': notas})

def lista_eventos(request):
    eventos = EventoCalendario.objects.all()
    return render(request, 'base/lista_eventos.html', {'eventos': eventos})

def lista_materiais(request):
    materiais = MaterialDidatico.objects.all()
    return render(request, 'base/lista_materiais.html', {'materiais': materiais})

def lista_emprestimos(request):
    emprestimos = EmprestimoMaterial.objects.all()
    return render(request, 'base/lista_emprestimos.html', {'emprestimos': emprestimos})

def lista_mensalidades(request):
    mensalidades = Mensalidade.objects.all()
    return render(request, 'base/lista_mensalidades.html', {'mensalidades': mensalidades})

def lista_colaboradores(request):
    colaboradores = Colaborador.objects.all()
    return render(request, 'base/lista_colaboradores.html', {'colaboradores': colaboradores})
