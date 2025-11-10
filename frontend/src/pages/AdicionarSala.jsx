// Em: frontend/src/pages/AdicionarSala.jsx (NOVO ARQUIVO)

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

function AdicionarSala() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState(0);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const salaData = {
      nome,
      tipo,
      capacidade: parseInt(capacidade) || 0,
    };

    try {
      const apiUrl = 'http://127.0.0.1:8000/coordenacao/api/salas/';
      
      await axios.post(apiUrl, salaData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setSuccess('Sala criada com sucesso! Redirecionando...');
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/salas'); // Volta para a lista de salas
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar sala:", err);
      if (err.response && err.response.data) {
         const errors = Object.values(err.response.data).join(', ');
         setError(`Erro ao criar sala: ${errors}`);
      } else if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para adicionar salas.');
      } else {
         setError('Erro ao criar sala. Verifique os campos.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Criar Nova Sala ou Laboratório
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nome da Sala"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={isSubmitting}
          />
          
          <TextField
            label="Tipo (ex: Sala de Aula, Laboratório, Auditório)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={isSubmitting}
          />

          <TextField
            label="Capacidade"
            type="number"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { min: 0 } }}
            disabled={isSubmitting}
          />
          
          {error && ( <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> )}
          {success && ( <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert> )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : "Salvar Sala"}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/salas')} disabled={isSubmitting}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarSala;