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
# VIEWSETS (JÁ ESTAVAM CORRETOS, SEM MUDANÇAS)
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
    # ... (código existente, sem alteração)
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
        # ... (lógica de queryset existente, sem alteração)
        user = self.request.user
        if not hasattr(user, 'tipo_usuario'):
            if user.is_superuser:
                return Nota.objects.all()
            return Nota.objects.none()
        if user.tipo_usuario == 'aluno':
            if hasattr(user, 'aluno_profile'):
                return Nota.objects.filter(aluno=user.aluno_profile)
            else:
                return Nota.objects.none() 
        if user.tipo_usuario == 'professor':
            return Nota.objects.filter(disciplina__professor=user)
        if user.tipo_usuario in ['coordenacao', 'admin'] or user.is_superuser:
            return Nota.objects.all()
        return Nota.objects.none()


# ===================================================================
# VIEWS DE FUNÇÃO (CONVERTIDAS PARA API)
# ===================================================================

# --- ALTERADO ---
# Esta view retornava HTML. Agora ela cria uma Turma via API.
# NOTA: Esta view é redundante, pois o 'TurmaViewSet' já faz isso.
@api_view(['POST']) 
@permission_classes([IsAuthenticated, IsCoordenacao]) # Protegido
def adicionar_turma(request):
    """
    Cria uma nova turma.
    """
    serializer = TurmaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- ALTERADO ---
# Esta view retornava HTML. Agora retorna JSON.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_turmas(request):
    """
    Lista todas as turmas (Endpoint simples, o ViewSet é mais completo).
    """
    turmas = Turma.objects.all()
    # Usa o serializer que já deve existir
    serializer = TurmaSerializer(turmas, many=True) 
    return Response(serializer.data)


# --- NOVAS VIEWS DE RELATÓRIO E AGENDA (CONVERTIDAS) ---

# --- ALTERADO ---
# Trocado JsonResponse por Response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_desempenho_aluno(request, aluno_id):
    """
    Gera relatório com notas, faltas e evolução do aluno.
    Retorna JSON.
    """
    aluno = get_object_or_404(Aluno, id=aluno_id)

    # Lógica de permissão (exemplo): Aluno só vê o seu, Coordenador vê todos
    if (request.user.tipo_usuario == 'aluno' and 
        not (hasattr(request.user, 'aluno_profile') and request.user.aluno_profile.id == aluno.id)):
        return Response({'erro': 'Acesso negado.'}, status=status.HTTP_403_FORBIDDEN)
    
    # (Adicionar lógica para professor)
    
    elif request.user.tipo_usuario not in ['coordenacao', 'admin'] and request.user.tipo_usuario != 'aluno':
         # (Se não for aluno vendo o seu, nem coordenação)
         pass # (Permite por enquanto, mas idealmente teria mais regras)


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

# --- ALTERADO ---
# Esta view retornava HTML. Agora retorna JSON.
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao]) # Protegido
def relatorio_geral_faltas(request):
    """
    Gerar relatórios de faltas. Retorna JSON.
    """
    relatorio_faltas = Falta.objects.values('aluno__usuario__username', 'disciplina__nome') \
                                   .annotate(total_faltas=Count('id')) \
                                   .order_by('aluno__usuario__username')
    
    # O QuerySet já é uma lista de dicionários, pode ser retornado diretamente
    return Response(list(relatorio_faltas))

# --- ALTERADO ---
# Esta view não tinha NENHUM decorador (falha de segurança).
# Também retornava HTML. Agora está protegida e retorna JSON.
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao]) # Protegido
def relatorio_gerencial(request):
    """
    Análise de eficiência: Taxa de aprovação e Taxa de evasão.
    Retorna JSON.
    """
    turmas = Turma.objects.all()
    dados_turmas = []

    for turma in turmas:
        # 1. Taxa de Evasão
        total_alunos_considerados = Aluno.objects.filter(turma=turma, status__in=['ativo', 'evadido', 'transferido', 'concluido']).count()
        evadidos_turma = Aluno.objects.filter(turma=turma, status='evadido').count()
        
        taxa_evasao = 0
        if total_alunos_considerados > 0:
            taxa_evasao = (evadidos_turma / total_alunos_considerados) * 100

        # 2. Taxa de Aprovação (Ex: Média final >= 6.0)
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
            # --- ALTERADO: Serializa a turma para JSON ---
            'turma': TurmaSerializer(turma).data, 
            'taxa_evasao': f"{taxa_evasao:.2f}%",
            'taxa_aprovacao': f"{taxa_aprovacao:.2f}%",
        })

    return Response(dados_turmas) # --- Usando Response do DRF

# --- ALTERADO ---
# Trocado JsonResponse por Response
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

    return Response(eventos_formatados) # --- Usando Response do DRF

# --- ALTERADO ---
# Esta view retornava HTML. Agora retorna JSON.
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsProfessor]) # Apenas professor
def planos_de_aula_professor(request):
    """
    Agenda de Professores e planejamento semanal de aula.
    (Assume que o usuário logado é um professor).
    Retorna JSON.
    """
    try:
        # Filtra as disciplinas que o usuário logado (professor) leciona
        disciplinas_professor = Disciplina.objects.filter(professor=request.user)
        planos = PlanoDeAula.objects.filter(disciplina__in=disciplinas_professor).order_by('data')
    except (Disciplina.DoesNotExist, TypeError, AttributeError):
        # Lida com casos onde o usuário não é professor ou não tem disciplina
        return Response(
            {'erro': 'Usuário não é professor ou não possui disciplinas.'}, 
            status=status.HTTP_403_FORBIDDEN
        )

    # --- Você DEVE criar estes serializers ---
    planos_data = PlanoDeAulaSerializer(planos, many=True).data
    disciplinas_data = DisciplinaSerializer(disciplinas_professor, many=True).data

    context = {
        'planos_de_aula': planos_data,
        'disciplinas': disciplinas_data
    }
    return Response(context) # --- Usando Response do DRF

# --- SEM MUDANÇAS ---
# Esta view retorna um PDF, o que está correto.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_boletim_pdf(request, aluno_id):
    """
    Gera um PDF completo do Histórico Acadêmico do aluno.
    """
    if not weasyprint:
        return HttpResponse("Erro: Biblioteca WeasyPrint não encontrada. Instale-a com 'pip install weasyprint'", status=500)
        
    # 1. Buscar todos os dados do aluno
    aluno = get_object_or_404(Aluno, id=aluno_id)
    
    # (Adicionar lógica de permissão aqui, ex: aluno só pode baixar o próprio)

    # Dados Pedagógicos
    notas_disciplinas = Nota.objects.filter(aluno=aluno) \
                                   .values('disciplina__nome') \
                                   .annotate(media=Avg('valor')) \
                                   .order_by('disciplina__nome')
                                   
    total_faltas = Falta.objects.filter(aluno=aluno).count()
    
    # Dados Disciplinares (importados do app disciplinar)
    advertencias = Advertencia.objects.filter(aluno=aluno).order_by('-data')
    suspensoes = Suspensao.objects.filter(aluno=aluno).order_by('-data_inicio')

    # 2. Definir o contexto para o template
    context = {
        'aluno': aluno,
        'notas_disciplinas': notas_disciplinas,
        'total_faltas': total_faltas,
        'advertencias': advertencias,
        'suspensoes': suspensoes,
    }

    # 3. Renderizar o template HTML para uma string
    html_string = render_to_string('pedagogico/boletim_pdf.html', context)

    # 4. Gerar o PDF usando WeasyPrint
    try:
        html = weasyprint.HTML(string=html_string)
        pdf = html.write_pdf()

        # 5. Criar a Resposta HTTP
        response = HttpResponse(pdf, content_type='application/pdf')
        filename = f"boletim_{aluno.usuario.username}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except Exception as e:
        return HttpResponse(f"Erro ao gerar o PDF: {e}", status=500)

# --- VIEWS DE INSCRIÇÃO EM EVENTOS (ALTERADAS) ---

# --- ALTERADO ---
# Trocado JsonResponse por Response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_eventos_extracurriculares(request):
    """
    Lista todos os eventos com vagas disponíveis.
    Retorna JSON.
    """
    eventos_qs = EventoExtracurricular.objects.filter(
        data__gte=datetime.date.today(),
        vagas__gt=0
    ).annotate(
        num_participantes=Count('participantes')
    ).filter(vagas__gt=F('num_participantes'))

    eventos_inscritos_ids = []
    if hasattr(request.user, 'aluno_profile'):
        eventos_inscritos_ids = request.user.aluno_profile.eventoextracurricular_set.values_list('id', flat=True)

    # --- Usa o serializer para garantir consistência ---
    eventos_data = EventoExtracurricularSerializer(eventos_qs, many=True).data

    context = {
        'eventos': eventos_data,
        'eventos_inscritos_ids': list(eventos_inscritos_ids)
    }
    return Response(context) # --- Usando Response do DRF

# --- ALTERADO ---
# Trocado JsonResponse por Response e usando status do DRF
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def inscrever_evento(request, evento_id):
    """
    Processa a inscrição (ou desinscrição) de um aluno em um evento.
    Retorna JSON.
    """
    if not hasattr(request.user, 'aluno_profile'):
        return Response(
            {'message': 'Usuário não é um aluno'}, 
            status=status.HTTP_403_FORBIDDEN
        )

    evento = get_object_or_404(EventoExtracurricular, id=evento_id)
    aluno = request.user.aluno_profile

    status_message = ''
    inscrito = False

    if aluno in evento.participantes.all():
        evento.participantes.remove(aluno)
        status_message = 'Inscrição cancelada'
        inscrito = False
    else:
        num_participantes = evento.participantes.count()
        if num_participantes < evento.vagas:
            evento.participantes.add(aluno)
            status_message = 'Inscrito com sucesso'
            inscrito = True
        else:
            return Response(
                {'message': 'Não há mais vagas'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    return Response(
        {'message': status_message, 'inscrito': inscrito}, 
        status=status.HTTP_200_OK
    )