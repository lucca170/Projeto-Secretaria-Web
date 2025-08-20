from django.shortcuts import render, get_object_or_404
# Modelos da app 'base'
from .models import EventoCalendario, MaterialDidatico, Colaborador, SalaLaboratorio
# Modelos de outras apps
from escola.pedagogico.models import Aluno, Disciplina, Nota, EmprestimoMaterial
from escola.financeiro.models import Mensalidade

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

def boletim_aluno(request, aluno_id):
    aluno = get_object_or_404(Aluno, id=aluno_id)
    notas = Nota.objects.filter(aluno=aluno).select_related('disciplina')
    
    disciplinas = {}
    for nota in notas:
        if nota.disciplina.nome not in disciplinas:
            disciplinas[nota.disciplina.nome] = []
        disciplinas[nota.disciplina.nome].append(nota.valor)
        
    boletim = {
        'aluno': aluno,
        'disciplinas': disciplinas
    }
    
    return render(request, 'base/boletim_aluno.html', {'boletim': boletim})

def lista_alunos_para_boletim(request):
    alunos = Aluno.objects.all()
    return render(request, 'base/lista_alunos_para_boletim.html', {'alunos': alunos})