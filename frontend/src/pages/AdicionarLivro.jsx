// Em: frontend/src/pages/AdicionarLivro.jsx

import React, { useState } from 'react'; // useEffect removido
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert
  // Imports de Select removidos
} from '@mui/material';

function AdicionarLivro() {
  const navigate = useNavigate();
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
  // const [loadingAutores, setLoadingAutores] = useState(true);
  // --- FIM REMOÇÃO ---
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- REMOVIDO ---
  // O useEffect que buscava autores foi removido.
  // --- FIM REMOÇÃO ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTotalChange = (e) => {
    const total = parseInt(e.target.value) || 0;
    setFormData(prev => ({
        ...prev,
        quantidade_total: total,
        quantidade_disponivel: total 
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const dataPayload = {
      titulo: formData.titulo,
      // --- MODIFICADO ---
      autor_nome: formData.autor_nome, // Enviamos o nome como string
      // --- FIM MODIFICAÇÃO ---
      isbn: formData.isbn,
      quantidade_total: parseInt(formData.quantidade_total),
      quantidade_disponivel: parseInt(formData.quantidade_disponivel),
    };

    try {
      const apiUrl = 'http://127.0.0.1:8000/biblioteca/api/livros/';
      
      await axios.post(apiUrl, dataPayload, {
        headers: { 'Authorization': `Token ${token}` }
      });

      setSuccess('Livro criado com sucesso! Redirecionando...');
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/biblioteca');
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar livro:", err);
      if (err.response && err.response.data) {
         const errors = Object.values(err.response.data).join(', ');
         setError(`Erro ao criar livro: ${errors}`);
      } else if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para adicionar livros.');
      } else {
         setError('Erro ao criar livro. Verifique os campos.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Adicionar Novo Livro
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
            InputProps={{ inputProps: { min: 1 } }}
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

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : "Salvar Livro"}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/biblioteca')} disabled={isSubmitting}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarLivro;