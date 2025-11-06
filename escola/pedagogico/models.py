from django.db import models
from django.conf import settings
from escola.coordenacao.models import MaterialDidatico

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

class Disciplina(models.Model):
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='disciplinas'
    )
    nome = models.CharField(max_length=100)
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='disciplinas')
    def __str__(self):
        return f"{self.nome} - {self.turma.nome}"

class Aluno(models.Model):
    # --- ADICIONE ESTA TUPLA AQUI ---
    STATUS_CHOICES = (
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('evadido', 'Evadido'),
        ('transferido', 'Transferido'),
        ('concluido', 'Concluído'),
    )
    # ---------------------------------

    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='aluno_profile'
    )
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='alunos')
    
    # Esta é a linha que você adicionou (e que deu o erro):
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ativo') 

    def __str__(self):
        return self.usuario.get_full_name() or self.usuario.username

class Nota(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='notas')
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='notas')
    valor = models.DecimalField(max_digits=5, decimal_places=2)
    def __str__(self):
        return f"{self.aluno} - {self.disciplina.nome}: {self.valor}"

class Falta(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    data = models.DateField()
    justificada = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.aluno} - {self.data}"

class Presenca(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    data = models.DateField()
    def __str__(self):
        return f"{self.aluno} - {self.data}"

class EmprestimoMaterial(models.Model):
    material = models.ForeignKey(MaterialDidatico, on_delete=models.CASCADE)
    aluno = models.ForeignKey('pedagogico.Aluno', on_delete=models.CASCADE, null=True, blank=True)
    data_emprestimo = models.DateField()
    data_devolucao = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.material.nome} - {self.data_emprestimo}"
 

    
class Responsavel(models.Model):
    """ 
    Model para vincular um usuário (Responsável) a um ou mais alunos.
    Essencial para as notificações de faltas.
    """
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='responsavel_profile'
    )
    alunos = models.ManyToManyField(Aluno, related_name='responsaveis')
    
    def __str__(self):
        return self.usuario.get_full_name() or self.usuario.username

class EventoAcademico(models.Model):
    """ 
    Para o 'Calendário Acadêmico' (provas, trabalhos, feriados, etc.)
    """
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
    
    # Vinculado a uma turma (ex: Prova da Turma 3D.S)
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='eventos_academicos', null=True, blank=True)
    # Ou a uma disciplina específica (ex: Prova de Português)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='eventos_academicos', null=True, blank=True)

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.titulo} ({self.data_inicio.strftime('%d/%m/%Y')})"

class PlanoDeAula(models.Model):
    """ 
    Para a 'Agenda de Professores' e 'planejamento semanal de aula'
    """
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='planos_de_aula')
    data = models.DateField()
    conteudo_previsto = models.TextField(verbose_name="Conteúdo Previsto")
    atividades = models.TextField(blank=True, verbose_name="Atividades/Observações")
    
    class Meta:
        unique_together = ('disciplina', 'data') # Apenas um plano por disciplina por dia
        ordering = ['data']

    def __str__(self):
        return f"Plano de {self.disciplina.nome} - {self.data}"

class Notificacao(models.Model):
    """ 
    Para 'Enviar notificações' e 'Notificar pais'
    """
    destinatario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notificacoes'
    )
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    class Meta:
        ordering = ['-data_envio']

    def __str__(self):
        return f"Notificação para {self.destinatario.username} em {self.data_envio.strftime('%d/%m')}"