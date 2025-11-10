# Em: escola/base/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# --- Modelo de Usuário Personalizado ---
CARGO_CHOICES = [
    ('professor', 'Professor'),
    ('aluno', 'Aluno'),
    ('administrador', 'Administrador'),
    ('coordenador', 'Coordenador'), 
    ('diretor', 'Diretor'),       
    ('ti', 'TI'),
    ('responsavel', 'Responsável'), 
]

class Usuario(AbstractUser):  
    
    # --- CAMPO DE E-MAIL MODIFICADO ---
    # Tornamos o e-mail obrigatório (blank=False) e único
    email = models.EmailField(unique=True, blank=False)
    
    cargo = models.CharField(max_length=50, choices=CARGO_CHOICES)

    REQUIRED_FIELDS = ['email', 'cargo']

    def __str__(self):
        return self.username