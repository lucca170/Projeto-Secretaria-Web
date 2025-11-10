# Em: escola/base/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate, get_user_model
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView
from django.urls import reverse_lazy
from django.db.models import Count, Avg
from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string
import random # <-- ADICIONADO
import string # <-- ADICIONADO

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .serializers import CustomAuthTokenSerializer, UserSerializer
from .forms import CustomUserCreationForm
from .permissions import IsCoordenacao

User = get_user_model()

# --- Views base (HTML) ---
# ... (home e registrar continuam iguais) ...
def home(request):
    return render(request, 'base/base.html')

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


# --- Viewsets da API ---

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Usuários.
    Modificado para filtrar por cargo e retornar senha temporária.
    """
    # queryset = User.objects.all().order_by('-date_joined') # <--- LINHA ANTIGA
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsCoordenacao]

    # --- MÉTODO NOVO ---
    def get_queryset(self):
        """
        Filtra o queryset com base no cargo (se fornecido na URL).
        """
        queryset = User.objects.all().order_by('first_name')
        cargo = self.request.query_params.get('cargo')
        if cargo:
            queryset = queryset.filter(cargo=cargo)
        return queryset

    # --- MÉTODO NOVO ---
    def create(self, request, *args, **kwargs):
        """
        Cria um usuário (Professor, Admin, etc.) com senha aleatória.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Gera senha temporária
        password = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        # Pega os dados validados
        validated_data = serializer.validated_data
        
        # Cria o usuário usando o create_user para hashear a senha
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            cargo=validated_data.get('cargo'),
            password=password
        )
        
        # Prepara a resposta
        response_data = UserSerializer(user).data
        response_data['temp_password'] = password # Adiciona a senha à resposta

        headers = self.get_success_headers(response_data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Retorna os dados do usuário logado.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# --- Views de API (Funções) ---
# ... (dashboard_data continua igual) ...
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao])
def dashboard_data(request):
    # ... (código existente)
    total_alunos = User.objects.filter(cargo='aluno').count()
    total_professores = User.objects.filter(cargo='professor').count()
    total_turmas = 0 
    evasao_percentual = 0 
    media_geral_escola = 0 

    data = {
        'total_alunos': total_alunos,
        'total_professores': total_professores,
        'total_turmas': total_turmas,
        'evasao_percentual': evasao_percentual,
        'media_geral_escola': media_geral_escola,
    }
    return Response(data)

# --- Autenticação ---
# ... (CustomAuthToken continua igual) ...
class CustomAuthToken(ObtainAuthToken):
    serializer_class = CustomAuthTokenSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        return Response({
            'token': token.key,
            'user': user_data 
        })