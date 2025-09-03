# escola/pedagogico/views.py
from django.shortcuts import render, redirect, get_object_or_404
from .forms import TurmaForm
from .models import Turma, Aluno, Disciplina, Nota, EmprestimoMaterial

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

def lista_alunos(request):
    alunos = Aluno.objects.all()
    return render(request, 'pedagogico/lista_alunos.html', {'alunos': alunos})

def lista_disciplinas(request):
    disciplinas = Disciplina.objects.all()
    return render(request, 'pedagogico/lista_disciplinas.html', {'disciplinas': disciplinas})

def lista_notas(request):
    notas = Nota.objects.all()
    return render(request, 'pedagogico/lista_notas.html', {'notas': notas})

def lista_emprestimos(request):
    emprestimos = EmprestimoMaterial.objects.all()
    return render(request, 'pedagogico/lista_emprestimos.html', {'emprestimos': emprestimos})

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

    return render(request, 'pedagogico/boletim_aluno.html', {'boletim': boletim})

def lista_alunos_para_boletim(request):
    alunos = Aluno.objects.all()
    return render(request, 'pedagogico/lista_alunos_para_boletim.html', {'alunos': alunos})