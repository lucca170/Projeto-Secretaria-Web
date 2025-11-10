# Em: escola/biblioteca/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Livro, Emprestimo, Autor
from .serializers import LivroSerializer, EmprestimoSerializer, AutorSerializer
from escola.base.permissions import IsCoordenacao, IsAluno

class AutorViewSet(viewsets.ModelViewSet):
    # ... (código existente, sem alteração)
    queryset = Autor.objects.all().order_by('nome')
    serializer_class = AutorSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class LivroViewSet(viewsets.ModelViewSet):
    # ... (código existente, sem alteração)
    serializer_class = LivroSerializer
    
    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'cargo') or user.cargo in ['coordenador', 'administrador', 'diretor', 'ti']:
            return Livro.objects.all().order_by('titulo')
        return Livro.objects.filter(quantidade_disponivel__gt=0).order_by('titulo')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class EmprestimoViewSet(viewsets.ModelViewSet):
    # ... (código existente, sem alteração)
    serializer_class = EmprestimoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'aluno_profile'):
            return Emprestimo.objects.filter(aluno=user.aluno_profile)
        elif not hasattr(user, 'cargo') or user.cargo in ['coordenador', 'administrador', 'diretor', 'ti']:
            return Emprestimo.objects.all()
        return Emprestimo.objects.none()

    @action(detail=True, methods=['post'], permission_classes=[IsAluno])
    def emprestar(self, request, pk=None):
        """ Ação customizada para um aluno emprestar um livro (usando o ID do Livro) """
        
        # --- INÍCIO DA CORREÇÃO ---
        # Verificamos se o usuário tem o perfil 'aluno_profile'
        if not hasattr(request.user, 'aluno_profile'):
            return Response({'erro': 'Usuário não possui um perfil de aluno válido.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            livro = Livro.objects.get(pk=pk)
            aluno = request.user.aluno_profile # Agora isso é seguro
        except Livro.DoesNotExist:
            return Response({'erro': 'Livro não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        # O except AttributeError foi removido pois o 'hasattr' já cuida disso
        # --- FIM DA CORREÇÃO ---

        # Verifica se já há um empréstimo ativo deste livro para este aluno
        ja_emprestado = Emprestimo.objects.filter(livro=livro, aluno=aluno, data_devolucao_real__isnull=True).exists()
        if ja_emprestado:
            return Response({'erro': 'Você já pegou este livro emprestado.'}, status=status.HTTP_400_BAD_REQUEST)

        if livro.quantidade_disponivel > 0:
            livro.quantidade_disponivel -= 1
            livro.save()
            
            data_prevista = timezone.now().date() + timezone.timedelta(days=14)
            emprestimo = Emprestimo.objects.create(
                livro=livro,
                aluno=aluno,
                data_devolucao_prevista=data_prevista
            )
            serializer = self.get_serializer(emprestimo)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'erro': 'Livro não disponível no momento.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAluno])
    def devolver(self, request, pk=None):
        """ Ação customizada para um aluno devolver um livro (usando o ID do Empréstimo) """
        
        # --- INÍCIO DA CORREÇÃO ---
        if not hasattr(request.user, 'aluno_profile'):
            return Response({'erro': 'Usuário não possui um perfil de aluno válido.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # Agora isso é seguro
            emprestimo = Emprestimo.objects.get(pk=pk, aluno=request.user.aluno_profile)
        except Emprestimo.DoesNotExist:
            return Response({'erro': 'Empréstimo não encontrado ou não pertence a você.'}, status=status.HTTP_404_NOT_FOUND)
        # O except AttributeError foi removido
        # --- FIM DA CORREÇÃO ---

        if emprestimo.data_devolucao_real:
            return Response({'erro': 'Este livro já foi devolvido.'}, status=status.HTTP_400_BAD_REQUEST)

        emprestimo.data_devolucao_real = timezone.now().date()
        emprestimo.save()

        livro = emprestimo.livro
        livro.quantidade_disponivel += 1
        livro.save()
        
        serializer = self.get_serializer(emprestimo)
        return Response(serializer.data, status=status.HTTP_200_OK)