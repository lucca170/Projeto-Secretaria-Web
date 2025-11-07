// Em: frontend/src/pages/AdicionarAluno.jsx (ARQUIVO MODIFICADO)

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
  FormControl,
  Grid // <-- ADICIONADO
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
  
  // --- NOVOS ESTADOS DO FORMULÁRIO ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [status, setStatus] = useState('ativo');
  // ------------------------------------
  
  const [turmas, setTurmas] = useState([]); // Para carregar a lista de turmas
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('authToken');

  // Busca a lista de turmas (continua igual)
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

    // --- NOVOS DADOS DO ALUNO ---
    const alunoData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      cpf: cpf, // O backend usará isso como 'username'
      turma: parseInt(turmaId),
      status: status,
    };
    // ---------------------------

    try {
      const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/alunos/';
      
      await axios.post(apiUrl, alunoData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setSuccess('Aluno e Usuário criados com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/alunos'); // Volta para a lista de alunos
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar aluno:", err);
      if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para criar alunos.');
      } else if (err.response && err.response.data && err.response.data.cpf) {
          setError('Erro: ' + err.response.data.cpf[0]); // Ex: "Já existe um usuário com este CPF."
      } else if (err.response && err.response.data && err.response.data.detail) {
          setError('Erro: ' + err.response.data.detail);
      } else {
          setError('Erro ao criar aluno. Verifique todos os campos.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Criar Novo Aluno
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Isso criará um novo Usuário (cargo 'aluno') com senha padrão '12345678' e o perfil de Aluno vinculado.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          
          <TextField
            label="CPF (será o login)"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            fullWidth
            margin="normal"
            helperText="O CPF será usado como username para o login."
          />

          <TextField
            label="Email (Opcional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
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