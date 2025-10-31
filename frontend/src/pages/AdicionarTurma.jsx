// Em: frontend/src/pages/AdicionarTurma.jsx (NOVO ARQUIVO)

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
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

const turnosOptions = [
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noite', label: 'Noite' },
];

function AdicionarTurma() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [turno, setTurno] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const turmaData = {
      nome,
      turno,
    };

    try {
      const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/turmas/';
      
      await axios.post(apiUrl, turmaData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setSuccess('Turma criada com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/turmas'); // Volta para a lista de turmas
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar turma:", err);
      if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para criar turmas.');
      } else {
          setError('Erro ao criar turma. Verifique os campos.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Criar Nova Turma
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nome da Turma"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="turno-label">Turno</InputLabel>
            <Select
              labelId="turno-label"
              value={turno}
              label="Turno"
              onChange={(e) => setTurno(e.target.value)}
            >
              {turnosOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {success}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Salvar Turma
            </Button>
            <Button variant="outlined" onClick={() => navigate('/turmas')}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarTurma;