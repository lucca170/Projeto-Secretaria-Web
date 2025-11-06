# Em: escola/biblioteca/serializers.py
from rest_framework import serializers
from .models import Autor, Livro, Emprestimo

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = ['id', 'nome']

class LivroSerializer(serializers.ModelSerializer):
    # Mostra o objeto autor (com nome) ao ler
    autor = AutorSerializer(read_only=True)
    
    # --- MODIFICAÇÃO AQUI ---
    # Aceita um campo de texto 'autor_nome' ao escrever (criar/atualizar)
    autor_nome = serializers.CharField(write_only=True)

    class Meta:
        model = Livro
        # 'autor_id' foi removido, 'autor_nome' foi adicionado
        fields = [
            'id', 'titulo', 'autor', 'autor_nome', 'isbn', 
            'quantidade_total', 'quantidade_disponivel'
        ]
        read_only_fields = ('autor',)

    def create(self, validated_data):
        """
        Override do método create para lidar com 'autor_nome'.
        """
        # 1. Pega o nome do autor do payload
        autor_nome = validated_data.pop('autor_nome')
        
        # 2. Encontra o autor por esse nome, ou cria um novo se não existir
        autor_obj, created = Autor.objects.get_or_create(nome=autor_nome)
        
        # 3. Cria o livro, associando ao autor encontrado/criado
        livro = Livro.objects.create(autor=autor_obj, **validated_data)
        return livro

    def update(self, instance, validated_data):
        """
        Override do método update para lidar com 'autor_nome'.
        """
        # 1. Pega o nome do autor do payload, se ele foi enviado
        autor_nome = validated_data.pop('autor_nome', None)
        
        if autor_nome:
            # 2. Encontra ou cria o autor
            autor_obj, created = Autor.objects.get_or_create(nome=autor_nome)
            # 3. Associa o novo autor à instância do livro
            instance.autor = autor_obj
        
        # 4. Atualiza os outros campos (titulo, isbn, etc.)
        # (Chamada super() é importante aqui)
        return super().update(instance, validated_data)

# --- FIM DA MODIFICAÇÃO ---

class EmprestimoSerializer(serializers.ModelSerializer):
    # (Este serializer permanece sem alterações)
    livro = LivroSerializer(read_only=True)
    aluno_nome = serializers.CharField(source='aluno.usuario.get_full_name', read_only=True)

    class Meta:
        model = Emprestimo
        fields = ['id', 'livro', 'aluno', 'aluno_nome', 'data_emprestimo', 'data_devolucao_prevista', 'data_devolucao_real']
        read_only_fields = ('aluno_nome', 'data_emprestimo', 'data_devolucao_real')