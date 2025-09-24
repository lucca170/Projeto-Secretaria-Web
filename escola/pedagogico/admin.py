# escola/pedagogico/admin.py
from django.contrib import admin
from .models import Turma, Aluno, Disciplina, Nota, Falta, EmprestimoMaterial, EventoExtracurricular

@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'turno')
    search_fields = ('nome',)
    list_filter = ('turno',)

    def has_view_permission(self, request, obj=None):
        # Apenas Diretor, Coordenador e TI podem ver as turmas
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])
    
    def has_add_permission(self, request):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'turma')
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'turma__nome')
    list_filter = ('turma',)

    def has_view_permission(self, request, obj=None):
        # Apenas Diretor, Coordenador e TI podem ver os Alunos
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti', 'professor'])

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])
    
    def has_add_permission(self, request):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'professor', 'turma')
    search_fields = ('nome', 'professor__username', 'turma__nome')
    list_filter = ('turma', 'professor')

    def has_view_permission(self, request, obj=None):
        # Apenas Diretor, Coordenador e TI podem ver as Disciplinas
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti', 'professor'])

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])
    
    def has_add_permission(self, request):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'valor')
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('disciplina',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao']):
            return qs
        if hasattr(request.user, 'cargo') and request.user.cargo == 'professor':
            return qs.filter(disciplina__professor=request.user)
        return qs.none()

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'professor'])

    def has_add_permission(self, request):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo == 'professor')

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if hasattr(request.user, 'cargo') and request.user.cargo == 'professor':
            if obj is not None:
                return obj.disciplina.professor == request.user
            return True
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(Falta)
class FaltaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'data', 'justificada')
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('data', 'justificada')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao']):
            return qs
        if hasattr(request.user, 'cargo') and request.user.cargo == 'professor':
            return qs.filter(disciplina__professor=request.user)
        return qs.none()

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'professor'])

    def has_add_permission(self, request):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo == 'professor')

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if hasattr(request.user, 'cargo') and request.user.cargo == 'professor':
            if obj is not None:
                return obj.disciplina.professor == request.user
            return True
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(EmprestimoMaterial)
class EmprestimoMaterialAdmin(admin.ModelAdmin):
    list_display = ('material', 'aluno', 'data_emprestimo', 'data_devolucao')
    search_fields = ('material__nome', 'aluno__usuario__username')
    list_filter = ('data_emprestimo', 'data_devolucao')

    def has_view_permission(self, request, obj=None):
        # Apenas Diretor, Coordenador e TI podem ver os Emprestimos
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])
    
    def has_add_permission(self, request):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(EventoExtracurricular)
class EventoExtracurricularAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data', 'vagas')
    search_fields = ('nome',)
    list_filter = ('data',)

    def has_view_permission(self, request, obj=None):
        # Apenas Diretor, Coordenador e TI podem ver os Eventos
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])
    
    def has_add_permission(self, request):
        return request.user.is_superuser or (hasattr(request.user, 'cargo') and request.user.cargo in ['diretor', 'coordenacao', 'ti'])

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser