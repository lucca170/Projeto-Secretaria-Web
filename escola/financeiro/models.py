from django.db import models
from escola.pedagogico.models import Aluno

class Mensalidade(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    mes = models.CharField(max_length=7)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    pago = models.BooleanField(default=False)
    data_pagamento = models.DateField(null=True, blank=True)
    data_de_vencimento = models.DateField()
    status = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.aluno} - {self.mes}"

class Matricula(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='matriculas')
    ano = models.PositiveIntegerField()
    data_matricula = models.DateField(auto_now_add=True)
    documentos_enviados = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.aluno} - {self.ano}"
    
class Transacao(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    TIPO_CHOICES = (
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    )
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES)
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.descricao