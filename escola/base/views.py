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
import os
import random
import string 
# --- NOVAS IMPORTAÇÕES ---
import random # Para gerar o código
from django.core.cache import cache # Para salvar o código temporariamente
from django.core.mail import send_mail
from rest_framework.authtoken.models import Token # Para logar o usuário
# --- FIM NOVAS IMPORTAÇÕES ---

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny # <-- AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import CustomAuthTokenSerializer, UserSerializer
from .forms import CustomUserCreationForm
from .permissions import IsCoordenacao

User = get_user_model()

# ... (home, registrar, UserViewSet, dashboard_data, CustomAuthToken continuam iguais) ...

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


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsCoordenacao]

    def get_queryset(self):
        queryset = User.objects.all().order_by('first_name')
        cargo = self.request.query_params.get('cargo')
        if cargo:
            queryset = queryset.filter(cargo=cargo)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        validated_data = serializer.validated_data
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            cargo=validated_data.get('cargo'),
            password=password
        )
        
        response_data = UserSerializer(user).data
        response_data['temp_password'] = password
        headers = self.get_success_headers(response_data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao])
def dashboard_data(request):
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

# --- FUNÇÃO DE "ESQUECI SENHA" ATUALIZADA ---

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    Recebe um e-mail, gera um CÓDIGO de 6 dígitos e o envia por e-mail.
    """
    email = request.data.get('email')
    if not email:
        return Response({'erro': 'E-mail é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email) # __iexact ignora maiúsculas
    except User.DoesNotExist:
        # Não revele que o usuário não existe.
        return Response({'sucesso': 'Se um usuário com este e-mail existir, um código foi enviado.'}, status=status.HTTP_200_OK)

    # 1. Gera um código de 6 dígitos
    code = str(random.randint(100000, 999999))
    
    # 2. Salva o código no cache do Django por 10 minutos
    # A chave do cache será "reset_code_EMAIL"
    cache.set(f"reset_code_{user.email}", code, timeout=600) # 600 segundos = 10 minutos

    # 3. Monta a mensagem do e-mail
    assunto = "Código de Recuperação - Secretaria Web"
    mensagem = (
        f"Olá {user.first_name or user.username},\n\n"
        f"Seu código de login de uso único é:\n\n"
        f"--- {code} ---\n\n"
        f"Este código expira em 10 minutos.\n"
        f"Se você não solicitou isso, por favor, ignore este e-mail.\n"
    )

    try:
        # 4. Envia o e-mail (usando o Gmail que configuramos)
        send_mail(
            assunto,
            mensagem,
            os.environ.get('EMAIL_HOST_USER'), # Remetente (do .env)
            [user.email], # Destinatário
            fail_silently=False,
        )
        return Response({'sucesso': 'Se um usuário com este e-mail existir, um código foi enviado.'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'erro': f'Erro ao enviar e-mail: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- NOVA API PARA LOGIN COM CÓDIGO ---

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_login(request):
    """
    Recebe um e-mail e um código.
    Se o código estiver correto, loga o usuário e retorna um token de login.
    """
    email = request.data.get('email')
    code = request.data.get('code')

    if not email or not code:
        return Response({'erro': 'E-mail e código são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({'erro': 'Código ou e-mail inválido.'}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Busca o código que salvamos no cache
    cached_code = cache.get(f"reset_code_{user.email}")

    if not cached_code:
        return Response({'erro': 'Código expirado. Por favor, tente novamente.'}, status=status.HTTP_400_BAD_REQUEST)

    if str(cached_code) != str(code):
        return Response({'erro': 'Código ou e-mail inválido.'}, status=status.HTTP_400_BAD_REQUEST)

    # 2. O código está correto! Vamos logar o usuário.
    # Deleta o código do cache para não ser usado de novo
    cache.delete(f"reset_code_{user.email}")

    # 3. Gera um novo Token de API para o frontend
    token, created = Token.objects.get_or_create(user=user)
    user_data = UserSerializer(user).data

    # 4. Retorna a mesma resposta que o login normal
    return Response({
        'token': token.key,
        'user': user_data 
    }, status=status.HTTP_200_OK)