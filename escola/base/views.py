from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, CustomAuthenticationForm
# --- CORREÇÃO DE IMPORTS ---
from .models import Usuario 
from escola.coordenacao.models import SalaLaboratorio # Modelo movido para coordenacao
from escola.pedagogico.models import Disciplina, Nota, Aluno # Modelos agora em pedagogico
# --- FIM DA CORREÇÃO ---
from django.template.loader import render_to_string
from django.http import HttpResponse

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import CustomAuthTokenSerializer 


def registrar(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'base/registrar.html', {'form': form})

def fazer_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

def fazer_logout(request):
    logout(request)
    return redirect('home')

@login_required
def home(request):
    if request.user.cargo == 'aluno':
        try:
            # --- CORREÇÃO ---
            # O 'aluno_profile' é a ligação correta entre Usuario e Aluno
            aluno_model = request.user.aluno_profile
            notas = Nota.objects.filter(aluno=aluno_model)
            context = {
                'aluno': aluno_model,
                'notas': notas,
            }
        except Aluno.DoesNotExist:
            context = {
                'aluno': request.user,
                'notas': [],
            }
        return render(request, 'base/boletim_aluno.html', context)
    
    elif request.user.cargo == 'professor':
        alunos = Aluno.objects.all()
        return render(request, 'base/lista_alunos_para_boletim.html', {'alunos': alunos})
        
    elif request.user.cargo == 'administrador':
        return render(request, 'base/base.html')
        
    else:
        return render(request, 'base/base.html')

@login_required
def lista_salas(request):
    salas = SalaLaboratorio.objects.all()
    return render(request, 'base/lista_salas.html', {'salas': salas})

@login_required
def detalhe_sala(request, sala_id):
    sala = get_object_or_404(SalaLaboratorio, id=sala_id)
    alunos = []
    return render(request, 'base/detalhe_sala.html', {'sala': sala, 'alunos': alunos})

@login_required
def lista_disciplinas(request):
    disciplinas = Disciplina.objects.all()
    return render(request, 'base/lista_disciplinas.html', {'disciplinas': disciplinas})

@login_required
def lista_alunos_para_boletim(request):
    if request.user.cargo not in ['professor', 'administrador', 'coordenador', 'diretor', 'ti']:
        return redirect('home')
        
    alunos = Aluno.objects.all()
    return render(request, 'base/lista_alunos_para_boletim.html', {'alunos': alunos})

@login_required
def boletim_aluno(request, aluno_id):
    admin_roles = ['professor', 'administrador', 'coordenador', 'diretor', 'ti']
    
    if request.user.cargo in admin_roles:
        aluno = get_object_or_404(Aluno, id=aluno_id)
    
    elif request.user.cargo == 'aluno':
        # --- MELHORIA DE SEGURANÇA ---
        # Garante que o aluno logado só possa ver o próprio boletim
        aluno = get_object_or_404(Aluno, id=aluno_id, usuario=request.user)
        # --- FIM DA MELHORIA ---
    else:
        return redirect('home')

    notas = Nota.objects.filter(aluno=aluno)
    context = {
        'aluno': aluno,
        'notas': notas,
    }
    return render(request, 'base/boletim_aluno.html', context)

# ... (o restante das views de template podem ser removidas se a API for usada) ...
@login_required
def lista_materiais(request):
    return render(request, 'base/lista_materiais.html', {})

@login_required
def lista_emprestimos(request):
    return render(request, 'base/lista_emprestimos.html', {})

@login_required
def lista_mensalidades(request):
    return render(request, 'base/lista_mensalidades.html', {})

@login_required
def lista_colaboradores(request):
    return render(request, 'base/lista_colaboradores.html', {})


# --- VIEW DE LOGIN DA API ---
class CustomLoginView(ObtainAuthToken):
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': serializer.validated_data['user_data']
        })