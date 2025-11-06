from django import forms
from .models import Mensalidade, Transacao

class MensalidadeForm(forms.ModelForm):
    class Meta:
        model = Mensalidade
        fields = ['aluno', 'valor', 'data_de_vencimento', 'status']

class TransacaoForm(forms.ModelForm):
    class Meta:
        model = Transacao
        fields = ['descricao', 'valor', 'tipo']