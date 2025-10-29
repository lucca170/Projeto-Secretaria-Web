# Exemplo em: escola/pedagogico/views.py
from rest_framework import viewsets, permissions
from .models import Nota # (Supondo que você tenha um model 'Nota')
from .serializers import NotaSerializer # (Supondo que você tenha um serializer)
from escola.base.permissions import IsProfessor, IsAluno # <-- IMPORTAR!
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..base.models import Turma, Aluno

@login_required
def adicionar_turma(request):
    if request.method == 'POST':
        # Implementar lógica de adicionar turma
        pass
    return render(request, 'pedagogico/adicionar_turma.html')

@login_required
def listar_turmas(request):
    turmas = Turma.objects.all()
    return render(request, 'pedagogico/listar_turmas.html', {'turmas': turmas})

class NotaViewSet(viewsets.ModelViewSet):
    """
    API para ver e editar Notas.
    """
    serializer_class = NotaSerializer
    
    def get_permissions(self):
        """
        Define as permissões com base na AÇÃO (GET, POST, PUT).
        """
        # Professores podem Criar, Atualizar, ou Deletar notas
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsProfessor]
        # Alunos E Professores podem Ver notas
        elif self.action in ['list', 'retrieve']:
            # A barra | significa "OU" (IsProfessor OU IsAluno)
            permission_classes = [permissions.IsAuthenticated, (IsProfessor | IsAluno)]
        # Para outras ações, apenas estar logado
        else:
            permission_classes = [permissions.IsAuthenticated]
            
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filtra os dados que o usuário pode ver.
        """
        user = self.request.user

        if user.tipo_usuario == 'aluno':
            # ALUNO: só pode ver as PRÓPRIAS notas
            return Nota.objects.filter(aluno=user)
        
        if user.tipo_usuario == 'professor':
            # PROFESSOR: vê as notas dos seus alunos (lógica de exemplo)
            # (Aqui você filtraria pelas turmas do professor, etc)
            return Nota.objects.filter(turma__professor=user)

        # Coordenação/Admin: vê tudo
        return Nota.objects.all()