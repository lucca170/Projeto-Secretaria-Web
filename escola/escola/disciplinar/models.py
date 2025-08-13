from django.db import models
from pedagogico.models import Aluno

class Advertencia(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    data = models.DateField()
    motivo = models.CharField(max_length=200)
    def __str__(self):
        return f"{self.aluno} - {self.data}"

class Suspensao(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    motivo = models.CharField(max_length=200)
    def __str__(self):
        return f"{self.aluno} - {self.data_inicio} a {self.data_fim}"
