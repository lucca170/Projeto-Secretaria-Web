from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Cadastro

class CustomUserCreationForm(UserCreationForm):
    cargo = forms.ChoiceField(choices=Cadastro.CARGO_CHOICES, required=True, label="Cargo")

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('email',)