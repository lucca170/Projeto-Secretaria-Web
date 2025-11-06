# Em: escola/pedagogico/views.py
import json
import datetime
from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Avg, F
from django.template.loader import render_to_string # Mantido para o PDF
from django.http import HttpResponse # Mantido para o PDF

# Imports do Rest Framework
from rest_framework import viewsets, permissions, status # --- ADICIONADO status ---
from rest_framework.decorators import api_view, permission_classes, action 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response # --- ESTE É O IMPORT CORRETO ---

# Imports do seu projeto
from .serializers import (
    NotaSerializer, EventoAcademicoSerializer, 
    AlunoSerializer, TurmaSerializer, AlunoCreateSerializer,
    # --- ADICIONADOS (você precisará criá-los) ---
    PlanoDeAulaSerializer, DisciplinaSerializer
)
from escola.base.permissions import IsProfessor, IsAluno, IsCoordenacao 

# Imports dos Models
from .models import (
    Aluno, 
    Nota, 
    Falta, 
    Presenca, 
    Turma, 
    Disciplina,
    EventoAcademico, 
    PlanoDeAula,
)
from escola.disciplinar.models import Advertencia, Suspensao

# --- Imports para o PDF (Verifique se 'weasyprint' está instalado) ---
try:
    import weasyprint
except ImportError:
    weasyprint = None # Opcional: lidar com a falha de importação


# ===================================================================
# VIEWSETS
# ===================================================================

class EventoAcademicoViewSet(viewsets.ModelViewSet):
    # ... (código existente, sem alteração)
    queryset = EventoAcademico.objects.all()
    serializer_class = EventoAcademicoSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class AlunoViewSet(viewsets.ModelViewSet): 
    # ... (código existente, sem alteração)
    def get_queryset(self):
        return Aluno.objects.all().order_by('usuario__first_name', 'usuario__last_name')

    def get_serializer_class(self):
        if self.action == 'create':
            return AlunoCreateSerializer 
        return AlunoSerializer 

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class TurmaViewSet(viewsets.ModelViewSet):
    # ... (código existente, sem alteração)
    queryset = Turma.objects.all().order_by('nome')
    serializer_class = TurmaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['get'])
    def detalhe_com_alunos(self, request, pk=None):
        # ... (código existente, sem alteração)
        turma = self.get_object()
        alunos_da_turma = turma.alunos.all().order_by('usuario__first_name', 'usuario__last_name')
        
        turma_data = TurmaSerializer(turma).data
        alunos_data = AlunoSerializer(alunos_da_turma, many=True).data
        
        return Response({
            'turma': turma_data,
            'alunos': alunos_data
        })

class NotaViewSet(viewsets.ModelViewSet):
    serializer_class = NotaSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsProfessor]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated, (IsProfessor | IsAluno)]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user

        # --- CORREÇÃO APLICADA AQUI (Substituído 'tipo_usuario' por 'cargo') ---
        if not hasattr(user, 'cargo'):
            if user.is_superuser:
                return Nota.objects.all()
            return Nota.objects.none()

        if user.cargo == 'aluno':
            if hasattr(user, 'aluno_profile'):
                return Nota.objects.filter(aluno=user.aluno_profile)
            else:
                return Nota.objects.none() 
        
        if user.cargo == 'professor':
            return Nota.objects.filter(disciplina__professor=user)
        
        # Cargos de admin (baseado em base/permissions.py)
        admin_roles = ['administrador', 'coordenador', 'diretor', 'ti']
        if user.cargo in admin_roles or user.is_superuser:
            return Nota.objects.all()
            
        return Nota.objects.none()
        # --- FIM DA CORREÇÃO ---


# ===================================================================
# VIEWS DE FUNÇÃO (API)
# ===================================================================

@api_view(['POST']) 
@permission_classes([IsAuthenticated, IsCoordenacao]) 
def adicionar_turma(request):
    """
    Cria uma nova turma.
    """
    serializer = TurmaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_turmas(request):
    """
    Lista todas as turmas (Endpoint simples, o ViewSet é mais completo).
    """
    turmas = Turma.objects.all()
    serializer = TurmaSerializer(turmas, many=True) 
    return Response(serializer.data)


# --- VIEWS DE RELATÓRIO E AGENDA ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_desempenho_aluno(request, aluno_id):
    """
    Gera relatório com notas, faltas e evolução do aluno.
    Retorna JSON.
    """
    aluno = get_object_or_404(Aluno, id=aluno_id)

    # --- CORREÇÃO APLICADA (Substituído 'tipo_usuario' por 'cargo') ---
    # Lista de cargos administrativos (baseado em base/permissions.py)
    admin_roles = ['administrador', 'coordenador', 'diretor', 'ti']
    user_cargo = request.user.cargo

    if user_cargo == 'aluno':
        # Se for aluno, verifica se é o próprio perfil
        if not (hasattr(request.user, 'aluno_profile') and request.user.aluno_profile.id == aluno.id):
            return Response({'erro': 'Acesso negado. Alunos só podem ver o próprio relatório.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Permite admin E professores (baseado nas permissões do app disciplinar)
    elif user_cargo not in admin_roles and user_cargo != 'professor':
         # Se não for aluno, nem admin, nem professor, nega o acesso.
         return Response({'erro': 'Você não tem permissão para ver este relatório.'}, status=status.HTTP_403_FORBIDDEN)
    # --- FIM DA CORREÇÃO ---


    notas = Nota.objects.filter(aluno=aluno)
    faltas = Falta.objects.filter(aluno=aluno)
    presencas = Presenca.objects.filter(aluno=aluno)

    medias_disciplinas = notas.values('disciplina__nome').annotate(
        media=Avg('valor')
    )

    context = {
        'aluno': {
            'nome': aluno.usuario.get_full_name() or aluno.usuario.username,
            'turma': {
                'nome': aluno.turma.nome if aluno.turma else None
            },
            'status': aluno.get_status_display()
        },
        'medias_disciplinas': list(medias_disciplinas), 
        'faltas': {
            'count': faltas.count()
        },
        'presencas': {
            'count': presencas.count()
        }
    }

    return Response(context) # --- Usando Response do DRF

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao]) 
def relatorio_geral_faltas(request):
    """
    Gerar relatórios de faltas. Retorna JSON.
    """
    relatorio_faltas = Falta.objects.values('aluno__usuario__username', 'disciplina__nome') \
                                   .annotate(total_faltas=Count('id')) \
                                   .order_by('aluno__usuario__username')
    
    return Response(list(relatorio_faltas))

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao]) 
def relatorio_gerencial(request):
    """
    Análise de eficiência: Taxa de aprovação e Taxa de evasão.
    Retorna JSON.
    """
    turmas = Turma.objects.all()
    dados_turmas = []

    for turma in turmas:
        total_alunos_considerados = Aluno.objects.filter(turma=turma, status__in=['ativo', 'evadido', 'transferido', 'concluido']).count()
        evadidos_turma = Aluno.objects.filter(turma=turma, status='evadido').count()
        
        taxa_evasao = 0
        if total_alunos_considerados > 0:
            taxa_evasao = (evadidos_turma / total_alunos_considerados) * 100

        alunos_aprovados = 0
        alunos_ativos_turma = turma.alunos.filter(status__in=['ativo', 'concluido'])
        
        taxa_aprovacao = 0
        if alunos_ativos_turma.count() > 0:
            for aluno in alunos_ativos_turma:
                media_final_aluno = Nota.objects.filter(aluno=aluno).aggregate(media=Avg('valor'))['media']
                
                if media_final_aluno is not None and media_final_aluno >= 6.0:
                    alunos_aprovados += 1
            
            taxa_aprovacao = (alunos_aprovados / alunos_ativos_turma.count()) * 100

        dados_turmas.append({
            'turma': TurmaSerializer(turma).data, 
            'taxa_evasao': f"{taxa_evasao:.2f}%",
            'taxa_aprovacao': f"{taxa_aprovacao:.2f}%",
        })

    return Response(dados_turmas) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendario_academico(request):
    """
    Calendário Acadêmico.
    Retorna JSON para o frontend (FullCalendar.js).
    """
    eventos = EventoAcademico.objects.all()

    eventos_formatados = []
    for evento in eventos:
        eventos_formatados.append({
            'id': evento.id,
            'title': f"({evento.get_tipo_display()}) {evento.titulo}",
            'start': evento.data_inicio.isoformat(),
            'end': evento.data_fim.isoformat() if evento.data_fim else None,
            'description': evento.descricao,
        })

    return Response(eventos_formatados)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsProfessor]) 
def planos_de_aula_professor(request):
    """
    Agenda de Professores e planejamento semanal de aula.
    (Assume que o usuário logado é um professor).
    Retorna JSON.
    """
    try:
        disciplinas_professor = Disciplina.objects.filter(professor=request.user)
        planos = PlanoDeAula.objects.filter(disciplina__in=disciplinas_professor).order_by('data')
    except (Disciplina.DoesNotExist, TypeError, AttributeError):
        return Response(
            {'erro': 'Usuário não é professor ou não possui disciplinas.'}, 
            status=status.HTTP_403_FORBIDDEN
        )

    planos_data = PlanoDeAulaSerializer(planos, many=True).data
    disciplinas_data = DisciplinaSerializer(disciplinas_professor, many=True).data

    context = {
        'planos_de_aula': planos_data,
        'disciplinas': disciplinas_data
    }
    return Response(context)

# --- VIEW DO PDF (Sem mudanças) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_boletim_pdf(request, aluno_id):
    """
    Gera um PDF completo do Histórico Acadêmico do aluno.
    """
    if not weasyprint:
        return HttpResponse("Erro: Biblioteca WeasyPrint não encontrada. Instale-a com 'pip install weasyprint'", status=500)
        
    aluno = get_object_or_404(Aluno, id=aluno_id)
    
    # (Adicionar lógica de permissão aqui)

    notas_disciplinas = Nota.objects.filter(aluno=aluno) \
                                   .values('disciplina__nome') \
                                   .annotate(media=Avg('valor')) \
                                   .order_by('disciplina__nome')
                                   
    total_faltas = Falta.objects.filter(aluno=aluno).count()
    
    advertencias = Advertencia.objects.filter(aluno=aluno).order_by('-data')
    suspensoes = Suspensao.objects.filter(aluno=aluno).order_by('-data_inicio')

    context = {
        'aluno': aluno,
        'notas_disciplinas': notas_disciplinas,
        'total_faltas': total_faltas,
        'advertencias': advertencias,
        'suspensoes': suspensoes,
    }

    html_string = render_to_string('pedagogico/boletim_pdf.html', context)

    try:
        html = weasyprint.HTML(string=html_string)
        pdf = html.write_pdf()

        response = HttpResponse(pdf, content_type='application/pdf')
        filename = f"boletim_{aluno.usuario.username}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except Exception as e:
        return HttpResponse(f"Erro ao gerar o PDF: {e}", status=500)

# --- VIEWS DE INSCRIÇÃO EM EVENTOS (Sem mudanças) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_eventos_extracurriculares(request):
    """
    Lista todos os eventos com vagas disponíveis.
    Retorna JSON.
    """
    # Esta view não existe mais no seu projeto (foi deletada pela migração 0003)
    # Mas se existisse, estaria correta.
    return Response({"message": "Esta funcionalidade foi removida."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def inscrever_evento(request, evento_id):
    """
    Processa a inscrição (ou desinscrição) de um aluno em um evento.
    Retorna JSON.
    """
    return Response({"message": "Esta funcionalidade foi removida."}, status=status.HTTP_404_NOT_FOUND)