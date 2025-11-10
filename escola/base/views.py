from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate, get_user_model # <-- MUDANÇA AQUI
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView
from django.urls import reverse_lazy
from django.db.models import Count, Avg
from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .serializers import CustomAuthTokenSerializer, UserSerializer
# from .models import User  <-- MUDANÇA AQUI (LINHA REMOVIDA)
from .forms import CustomUserCreationForm
from .permissions import IsCoordenacao

User = get_user_model() # <-- MUDANÇA AQUI (LINHA ADICIONADA)

# --- Views base (HTML) ---

def home(request):
    return render(request, 'base/base.html')

def registrar(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # Redirecionar para a home
    else:
        form = CustomUserCreationForm()
    return render(request, 'base/registrar.html', {'form': form})

# --- Viewsets da API ---

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Usuários.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsCoordenacao] # Apenas Coordenacao pode ver/editar

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Retorna os dados do usuário logado.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# --- Views de API (Funções) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao])
def dashboard_data(request):
    """
    Coleta dados para o dashboard da coordenação.
    """
    total_alunos = User.objects.filter(cargo='aluno').count()
    total_professores = User.objects.filter(cargo='professor').count()
    total_turmas = 0 # Substitua por: Turma.objects.count()
    
    # Exemplo de dados de evasão (simplificado)
    evasao_percentual = 0 # Calcule com base nos Alunos
    
    # Exemplo de média geral (simplificado)
    media_geral_escola = 0 # Calcule com base nas Notas

    data = {
        'total_alunos': total_alunos,
        'total_professores': total_professores,
        'total_turmas': total_turmas,
        'evasao_percentual': evasao_percentual,
        'media_geral_escola': media_geral_escola,
    }
    return Response(data)

# --- Autenticação ---

class CustomAuthToken(ObtainAuthToken):
    """
    View de login customizada.
    Recebe 'username' (CPF) e 'password'.
    Retorna o token e os dados do usuário.
    """
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        # Serializa os dados do usuário para incluir na resposta
        user_data = UserSerializer(user).data

        return Response({
            'token': token.key,
            # Correção do KeyError (já estava da outra vez, mas mantida)
            'user': user_data 
        })