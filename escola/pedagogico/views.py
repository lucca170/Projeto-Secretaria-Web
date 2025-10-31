import json
import datetime
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required  
from django.db.models import Count, Avg, F
from django.http import HttpResponse, JsonResponse

# Imports do Rest Framework
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response 

# Imports do seu projeto
from .serializers import NotaSerializer, EventoAcademicoSerializer, AlunoSerializer, TurmaSerializer
# --- IsCoordenacao já estava importado ---
from escola.base.permissions import IsProfessor, IsAluno, IsCoordenacao 

# --- Imports dos Models ---
from .models import (
    Aluno, 
    Nota, 
    Falta, 
    Presenca, 
    Turma, 
    Disciplina,
    EventoAcademico, 
    PlanoDeAula,
    EventoExtracurricular,
)
from escola.disciplinar.models import Advertencia, Suspensao

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

# --- ALTERAR O ALUNOVIEWSET ---
# Mudar de ReadOnlyModelViewSet para ModelViewSet
class AlunoViewSet(viewsets.ModelViewSet): 
    """
    API para listar, ver, criar e editar Alunos.
    A criação/edição é restrita à Coordenação.
    """
    serializer_class = AlunoSerializer
    
    # get_queryset permanece o mesmo
    def get_queryset(self):
        return Aluno.objects.all().order_by('usuario__first_name', 'usuario__last_name')

    # ADICIONAR ESTA FUNÇÃO
    def get_permissions(self):
        """ Restringe escrita para cargos superiores. """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Apenas Admin, Coordenador, Diretor, TI
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else:
            # Todos logados (list, retrieve)
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

# --- ALTERAR O TURMAVIEWSET ---
# Mudar de ReadOnlyModelViewSet para ModelViewSet
class TurmaViewSet(viewsets.ModelViewSet):
    """
    API para listar, ver, criar e editar Turmas.
    A criação/edição é restrita à Coordenação.
    """
    queryset = Turma.objects.all().order_by('nome')
    serializer_class = TurmaSerializer

    # ADICIONAR ESTA FUNÇÃO
    def get_permissions(self):
        """ Restringe escrita para cargos superiores. """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Apenas Admin, Coordenador, Diretor, TI
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else:
            # Todos logados (list, retrieve)
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # A @action customizada permanece a mesma
    @action(detail=True, methods=['get'])
    def detalhe_com_alunos(self, request, pk=None):
        turma = self.get_object()
        alunos_da_turma = turma.alunos.all().order_by('usuario__first_name', 'usuario__last_name')
        
        turma_data = TurmaSerializer(turma).data
        alunos_data = AlunoSerializer(alunos_da_turma, many=True).data
        
        return Response({
            'turma': turma_data,
            'alunos': alunos_data
        })


# --- Views de Template (as que você já tinha) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def adicionar_turma(request):
    if request.method == 'POST':
        # Implementar lógica de adicionar turma
        pass
    return render(request, 'pedagogico/adicionar_turma.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_turmas(request):
    turmas = Turma.objects.all()
    return render(request, 'pedagogico/listar_turmas.html', {'turmas': turmas})

# --- ViewSet de API (a que você já tinha, com correções) ---

class NotaViewSet(viewsets.ModelViewSet):
    """
    API para ver e editar Notas.
    """
    serializer_class = NotaSerializer
    
    def get_permissions(self):
        """
        Define as permissões com base na AÇÃO (GET, POST, PUT).
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsProfessor]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated, (IsProfessor | IsAluno)]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filtra os dados que o usuário pode ver.
        [VERSÃO CORRIGIDA]
        """
        user = self.request.user

        # Se o usuário não tiver o campo 'tipo_usuario' (ex: admin padrão)
        if not hasattr(user, 'tipo_usuario'):
            if user.is_superuser:
                return Nota.objects.all()
            return Nota.objects.none() # Nega acesso se não for superusuário

        # Lógica baseada no seu 'tipo_usuario'
        if user.tipo_usuario == 'aluno':
            # ALUNO: só pode ver as PRÓPRIAS notas
            # (Assume que 'aluno_profile' é o related_name do seu model Aluno)
            if hasattr(user, 'aluno_profile'):
                return Nota.objects.filter(aluno=user.aluno_profile)
            else:
                return Nota.objects.none() # É usuário aluno, mas não tem perfil Aluno
        
        if user.tipo_usuario == 'professor':
            # PROFESSOR: vê as notas das suas disciplinas
            # (Baseado em pedagogico/models.py: Disciplina.professor -> User)
            return Nota.objects.filter(disciplina__professor=user)

        # Coordenação/Admin (se tiverem tipo_usuario 'coordenacao' ou 'admin')
        if user.tipo_usuario in ['coordenacao', 'admin'] or user.is_superuser:
            return Nota.objects.all()

        # Nega por padrão
        return Nota.objects.none()


# --- NOVAS VIEWS DE RELATÓRIO E AGENDA (adicionadas) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_desempenho_aluno(request, aluno_id):
    """
    Implementa: 'Adicionar gráficos e relatórios de desempenho por aluno'
    Gera relatório com notas, faltas e evolução do aluno.
    [AGORA RETORNA JSON]
    """
    aluno = get_object_or_404(Aluno, id=aluno_id)

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
                'nome': aluno.turma.nome
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

    return JsonResponse(context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_geral_faltas(request):
    """
    Implementa: 'Gerar relatórios de faltas.'
    """
    # Agrupa faltas por aluno e disciplina
    relatorio_faltas = Falta.objects.values('aluno__usuario__username', 'disciplina__nome') \
                                  .annotate(total_faltas=Count('id')) \
                                  .order_by('aluno__usuario__username')
    
    context = {
        'relatorio_faltas': relatorio_faltas
    }
    # Template: 'pedagogico/relatorio_faltas.html'
    return render(request, 'pedagogico/relatorio_faltas.html', context)

def relatorio_gerencial(request):
    """
    Implementa: 'Análise de eficiência: Taxa de aprovação e Taxa de evasão'
    """
    turmas = Turma.objects.all()
    dados_turmas = []

    for turma in turmas:
        # 1. Taxa de Evasão
        # (Alunos que deveriam estar cursando = ativos, evadidos, transferidos)
        total_alunos_considerados = Aluno.objects.filter(turma=turma, status__in=['ativo', 'evadido', 'transferido', 'concluido']).count()
        evadidos_turma = Aluno.objects.filter(turma=turma, status='evadido').count()
        
        taxa_evasao = 0
        if total_alunos_considerados > 0:
            taxa_evasao = (evadidos_turma / total_alunos_considerados) * 100

        # 2. Taxa de Aprovação (Ex: Média final >= 6.0)
        alunos_aprovados = 0
        # (Alunos que de fato concluíram o período = ativos ou concluídos)
        alunos_ativos_turma = turma.alunos.filter(status__in=['ativo', 'concluido'])
        
        taxa_aprovacao = 0
        if alunos_ativos_turma.count() > 0:
            for aluno in alunos_ativos_turma:
                media_final_aluno = Nota.objects.filter(aluno=aluno).aggregate(media=Avg('valor'))['media']
                
                if media_final_aluno is not None and media_final_aluno >= 6.0:
                    alunos_aprovados += 1
            
            taxa_aprovacao = (alunos_aprovados / alunos_ativos_turma.count()) * 100

        dados_turmas.append({
            'turma': turma,
            'taxa_evasao': f"{taxa_evasao:.2f}%",
            'taxa_aprovacao': f"{taxa_aprovacao:.2f}%",
        })

    context = {
        'dados_turmas': dados_turmas
    }
    # Template: 'pedagogico/relatorio_gerencial.html'
    return render(request, 'pedagogico/relatorio_gerencial.html', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendario_academico(request):
    """
    Implementa: 'Calendário Acadêmico'
    Retorna JSON para o frontend (FullCalendar.js).
    """
    eventos = EventoAcademico.objects.all()

    eventos_formatados = []
    for evento in eventos:
        eventos_formatados.append({
            'id': evento.id, # <--- ADICIONE ESTA LINHA
            'title': f"({evento.get_tipo_display()}) {evento.titulo}",
            'start': evento.data_inicio.isoformat(),
            'end': evento.data_fim.isoformat() if evento.data_fim else None,
            'description': evento.descricao,
        })

    return JsonResponse(eventos_formatados, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def planos_de_aula_professor(request):
    """
    Implementa: 'Agenda de Professores' e 'planejamento semanal de aula'
    (Assume que o usuário logado é um professor)
    """
    try:
        # Filtra as disciplinas que o usuário logado (professor) leciona
        disciplinas_professor = Disciplina.objects.filter(professor=request.user)
        planos = PlanoDeAula.objects.filter(disciplina__in=disciplinas_professor).order_by('data')
    except (Disciplina.DoesNotExist, TypeError, AttributeError):
        # Lida com casos onde o usuário não é professor ou não tem disciplina
        disciplinas_professor = None
        planos = None

    context = {
        'planos_de_aula': planos,
        'disciplinas': disciplinas_professor
        # (Aqui você adicionaria um formulário para criar novos PlanosDeAula)
    }
    # Template: 'pedagogico/agenda_professor.html'
    return render(request, 'pedagogico/agenda_professor.html', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_boletim_pdf(request, aluno_id):
    """
    Implementa: 'Permitir que alunos... possam baixar um relatório'
    Gera um PDF completo do Histórico Acadêmico do aluno.
    """
    # 1. Buscar todos os dados do aluno
    aluno = get_object_or_404(Aluno, id=aluno_id)
    
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
    # (Vamos criar este template no próximo passo)
    html_string = render_to_string('pedagogico/boletim_pdf.html', context)

    # 4. Gerar o PDF usando WeasyPrint
    try:
        html = weasyprint.HTML(string=html_string)
        pdf = html.write_pdf()

        # 5. Criar a Resposta HTTP
        response = HttpResponse(pdf, content_type='application/pdf')
        
        # Define o nome do arquivo para download
        filename = f"boletim_{aluno.usuario.username}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except Exception as e:
        # Lidar com erros (ex: WeasyPrint não instalado corretamente)
        return HttpResponse(f"Erro ao gerar o PDF: {e}", status=500)

# --- VIEWS DE INSCRIÇÃO EM EVENTOS (ADICIONADAS) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_eventos_extracurriculares(request):
    """
    Implementa: 'Calendário de eventos... onde os alunos possam se inscrever'
    Lista todos os eventos com vagas disponíveis.
    [AGORA RETORNA JSON]
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

    eventos_list = []
    for evento in eventos_qs:
        eventos_list.append({
            'id': evento.id,
            'nome': evento.nome,
            'descricao': evento.descricao,
            'data': evento.data.isoformat(),
            'vagas': evento.vagas,
            'num_participantes': evento.num_participantes
        })

    context = {
        'eventos': eventos_list,
        'eventos_inscritos_ids': list(eventos_inscritos_ids)
    }
    return JsonResponse(context)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def inscrever_evento(request, evento_id):
    """
    Processa a inscrição (ou desinscrição) de um aluno em um evento.
    [AGORA RETORNA JSON]
    """
    if not hasattr(request.user, 'aluno_profile'):
        return JsonResponse({'status': 'error', 'message': 'Usuário não é um aluno'}, status=403)

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
            return JsonResponse({'status': 'error', 'message': 'Não há mais vagas'}, status=400)

    return JsonResponse({'status': 'success', 'message': status_message, 'inscrito': inscrito})