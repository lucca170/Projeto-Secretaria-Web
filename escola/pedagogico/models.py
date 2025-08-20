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
        limit_choices_to={'tipo': 'professor'},
        related_name='disciplinas'
    )
    nome = models.CharField(max_length=100)
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='disciplinas')
    def __str__(self):
        return f"{self.nome} - {self.turma.nome}"

class Aluno(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'tipo': 'aluno'},
        related_name='aluno_profile'
    )
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='alunos')
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
 
class EventoExtracurricular(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    data = models.DateField()
    vagas = models.PositiveIntegerField()
    participantes = models.ManyToManyField('pedagogico.Aluno', blank=True)

    def __str__(self):
        return self.nome