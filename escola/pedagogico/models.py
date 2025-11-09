from django.db import models
from django.conf import settings
<<<<<<< HEAD
from escola.coordenacao.models import MaterialDidatico 

# --- NOVO MODELO ---
class Materia(models.Model):
    """
    O cadastro central de Matérias (ex: Matemática, Português, História).
    Isto é a "matéria pronta" que você pediu.
    """
    nome = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name_plural = "Matérias Prontas"

# --- MODELO EXISTENTE (ALTERADO) ---
=======
# Corrigido: Importa MaterialDidatico de coordenacao
from escola.coordenacao.models import MaterialDidatico 

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
class Turma(models.Model):
    TURNO_CHOICES = (
        ('manha', 'Manhã'),
        ('tarde', 'Tarde'),
        ('noite', 'Noite'),
    )
    nome = models.CharField(max_length=50)
    turno = models.CharField(max_length=10, choices=TURNO_CHOICES)
    def __str__(self):
        return f"{self.nome} ({self.get_turno_display()})"

<<<<<<< HEAD
# --- MODELO EXISTENTE (MUITO ALTERADO) ---
class Disciplina(models.Model):
    """
    Este modelo agora é a "Oferta da Disciplina".
    Ele conecta uma Matéria (Matemática) a uma Turma (1A)
    e a um ou mais Professores.
    """
    # REMOVIDO: professor = ForeignKey(...)
    # REMOVIDO: nome = CharField(...)
    
    # NOVO: Qual é a matéria? (ex: Matemática)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='disciplinas')
    
    # NOVO: Quais professores dão esta aula?
    professores = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='disciplinas',
        # Limita as escolhas no admin para apenas usuários com cargo 'professor'
        limit_choices_to={'cargo': 'professor'} 
    )
    
    # EXISTENTE: Em qual turma? (ex: 1A)
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='disciplinas')
    
    # EXISTENTE: Carga horária
    carga_horaria = models.PositiveIntegerField(default=80, help_text="Total de aulas no período/ano.")

    def __str__(self):
        # O __str__ agora é mais descritivo
        return f"{self.materia.nome} - {self.turma.nome}"
    
    class Meta:
        # Garante que você não possa adicionar "Matemática" duas vezes na "Turma 1A"
        unique_together = ('materia', 'turma')
        verbose_name_plural = "Disciplinas (Ofertas por Turma)"


class Aluno(models.Model):
    # ... (sem alterações)
=======
class Disciplina(models.Model):
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='disciplinas'
    )
    nome = models.CharField(max_length=100)
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='disciplinas')
    
    # --- CAMPO NOVO (Para calcular % de faltas) ---
    carga_horaria = models.PositiveIntegerField(default=80, help_text="Total de aulas no período/ano.")

    def __str__(self):
        return f"{self.nome} - {self.turma.nome}"

class Aluno(models.Model):
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    STATUS_CHOICES = (
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('evadido', 'Evadido'),
        ('transferido', 'Transferido'),
        ('concluido', 'Concluído'),
    )
<<<<<<< HEAD
=======

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='aluno_profile'
    )
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='alunos')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ativo') 
<<<<<<< HEAD
    def __str__(self):
        return self.usuario.get_full_name() or self.usuario.username

# --- MODELOS DE NOTA, FALTA, PRESENCA (Sem alterações) ---
# Eles já se relacionam com a 'Disciplina' (a oferta), o que está correto.

class Nota(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='notas')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='notas')
    bimestre = models.CharField(max_length=20, default='1º Bimestre') 
    valor = models.DecimalField(max_digits=5, decimal_places=2)
    
    class Meta:
        unique_together = ('aluno', 'disciplina', 'bimestre')
    def __str__(self):
        return f"{self.aluno} - {self.disciplina} ({self.bimestre}): {self.valor}"
=======

    def __str__(self):
        return self.usuario.get_full_name() or self.usuario.username

class Nota(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='notas')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='notas')
    
    # --- NOVO (Para diferenciar as notas) ---
    bimestre = models.CharField(max_length=20, default='1º Bimestre') 
    
    valor = models.DecimalField(max_digits=5, decimal_places=2)
    
    class Meta:
        # Garante que um aluno só tenha uma nota por disciplina por bimestre
        unique_together = ('aluno', 'disciplina', 'bimestre')

    def __str__(self):
        return f"{self.aluno} - {self.disciplina.nome} ({self.bimestre}): {self.valor}"
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

class Falta(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    data = models.DateField()
    justificada = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.aluno} - {self.data}"

class Presenca(models.Model):
<<<<<<< HEAD
    # ... (sem alterações)
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    data = models.DateField()
    def __str__(self):
        return f"{self.aluno} - {self.data}"

<<<<<<< HEAD
# ... (Resto dos modelos: EmprestimoMaterial, Responsavel, EventoAcademico, PlanoDeAula, Notificacao)
# (O PlanoDeAula continua ligado à Disciplina (oferta), o que está correto)
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
class EmprestimoMaterial(models.Model):
    material = models.ForeignKey(MaterialDidatico, on_delete=models.CASCADE)
    aluno = models.ForeignKey('pedagogico.Aluno', on_delete=models.CASCADE, null=True, blank=True)
    data_emprestimo = models.DateField()
    data_devolucao = models.DateField(null=True, blank=True)
<<<<<<< HEAD
=======

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    def __str__(self):
        return f"{self.material.nome} - {self.data_emprestimo}"
 
class Responsavel(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='responsavel_profile'
    )
    alunos = models.ManyToManyField(Aluno, related_name='responsaveis')
<<<<<<< HEAD
=======
    
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    def __str__(self):
        return self.usuario.get_full_name() or self.usuario.username

class EventoAcademico(models.Model):
    TIPO_CHOICES = (
        ('prova', 'Prova'),
        ('trabalho', 'Entrega de Trabalho'),
        ('feriado', 'Feriado'),
        ('evento', 'Evento Escolar'),
        ('reuniao', 'Reunião'),
    )
    titulo = models.CharField(max_length=100)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField(null=True, blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    descricao = models.TextField(blank=True)
<<<<<<< HEAD
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='eventos_academicos', null=True, blank=True)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='eventos_academicos', null=True, blank=True)
=======
    
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='eventos_academicos', null=True, blank=True)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='eventos_academicos', null=True, blank=True)

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.titulo} ({self.data_inicio.strftime('%d/%m/%Y')})"

class PlanoDeAula(models.Model):
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='planos_de_aula')
    data = models.DateField()
    conteudo_previsto = models.TextField(verbose_name="Conteúdo Previsto")
    atividades = models.TextField(blank=True, verbose_name="Atividades/Observações")
<<<<<<< HEAD
    class Meta:
        unique_together = ('disciplina', 'data') 
        ordering = ['data']
    def __str__(self):
        return f"Plano de {self.disciplina} - {self.data}"
=======
    
    class Meta:
        unique_together = ('disciplina', 'data') 
        ordering = ['data']

    def __str__(self):
        return f"Plano de {self.disciplina.nome} - {self.data}"
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

class Notificacao(models.Model):
    destinatario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notificacoes'
    )
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)
<<<<<<< HEAD
    class Meta:
        ordering = ['-data_envio']
=======

    class Meta:
        ordering = ['-data_envio']

>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    def __str__(self):
        return f"Notificação para {self.destinatario.username} em {self.data_envio.strftime('%d/%m')}"