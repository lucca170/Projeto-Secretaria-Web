from django import forms
from .models import Turma, Aluno

class TurmaForm(forms.ModelForm):
    class Meta:
        model = Turma
        fields = ['nome', 'turno']

class AlunoForm(forms.ModelForm):
    class Meta:
        model = Aluno
        fields = ['usuario', 'turma']