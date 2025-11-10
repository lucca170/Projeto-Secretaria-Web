// Em: frontend/src/pages/EditarLivro.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Grid
  // Imports de Select removidos
} from '@mui/material';

function EditarLivro() {
  const navigate = useNavigate();
  const { livroId } = useParams();
  const token = localStorage.getItem('authToken');
  
  const [formData, setFormData] = useState({
    titulo: '',
    // --- MODIFICADO ---
    autor_nome: '', // Trocado de autor_id para autor_nome
    // --- FIM MODIFICAÇÃO ---
    isbn: '',
    quantidade_total: 1,
    quantidade_disponivel: 1,
  });
  
  // --- REMOVIDO ---
  // const [autores, setAutores] = useState([]);
  // --- FIM REMOÇÃO ---
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efeito para buscar os dados do Livro
  useEffect(() => {
    // --- MODIFICADO: Não busca mais autores ---
    const fetchLivro = axios.get(`http://127.0.0.1:8000/biblioteca/api/livros/${livroId}/`, {
        headers: { 'Authorization': `Token ${token}` }
    });

    fetchLivro
    .then(livroRes => {
        const livroData = livroRes.data;
        
        // Popula o formulário com os dados existentes
        setFormData({
            titulo: livroData.titulo,
            // --- MODIFICADO: Usa o nome do autor que veio no objeto ---
            autor_nome: livroData.autor.nome, 
            // --- FIM MODIFICAÇÃO ---
            isbn: livroData.isbn || '',
            quantidade_total: livroData.quantidade_total,
            quantidade_disponivel: livroData.quantidade_disponivel,
        });
        setLoading(false);
    })
    .catch(err => {
        console.error("Erro ao buscar dados:", err);
        setError('Não foi possível carregar os dados para edição.');
        setLoading(false);
    });
  }, [token, livroId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTotalChange = (e) => {
    const total = parseInt(e.target.value) || 0;
    setFormData(prev => ({
        ...prev,
        quantidade_total: total,
    }));
  };

  // Envia a atualização (PUT)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const dataPayload = {
      titulo: formData.titulo,
      // --- MODIFICADO ---
      autor_nome: formData.autor_nome, // Envia o nome como string
      // --- FIM MODIFICAÇÃO ---
      isbn: formData.isbn,
      quantidade_total: parseInt(formData.quantidade_total),
      quantidade_disponivel: parseInt(formData.quantidade_disponivel),
    };
    
    if (dataPayload.quantidade_disponivel > dataPayload.quantidade_total) {
        setError("A quantidade disponível não pode ser maior que a total.");
        setIsSubmitting(false);
        return;
    }

    try {
      const apiUrl = `http://127.0.0.1:8000/biblioteca/api/livros/${livroId}/`;
      
      await axios.put(apiUrl, dataPayload, {
        headers: { 'Authorization': `Token ${token}` }
      });

      setSuccess('Livro atualizado com sucesso!');
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/biblioteca');
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar livro:", err);
      if (err.response && err.response.data) {
         const errors = Object.values(err.response.data).join(', ');
         setError(`Erro ao atualizar: ${errors}`);
      } else {
         setError('Erro ao atualizar livro. Verifique os campos.');
      }
      setIsSubmitting(false);
    }
  };
  
  // (O handleDelete permanece o mesmo)
  const handleDelete = async () => {
    setError('');
    setSuccess('');
    
    if (!window.confirm("Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.")) {
        return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = `http://127.0.0.1:8000/biblioteca/api/livros/${livroId}/`;
      
      await axios.delete(apiUrl, {
        headers: { 'Authorization': `Token ${token}` }
      });

      setSuccess('Livro excluído com sucesso! Redirecionando...');
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/biblioteca');
      }, 2000);

    } catch (err) {
      console.error("Erro ao excluir livro:", err);
      setError('Não foi possível excluir o livro. Verifique se há empréstimos pendentes.');
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
        </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar Livro
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Título do Livro"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required fullWidth margin="normal"
          />
          
          {/* --- CAMPO MODIFICADO --- */}
          <TextField
            label="Nome do Autor"
            name="autor_nome"
            value={formData.autor_nome}
            onChange={handleChange}
            required fullWidth margin="normal"
            helperText="Se o autor não existir, ele será criado."
          />
          {/* --- FIM DA MODIFICAÇÃO --- */}

          <TextField
            label="ISBN (Opcional)"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            fullWidth margin="normal"
          />

          <TextField
            label="Quantidade Total"
            name="quantidade_total"
            type="number"
            value={formData.quantidade_total}
            onChange={handleTotalChange}
            required fullWidth margin="normal"
            InputProps={{ inputProps: { min: 0 } }}
          />

          <TextField
            label="Quantidade Disponível"
            name="quantidade_disponivel"
            type="number"
            value={formData.quantidade_disponivel}
            onChange={handleChange}
            required fullWidth margin="normal"
            InputProps={{ inputProps: { min: 0, max: formData.quantidade_total } }}
            helperText="Disponível não pode ser maior que o total."
          />
          
          {error && ( <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> )}
          {success && ( <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert> )}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Salvar Alterações"}
                </Button>
            </Grid>
            <Grid item>
                <Button variant="outlined" onClick={() => navigate('/biblioteca')} disabled={isSubmitting}>
                  Cancelar
                </Button>
            </Grid>
            <Grid item sx={{ ml: 'auto' }}>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={isSubmitting}>
                  Excluir Livro
                </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditarLivro;