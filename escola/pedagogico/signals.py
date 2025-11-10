from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Falta, EventoAcademico, Notificacao, Aluno, Disciplina

@receiver(post_save, sender=Falta)
def notificar_excesso_faltas(sender, instance, created, **kwargs):
    """
    Implementa: 'Notificar os pais/responsáveis quando as faltas forem excessivas. (> 25%)'
    """
    if created: # Executa apenas quando uma nova falta é CRIADA
        aluno = instance.aluno
        disciplina = instance.disciplina
        
        # IMPORTANTE: Você precisa definir a 'carga_horaria' (total de aulas)
        # Sugiro adicionar este campo no seu model 'Disciplina'
        try:
            # Tenta pegar a carga horária da disciplina
            total_aulas = disciplina.carga_horaria 
        except AttributeError:
            # Se não tiver, assume um valor padrão (ex: 80 aulas)
            total_aulas = 80 
            
        total_faltas = Falta.objects.filter(aluno=aluno, disciplina=disciplina).count()
        limite_percentual = 0.25 # 25%

        # (total_aulas > 0) evita divisão por zero
        if total_aulas > 0 and (total_faltas / total_aulas) > limite_percentual:
            
            # Notificar apenas uma vez (quando cruza o limite)
            # Se a falta anterior não tinha cruzado o limite, notifica.
            if ((total_faltas - 1) / total_aulas) <= limite_percentual:
                
                # Busca os responsáveis pelo aluno
                responsaveis = aluno.responsaveis.all() # Usando o model Responsavel
                for responsavel in responsaveis:
                    Notificacao.objects.create(
                        destinatario=responsavel.usuario,
                        mensagem=f"Atenção: O aluno {aluno.usuario.get_full_name()} atingiu {total_faltas} faltas em {disciplina.nome}, ultrapassando o limite de 25%."
                    )

@receiver(post_save, sender=EventoAcademico)
def notificar_novo_evento(sender, instance, created, **kwargs):
    """
    Implementa: 'Enviar notificações sobre atividades, trabalhos, provas'
    """
    if created: # Se o evento acabou de ser criado
        if instance.tipo in ['prova', 'trabalho', 'evento']:
            
            # Se o evento é para uma turma específica
            if instance.turma:
                alunos_da_turma = Aluno.objects.filter(turma=instance.turma, status='ativo')
                for aluno in alunos_da_turma:
                    Notificacao.objects.create(
                        destinatario=aluno.usuario,
                        mensagem=f"Novo Evento: {instance.get_tipo_display()} '{instance.titulo}' marcado para {instance.data_inicio.strftime('%d/%m/%Y')}."
                    )