# Em: escola/biblioteca/models.py
from django.db import models
from django.conf import settings
from escola.pedagogico.models import Aluno
from django.utils import timezone

class Autor(models.Model):
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome

class Livro(models.Model):
    titulo = models.CharField(max_length=255)
    autor = models.ForeignKey(Autor, on_delete=models.SET_NULL, null=True, related_name='livros')
    isbn = models.CharField(max_length=13, unique=True, blank=True, null=True)
    quantidade_total = models.PositiveIntegerField(default=1)
    quantidade_disponivel = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.titulo} ({self.autor.nome})"

    def save(self, *args, **kwargs):
        # Garante que a quantidade disponível não seja maior que a total
        if self.quantidade_disponivel > self.quantidade_total:
            self.quantidade_disponivel = self.quantidade_total
        super().save(*args, **kwargs)

class Emprestimo(models.Model):
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name='emprestimos')
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='emprestimos_livros')
    data_emprestimo = models.DateField(auto_now_add=True)
    data_devolucao_prevista = models.DateField()
    data_devolucao_real = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_emprestimo']

    def __str__(self):
        return f"{self.livro.titulo} - {self.aluno.usuario.username}"
    
    def save(self, *args, **kwargs):
        # Define a data de devolução prevista para 14 dias se não for definida
        if not self.data_devolucao_prevista:
            self.data_devolucao_prevista = timezone.now().date() + timezone.timedelta(days=14)
        super().save(*args, **kwargs)