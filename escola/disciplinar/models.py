from django.db import models
from escola.pedagogico.models import Aluno

class Advertencia(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='advertencias')
    data = models.DateField()
    motivo = models.CharField(max_length=200)
    def __str__(self):
        return f"Advertência de {self.aluno} em {self.data}: {self.motivo}"

class Suspensao(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='suspensoes')
    data_inicio = models.DateField()
    data_fim = models.DateField()
    motivo = models.CharField(max_length=200)
    def __str__(self):
        return f"Suspensão de {self.aluno} de {self.data_inicio} até {self.data_fim}: {self.motivo}"