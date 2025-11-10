# Em: escola/coordenacao/models.py

from django.db import models
from django.conf import settings

# O model 'User' foi removido daqui.

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
    # ATUALIZADO: Vinculado ao usuário real
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True
    )
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()

    def __str__(self):
        return f"{self.sala.nome} - {self.data_inicio}"

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