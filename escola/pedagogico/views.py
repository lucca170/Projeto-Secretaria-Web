import json
import datetime
from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Avg, F
from django.template.loader import render_to_string 
from django.http import HttpResponse 
from django.db import transaction # <-- 1. IMPORTE O 'transaction'

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response 

from .serializers import (
    NotaSerializer, EventoAcademicoSerializer, 
    AlunoSerializer, TurmaSerializer, AlunoCreateSerializer,
    PlanoDeAulaSerializer, DisciplinaSerializer,
    NotaCreateUpdateSerializer,
    MateriaSerializer,
    FaltaSerializer # <-- 2. IMPORTE O 'FaltaSerializer'
)
from escola.base.permissions import IsProfessor, IsAluno, IsCoordenacao 

from .models import (
    Aluno, 
    Nota, 
    Falta, 
    Presenca, 
    Turma, 
    Disciplina,
    EventoAcademico, 
    PlanoDeAula,
    Materia # <-- 'Falta' e 'Presenca' já estavam aqui
)
from escola.disciplinar.models import Advertencia, Suspensao

try:
    import weasyprint
except ImportError:
    weasyprint = None 

# ===================================================================
# VIEWSETS
# ===================================================================

class MateriaViewSet(viewsets.ModelViewSet):
    """
    API para Matérias (ex: Matemática, Português).
    """
    queryset = Materia.objects.all().order_by('nome')
    serializer_class = MateriaSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else: 
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class DisciplinaViewSet(viewsets.ModelViewSet):
    """
    API para Disciplinas.
    Professores podem ver apenas suas próprias disciplinas.
    Coordenação pode ver todas.
    """
    serializer_class = DisciplinaSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Disciplina.objects.all().order_by('materia__nome') 

        turma_id = self.request.query_params.get('turma_id')
        if turma_id:
            queryset = queryset.filter(turma_id=turma_id)

        if not hasattr(user, 'cargo'):
            return Disciplina.objects.none()

        if user.cargo == 'professor':
            queryset = queryset.filter(professores=user) 
        
        admin_roles = ['administrador', 'coordenador', 'diretor', 'ti']
        if user.cargo in admin_roles or user.is_superuser:
            return queryset 
            
        if user.cargo == 'aluno': 
            if hasattr(user, 'aluno_profile'):
                return queryset.filter(turma=user.aluno_profile.turma)

        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class EventoAcademicoViewSet(viewsets.ModelViewSet):
    queryset = EventoAcademico.objects.all()
    serializer_class = EventoAcademicoSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCoordenacao]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class AlunoViewSet(viewsets.ModelViewSet): 
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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        read_serializer = AlunoSerializer(instance, context={'request': request})
        response_data = read_serializer.data
        
        if hasattr(instance, 'temp_password'):
            response_data['temp_password'] = instance.temp_password
            
        headers = self.get_success_headers(response_data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

class TurmaViewSet(viewsets.ModelViewSet):
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
        turma = self.get_object()
        alunos_da_turma = Aluno.objects.filter(
            turma=turma, 
            status='ativo'
        ).order_by('usuario__first_name', 'usuario__last_name')
        
        turma_data = TurmaSerializer(turma).data
        alunos_data = AlunoSerializer(alunos_da_turma, many=True).data
        
        return Response({
            'turma': turma_data,
            'alunos': alunos_data
        })

class NotaViewSet(viewsets.ModelViewSet):
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return NotaCreateUpdateSerializer
        return NotaSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'bulk_update_notas']:
            permission_classes = [permissions.IsAuthenticated, (IsProfessor | IsCoordenacao)]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        queryset = Nota.objects.all()

        if not hasattr(user, 'cargo'):
            return Nota.objects.none()

        disciplina_id = self.request.query_params.get('disciplina_id')
        aluno_id = self.request.query_params.get('aluno_id')

        if disciplina_id:
            queryset = queryset.filter(disciplina_id=disciplina_id)
        if aluno_id:
             queryset = queryset.filter(aluno_id=aluno_id)

        if user.cargo == 'aluno':
            if hasattr(user, 'aluno_profile'):
                return queryset.filter(aluno=user.aluno_profile)
            else:
                return Nota.objects.none() 
        
        if user.cargo == 'professor':
            return queryset.filter(disciplina__professores=user) 
        
        admin_roles = ['administrador', 'coordenador', 'diretor', 'ti']
        if user.cargo in admin_roles or user.is_superuser:
            return queryset 
            
        return Nota.objects.none()

    @action(detail=False, methods=['post'], permission_classes=[(IsProfessor | IsCoordenacao)])
    def bulk_update_notas(self, request):
        """
        Ação customizada para salvar várias notas de uma vez.
        """
        notas_data = request.data
        if not isinstance(notas_data, list):
            return Response({"erro": "O payload deve ser uma lista."}, status=status.HTTP_400_BAD_REQUEST)

        resultados = []
        erros = []
        user = request.user

        for nota_data in notas_data:
            nota_id = nota_data.get('id')
            valor = nota_data.get('valor')
            disciplina_id = nota_data.get('disciplina')

            is_admin = user.cargo in ['administrador', 'coordenador', 'diretor', 'ti']
            is_professor_da_disciplina = Disciplina.objects.filter(id=disciplina_id, professores=user).exists()

            if not (is_admin or is_professor_da_disciplina):
                erros.append(f"ID {nota_id or 'novo'}: Você não tem permissão para esta disciplina.")
                continue

            if valor is None or valor == '': 
                continue

            try:
                if nota_id:
                    if is_admin:
                        nota = Nota.objects.get(id=nota_id)
                    else:
                        nota = Nota.objects.get(id=nota_id, disciplina__professores=user)
                        
                    serializer = NotaCreateUpdateSerializer(nota, data=nota_data, partial=True)
                else:
                    serializer = NotaCreateUpdateSerializer(data=nota_data)
                
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    resultados.append(serializer.data)
                
            except Nota.DoesNotExist:
                erros.append(f"Nota ID {nota_id} não encontrada ou não pertence a você.")
            except Exception as e:
                if 'UNIQUE constraint' in str(e):
                    erros.append(f"Erro na Disc. {disciplina_id}: Esta nota já foi lançada para este bimestre.")
                else:
                    erros.append(f"ID {nota_id or 'novo'}: {str(e)}")

        if erros:
            return Response({"sucesso": resultados, "erros": erros}, status=status.HTTP_207_MULTI_STATUS) 
            
        return Response(resultados, status=status.HTTP_200_OK)

# --- 3. ADICIONE ESTE VIEWSET NOVO ---
class FaltaViewSet(viewsets.ModelViewSet):
    """
    API para Faltas.
    Professores/Coordenação podem lançar/deletar.
    Alunos podem apenas ver as suas.
    """
    serializer_class = FaltaSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Falta.objects.all()

        if not hasattr(user, 'cargo'):
            return Falta.objects.none()
        
        # Aluno só vê as próprias faltas
        if user.cargo == 'aluno':
            if hasattr(user, 'aluno_profile'):
                return queryset.filter(aluno=user.aluno_profile)
            return Falta.objects.none()
        
        # Professor vê as faltas das suas disciplinas
        if user.cargo == 'professor':
            return queryset.filter(disciplina__professores=user)
        
        # Admin/Coord vê tudo
        admin_roles = ['administrador', 'coordenador', 'diretor', 'ti']
        if user.cargo in admin_roles or user.is_superuser:
            # Permite filtrar por aluno ou disciplina na URL
            aluno_id = self.request.query_params.get('aluno_id')
            disciplina_id = self.request.query_params.get('disciplina_id')
            if aluno_id:
                queryset = queryset.filter(aluno_id=aluno_id)
            if disciplina_id:
                queryset = queryset.filter(disciplina_id=disciplina_id)
            return queryset
            
        return Falta.objects.none()

    def get_permissions(self):
        # Só Professor ou Coordenação pode criar/deletar
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'lancar_frequencia']:
            permission_classes = [IsAuthenticated, (IsProfessor | IsCoordenacao)]
        else: # list, retrieve
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['post'], url_path='lancar')
    @transaction.atomic
    def lancar_frequencia(self, request):
        """
        Lança a frequência (faltas) para uma disciplina em uma data específica.
        Limpa registros antigos (Falta/Presenca) desse dia e cria os novos.
        Recebe: { disciplina_id: int, data: "YYYY-MM-DD", alunos_ausentes_ids: [int] }
        """
        data = request.data.get('data')
        disciplina_id = request.data.get('disciplina_id')
        alunos_ausentes_ids = request.data.get('alunos_ausentes_ids', [])

        if not data or not disciplina_id:
            return Response({"erro": "Data e ID da Disciplina são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            disciplina = Disciplina.objects.get(id=disciplina_id)
        except Disciplina.DoesNotExist:
            return Response({"erro": "Disciplina não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        # Verifica permissão (professor da disciplina ou admin)
        user = request.user
        is_admin = user.cargo in ['administrador', 'coordenador', 'diretor', 'ti']
        # .all() é necessário para M2M
        is_professor_da_disciplina = user in disciplina.professores.all() 

        if not (is_admin or is_professor_da_disciplina):
            return Response({"erro": "Você não tem permissão para lançar faltas nesta disciplina."}, status=status.HTTP_403_FORBIDDEN)

        # Pega todos os alunos da turma desta disciplina
        alunos_da_turma_ids = Aluno.objects.filter(
            turma=disciplina.turma, status='ativo'
        ).values_list('id', flat=True)

        # 1. Deleta todas as faltas E presenças (para evitar inconsistência) 
        #    destes alunos, nesta data, nesta disciplina
        Falta.objects.filter(
            disciplina=disciplina,
            data=data,
            aluno_id__in=alunos_da_turma_ids
        ).delete()
        
        Presenca.objects.filter(
            disciplina=disciplina,
            data=data,
            aluno_id__in=alunos_da_turma_ids
        ).delete()

        # 2. Cria as novas faltas
        novas_faltas = [
            Falta(aluno_id=aluno_id, disciplina=disciplina, data=data, justificada=False)
            for aluno_id in alunos_ausentes_ids
        ]
        Falta.objects.bulk_create(novas_faltas)
        
        # 3. Cria as presenças para os demais
        alunos_presentes_ids = [id for id in alunos_da_turma_ids if id not in alunos_ausentes_ids]
        novas_presencas = [
            Presenca(aluno_id=aluno_id, disciplina=disciplina, data=data)
            for aluno_id in alunos_presentes_ids
        ]
        Presenca.objects.bulk_create(novas_presencas)

        return Response(
            {"sucesso": f"{len(novas_faltas)} faltas e {len(novas_presencas)} presenças registradas."}, 
            status=status.HTTP_201_CREATED
        )

# ===================================================================
# VIEWS DE FUNÇÃO (API)
# ===================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_desempenho_aluno(request, aluno_id):
    """
    Gera relatório com notas, faltas e evolução do aluno.
    Retorna JSON.
    """
    aluno = get_object_or_404(Aluno, id=aluno_id)

    admin_roles = ['administrador', 'coordenador', 'diretor', 'ti']
    user_cargo = getattr(request.user, 'cargo', None) 

    if user_cargo == 'aluno':
        if not (hasattr(request.user, 'aluno_profile') and request.user.aluno_profile.id == aluno.id):
            return Response({'erro': 'Acesso negado. Alunos só podem ver o próprio relatório.'}, status=status.HTTP_403_FORBIDDEN)
    
    elif user_cargo == 'professor':
        disciplinas_professor = Disciplina.objects.filter(professores=request.user)
        turmas_professor = Turma.objects.filter(disciplinas__in=disciplinas_professor).distinct()
        if aluno.turma not in turmas_professor:
             return Response({'erro': 'Você não tem permissão para ver relatórios desta turma.'}, status=status.HTTP_403_FORBIDDEN)
    
    elif user_cargo not in admin_roles:
         return Response({'erro': 'Você não tem permissão para ver este relatório.'}, status=status.HTTP_403_FORBIDDEN)

    notas = Nota.objects.filter(aluno=aluno)
    faltas = Falta.objects.filter(aluno=aluno)
    presencas = Presenca.objects.filter(aluno=aluno)

    medias_disciplinas = notas.values('disciplina__materia__nome').annotate(
        media=Avg('valor')
    ).order_by('disciplina__materia__nome')

    context = {
        'aluno': {
            'nome': aluno.usuario.get_full_name() or aluno.usuario.username,
            'turma': {
                'id': aluno.turma.id if aluno.turma else None,
                'nome': aluno.turma.nome if aluno.turma else 'Sem turma'
            },
            'status': aluno.get_status_display()
        },
        'medias_disciplinas': [{'disciplina__nome': item['disciplina__materia__nome'], 'media': item['media']} for item in medias_disciplinas], 
        'faltas': {
            'count': faltas.count()
        },
        'presencas': {
            'count': presencas.count()
        }
    }

    return Response(context)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao]) 
def relatorio_geral_faltas(request):
    relatorio_faltas = Falta.objects.values('aluno__usuario__username', 'disciplina__materia__nome') \
                                   .annotate(total_faltas=Count('id')) \
                                   .order_by('aluno__usuario__username')
    
    return Response(list(relatorio_faltas))

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCoordenacao]) 
def relatorio_gerencial(request):
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
    eventos = EventoAcademico.objects.all()
    # (Adicionar filtro por turma/disciplina do usuário logado)

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
    try:
        disciplinas_professor = Disciplina.objects.filter(professores=request.user)
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_boletim_pdf(request, aluno_id):
    if not weasyprint:
        return HttpResponse("Erro: Biblioteca WeasyPrint não encontrada. Instale-a com 'pip install weasyprint'", status=500)
        
    aluno = get_object_or_404(Aluno, id=aluno_id)
    
    # (Adicionar lógica de permissão aqui)

    notas_disciplinas = Nota.objects.filter(aluno=aluno) \
                                   .values('disciplina__materia__nome', 'bimestre') \
                                   .annotate(media=Avg('valor')) \
                                   .order_by('disciplina__materia__nome', 'bimestre')
                                   
    total_faltas = Falta.objects.filter(aluno=aluno).count()
    
    advertencias = Advertencia.objects.filter(aluno=aluno).order_by('-data')
    suspensoes = Suspensao.objects.filter(aluno=aluno).order_by('-data_inicio')

    context = {
        'aluno': aluno,
        'notas_disciplinas': notas_disciplinas, 
eption as e:
        return HttpResponse(f"Erro ao gerar o PDF: {e}", status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_eventos_extracurriculares(request):
    return Response({"message": "Esta funcionalidade foi removida."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def inscrever_evento(request, evento_id):
    return Response({"message": "Esta funcionalidade foi removida."}, status=status.HTTP_404_NOT_FOUND)