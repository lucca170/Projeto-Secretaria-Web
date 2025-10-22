# escola/financeiro/views.py
from django.shortcuts import render, redirect
from .models import Mensalidade, Transacao
from .forms import MensalidadeForm, TransacaoForm

def lista_mensalidades(request):
    mensalidades = Mensalidade.objects.all()
    return render(request, 'financeiro/lista_mensalidades.html', {'mensalidades': mensalidades})

def adicionar_mensalidade(request):
    if request.method == 'POST':
        form = MensalidadeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_mensalidades')
    else:
        form = MensalidadeForm()
    return render(request, 'financeiro/adicionar_mensalidade.html', {'form': form})

def lista_transacoes(request):
    transacoes = Transacao.objects.all()
    return render(request, 'financeiro/lista_transacoes.html', {'transacoes': transacoes})

def adicionar_transacao(request):
    if request.method == 'POST':
        form = TransacaoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_transacoes')
    else:
        form = TransacaoForm()
    return render(request, 'financeiro/adicionar_transacao.html', {'form': form})