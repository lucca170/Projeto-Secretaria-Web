from django.shortcuts import render, redirect, get_object_or_404
from .forms import TurmaForm, AlunoForm
from .models import Turma, Aluno, Disciplina, Nota, EmprestimoMaterial
from rest_framework import viewsets, permissions
from escola.base.models import Aluno
from .serializers import AlunoSerializer
from escola.base.permissions import IsProfessor, IsAluno, IsCoordenacao

def adicionar_turma(request):
    if request.method == 'POST':
        form = TurmaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_turmas')
    else:
        form = TurmaForm()
    return render(request, 'pedagogico/adicionar_turma.html', {'form': form})

def adicionar_aluno(request):
    if request.method == 'POST':
        form = AlunoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_alunos')
    else:
        form = AlunoForm()
    return render(request, 'pedagogico/adicionar_aluno.html', {'form': form})

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

class AlunoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite visualizar ou editar alunos.
    """
    queryset = Aluno.objects.all().order_by('nome') # Busca todos os alunos ordenados por nome
    serializer_class = AlunoSerializer
    
    def get_permissions(self):
        """
        Define quem pode fazer o quê.
        """
        # Apenas Professor ou Administrador podem criar/editar/deletar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, (IsProfessor | IsCoordenacao)] 
        # Todos logados (Aluno, Professor, Admin) podem listar/ver detalhes
        elif self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser] # Ações desconhecidas só para admin

        return [permission() for permission in permission_classes]