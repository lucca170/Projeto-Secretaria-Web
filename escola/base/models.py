from django.db import models
from django.contrib.auth.models import Group, Permission, AbstractUser
from django.conf import settings

# --- Modelo de Usuário Personalizado ---
class Usuario(AbstractUser):
    CARGO_CHOICES = (
        ('Ti, Tecnologia da Informação'),
        ('aluno', 'Aluno'),
        ('professor', 'Professor'),
        ('coordenacao', 'Coordenação'),
        ('secretaria', 'Secretaria'),
    )
    cargo = models.CharField(max_length=20, choices=CARGO_CHOICES, default='Aluno')

# --- Notificações, Eventos e Materiais ---
class Notificacao(models.Model):
    destinatario = models.CharField(max_length=100)
    titulo = models.CharField(max_length=100)
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.destinatario} - {self.titulo}"

class EventoCalendario(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    tipo = models.CharField(max_length=50, choices=[
        ('prova', 'Prova'),
        ('feriado', 'Feriado'),
        ('evento', 'Evento'),
        ('entrega', 'Entrega de Trabalho'),
        ('reuniao', 'Reunião'),
        ('outro', 'Outro'),
    ])

    def __str__(self):
        return f"{self.titulo} - {self.data_inicio.date()}"

class MaterialDidatico(models.Model):
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    quantidade = models.PositiveIntegerField(default=1)
    disponivel = models.BooleanField(default=True)

    def __str__(self):
        return self.nome

class SalaLaboratorio(models.Model):
    nome = models.CharField(max_length=50)
    tipo = models.CharField(max_length=50)
    capacidade = models.PositiveIntegerField()

    def __str__(self):
        return self.nome

class ReservaSala(models.Model):
    sala = models.ForeignKey(SalaLaboratorio, on_delete=models.CASCADE)
    usuario = models.CharField(max_length=100)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()

    def __str__(self):
        return f"{self.sala.nome} - {self.data_inicio}"

# --- Relatórios e Análise Gerencial ---
class RelatorioGerencial(models.Model):
    titulo = models.CharField(max_length=100)
    data_geracao = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=50)
    arquivo = models.FileField(upload_to='relatorios/')

    def __str__(self):
        return self.titulo

class Colaborador(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    cargo = models.CharField(max_length=50)

    def __str__(self):
        return self.nome
    
class Aluno(models.Model):
    nome = models.CharField(max_length=100)
    data_nascimento = models.DateField()
    cpf = models.CharField(max_length=14, unique=True)
    rg = models.CharField(max_length=20, unique=True)
    endereco = models.CharField(max_length=200)

    def __str__(self):
        return self.nome

class Disciplina(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Nota(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    nota = models.DecimalField(max_digits=5, decimal_places=2)
    bimestre = models.CharField(max_length=20) # Ex: "1º Bimestre", "2º Bimestre"
    comentario = models.TextField(blank=True, null=True) # Campo para comentários do professor

    def __str__(self):
        return self.user.username
