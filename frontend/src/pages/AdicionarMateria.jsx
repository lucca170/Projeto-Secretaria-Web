// Em: frontend/src/pages/AdicionarMateria.jsx (NOVO ARQUIVO)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

function AdicionarMateria() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const materiaData = { nome };

    try {
      const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/materias/';
      
      await axios.post(apiUrl, materiaData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setSuccess('Matéria criada com sucesso! Redirecionando...');
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/materias'); // Volta para a lista de matérias
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar matéria:", err);
      if (err.response && err.response.data && err.response.data.nome) {
         setError(`Erro: ${err.response.data.nome[0]}`); // ex: "matéria with this nome already exists."
      } else if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para adicionar matérias.');
      } else {
         setError('Erro ao criar matéria. Verifique o campo.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Criar Nova Matéria
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nome da Matéria (ex: Matemática)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={isSubmitting}
          />
          
          {error && ( <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> )}
          {success && ( <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert> )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : "Salvar Matéria"}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/materias')} disabled={isSubmitting}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarMateria;