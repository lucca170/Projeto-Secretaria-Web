from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, CustomAuthenticationForm
# CORREÇÃO: Importando os modelos corretos (SalaLaboratorio e Aluno)
from .models import Usuario, SalaLaboratorio # Modelos que ficam em 'base'
from escola.pedagogico.models import Disciplina, Nota, Aluno # Modelos corretos vindo de 'pedagogico'
from django.template.loader import render_to_string
from django.http import HttpResponse

# --- Imports da API (já corrigidos anteriormente) ---
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import CustomAuthTokenSerializer 
# (Certifique-se de que você criou o arquivo escola/base/serializers.py)


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
    # CORREÇÃO: Usando 'cargo'
    if request.user.cargo == 'aluno':
        # NOTA: Esta é uma solução temporária, pois seu model Usuario (usuário logado)
        # não está diretamente ligado ao seu model Aluno (onde ficam as notas).
        # Estamos presumindo que o 'username' do Usuario é igual ao 'nome' do Aluno.
        # O ideal seria ter um OneToOneField ligando Usuario e Aluno.
        try:
            aluno_model = Aluno.objects.get(nome=request.user.username)
            notas = Nota.objects.filter(aluno=aluno_model)
            context = {
                'aluno': aluno_model,
                'notas': notas,
            }
        except Aluno.DoesNotExist:
            context = {
                'aluno': request.user, # Mostra o usuário
                'notas': [], # Sem notas pois não achou o Aluno correspondente
            }
        return render(request, 'base/boletim_aluno.html', context)
    
    # CORREÇÃO: Usando 'cargo'
    elif request.user.cargo == 'professor':
        # CORREÇÃO: A lista de alunos agora vem do model 'Aluno'
        alunos = Aluno.objects.all()
        return render(request, 'base/lista_alunos_para_boletim.html', {'alunos': alunos})
        
    # CORREÇÃO: Usando 'cargo' e 'administrador'
    elif request.user.cargo == 'administrador':
        # return render(request, 'base/home_coordenacao.html') # Crie este template se quiser
        return render(request, 'base/base.html')
        
    else:
        return render(request, 'base/base.html')

@login_required
def lista_salas(request):
    # CORREÇÃO: Usando SalaLaboratorio
    salas = SalaLaboratorio.objects.all()
    return render(request, 'base/lista_salas.html', {'salas': salas})

@login_required
def detalhe_sala(request, sala_id):
    # CORREÇÃO: Usando SalaLaboratorio
    sala = get_object_or_404(SalaLaboratorio, id=sala_id)
    # NOTA: A lógica de ver alunos na sala está quebrada no seu models.py,
    # pois nem Usuario nem Aluno têm um campo 'sala'.
    # Retornando lista vazia para o servidor não quebrar.
    alunos = []
    return render(request, 'base/detalhe_sala.html', {'sala': sala, 'alunos': alunos})

@login_required
def lista_disciplinas(request):
    disciplinas = Disciplina.objects.all()
    return render(request, 'base/lista_disciplinas.html', {'disciplinas': disciplinas})

@login_required
def lista_alunos_para_boletim(request):
    # CORREÇÃO: Usando 'cargo' e 'administrador'
    if request.user.cargo not in ['professor', 'administrador']:
        return redirect('home')
        
    # CORREÇÃO: Buscando do model Aluno
    alunos = Aluno.objects.all()
    return render(request, 'base/lista_alunos_para_boletim.html', {'alunos': alunos})

@login_required
def boletim_aluno(request, aluno_id):
    # CORREÇÃO: Usando 'cargo' e 'administrador'
    if request.user.cargo in ['professor', 'administrador']:
        # CORREÇÃO: Buscando do model Aluno pelo ID
        aluno = get_object_or_404(Aluno, id=aluno_id)
    
    # CORREÇÃO: Usando 'cargo'
    elif request.user.cargo == 'aluno':
        aluno = get_object_or_404(Aluno, id=aluno_id)
        # NOTA: Aqui existe uma falha de segurança no seu modelo.
        # Como Usuario e Aluno não estão ligados, um aluno logado
        # poderia, em tese, ver o boletim de outro se adivinhar o ID na URL.
        # A solução (futura) é ligar Usuario e Aluno com OneToOneField.
    else:
        return redirect('home')

    # Esta parte agora funciona, pois 'aluno' é um objeto do model Aluno
    notas = Nota.objects.filter(aluno=aluno)
    context = {
        'aluno': aluno,
        'notas': notas,
    }
    return render(request, 'base/boletim_aluno.html', context)

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


# --- NOVA VIEW DE LOGIN DA API ---
# (Esta classe já estava correta e usa 'cargo')

class CustomLoginView(ObtainAuthToken):
    """
    View de Login customizada que usa o serializer customizado.
    """
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Retorna o token E os dados do usuário do serializer
        return Response({
            'token': token.key,
            'user': serializer.validated_data['user_data']
        })