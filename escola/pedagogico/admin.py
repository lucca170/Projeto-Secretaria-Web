<<<<<<< HEAD
from django.contrib import admin
=======
# escola/pedagogico/admin.py
from django.contrib import admin
# ADICIONADO: EventoAcademico, Notificacao, Responsavel, PlanoDeAula
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
from .models import (
    Turma, 
    Aluno, 
    Disciplina, 
    Nota, 
    Falta, 
    EmprestimoMaterial,
<<<<<<< HEAD
    EventoAcademico, 
    Notificacao, 
    Responsavel, 
    PlanoDeAula,
    Materia # --- NOVO ---
)

# --- NOVO ---
@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)

@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    # ... (sem alterações)
=======
    EventoAcademico,
    Notificacao,
    Responsavel,
    PlanoDeAula
)

@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    list_display = ('nome', 'turno')
    search_fields = ('nome',)
    list_filter = ('turno',)

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
<<<<<<< HEAD
    # ... (sem alterações)
    list_display = ('usuario', 'turma', 'status') 
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'turma__nome')
    list_filter = ('turma', 'status') 

# --- ALTERADO ---
@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('materia', 'turma', 'carga_horaria', 'listar_professores')
    search_fields = ('materia__nome', 'turma__nome', 'professores__username')
    list_filter = ('turma', 'materia', 'professores')
    # Facilita a seleção de múltiplos professores
    filter_horizontal = ('professores',) 

    @admin.display(description='Professores')
    def listar_professores(self, obj):
        return ", ".join([p.get_full_name() or p.username for p in obj.professores.all()])

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    # --- ALTERADO (search_fields) ---
    list_display = ('aluno', 'disciplina', 'bimestre', 'valor') 
    search_fields = ('aluno__usuario__username', 'disciplina__materia__nome') # Busca no nome da matéria
    list_filter = ('disciplina__materia', 'bimestre') # Filtra pela matéria

@admin.register(Falta)
class FaltaAdmin(admin.ModelAdmin):
    # --- ALTERADO (search_fields) ---
    list_display = ('aluno', 'disciplina', 'data', 'justificada')
    search_fields = ('aluno__usuario__username', 'disciplina__materia__nome') # Busca no nome da matéria
    list_filter = ('data', 'justificada', 'disciplina__materia') # Filtra pela matéria

# ... (Resto dos Admins sem alterações)
=======
    list_display = ('usuario', 'turma', 'status') # Adicionado status
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'turma__nome')
    list_filter = ('turma', 'status') # Adicionado status

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'professor', 'turma', 'carga_horaria') # Add carga_horaria
    search_fields = ('nome', 'professor__username', 'turma__nome')
    list_filter = ('turma', 'professor')

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'bimestre', 'valor') # Add bimestre
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('disciplina', 'bimestre') # Add bimestre

@admin.register(Falta)
class FaltaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'disciplina', 'data', 'justificada')
    search_fields = ('aluno__usuario__username', 'disciplina__nome')
    list_filter = ('data', 'justificada')

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
@admin.register(EmprestimoMaterial)
class EmprestimoMaterialAdmin(admin.ModelAdmin):
    list_display = ('material', 'aluno', 'data_emprestimo', 'data_devolucao')
    search_fields = ('material__nome', 'aluno__usuario__username')
    list_filter = ('data_emprestimo', 'data_devolucao')

<<<<<<< HEAD
=======
# --- REGISTROS NOVOS ADICIONADOS ABAIXO ---

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
@admin.register(EventoAcademico)
class EventoAcademicoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data_inicio', 'data_fim', 'turma', 'disciplina')
    search_fields = ('titulo', 'descricao')
    list_filter = ('tipo', 'data_inicio', 'turma', 'disciplina')

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('destinatario', 'mensagem', 'data_envio', 'lida')
    search_fields = ('destinatario__username', 'mensagem')
    list_filter = ('lida', 'data_envio')

@admin.register(Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    list_display = ('usuario',)
    search_fields = ('usuario__username',)

@admin.register(PlanoDeAula)
class PlanoDeAulaAdmin(admin.ModelAdmin):
    list_display = ('disciplina', 'data', 'conteudo_previsto')
<<<<<<< HEAD
    search_fields = ('disciplina__materia__nome', 'conteudo_previsto')
=======
    search_fields = ('disciplina__nome', 'conteudo_previsto')
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    list_filter = ('data', 'disciplina')