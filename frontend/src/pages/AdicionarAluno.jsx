// Em: frontend/src/pages/AdicionarAluno.jsx (NOVO ARQUIVO)

import React, { useState, useEffect } from 'react';
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

// Opções de Status baseadas no models.py
const statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'evadido', label: 'Evadido' },
    { value: 'transferido', label: 'Transferido' },
    { value: 'concluido', label: 'Concluído' },
];

function AdicionarAluno() {
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [status, setStatus] = useState('ativo');
  const [turmas, setTurmas] = useState([]); // Para carregar a lista de turmas
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('authToken');

  // Busca a lista de turmas para o dropdown
  useEffect(() => {
    const apiUrlTurmas = 'http://127.0.0.1:8000/pedagogico/api/turmas/';
    axios.get(apiUrlTurmas, { headers: { 'Authorization': `Token ${token}` } })
      .then(response => {
        setTurmas(response.data);
      })
      .catch(err => {
        setError('Não foi possível carregar a lista de turmas.');
      });
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const alunoData = {
      usuario: parseInt(usuarioId),
      turma: parseInt(turmaId),
      status: status,
    };

    try {
      const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/alunos/';
      
      await axios.post(apiUrl, alunoData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setSuccess('Perfil de aluno criado e vinculado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/alunos'); // Volta para a lista de alunos
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar aluno:", err);
      if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para criar alunos.');
      } else if (err.response && err.response.data.usuario) {
          setError('Erro: ' + err.response.data.usuario[0]); // Ex: "Este usuário já tem um perfil de aluno."
      } else {
          setError('Erro ao criar aluno. Verifique se os IDs de Usuário e Turma estão corretos.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Criar Perfil de Aluno
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Nota: Você deve primeiro criar um Usuário (com cargo 'aluno') no Admin do Django. Esta página vincula esse usuário a uma turma.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="ID do Usuário"
            type="number"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
            fullWidth
            margin="normal"
            helperText="O ID do usuário que você criou no admin."
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="turma-label">Turma</InputLabel>
            <Select
              labelId="turma-label"
              value={turmaId}
              label="Turma"
              onChange={(e) => setTurmaId(e.target.value)}
            >
              <MenuItem value=""><em>Selecione a turma</em></MenuItem>
              {turmas.map((turma) => (
                <MenuItem key={turma.id} value={turma.id}>
                  {turma.nome} ({turma.turno_display})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
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
              Salvar Aluno
            </Button>
            <Button variant="outlined" onClick={() => navigate('/alunos')}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarAluno;