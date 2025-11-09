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
<<<<<<< HEAD
  Grid,
  Alert, // <-- 1. IMPORTADO
  CircularProgress // <-- 2. IMPORTADO
=======
  Grid // <-- ADICIONADO
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
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
  
<<<<<<< HEAD
=======
  // --- NOVOS ESTADOS DO FORMULÁRIO ---
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [status, setStatus] = useState('ativo');
<<<<<<< HEAD
  
  const [turmas, setTurmas] = useState([]); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('authToken');
  
  // --- 3. ESTADO DE SUBMISSÃO ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Busca a lista de turmas
=======
  // ------------------------------------
  
  const [turmas, setTurmas] = useState([]); // Para carregar a lista de turmas
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('authToken');

  // Busca a lista de turmas (continua igual)
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
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
<<<<<<< HEAD
    setIsSubmitting(true); // <-- 4. ATIVA O SPINNER

=======

    // --- NOVOS DADOS DO ALUNO ---
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    const alunoData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
<<<<<<< HEAD
      cpf: cpf, 
      turma: parseInt(turmaId),
      status: status,
    };
=======
      cpf: cpf, // O backend usará isso como 'username'
      turma: parseInt(turmaId),
      status: status,
    };
    // ---------------------------
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

    try {
      const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/alunos/';
      
<<<<<<< HEAD
      // --- 5. CAPTURA A RESPOSTA ---
      const response = await axios.post(apiUrl, alunoData, {
=======
      await axios.post(apiUrl, alunoData, {
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
        headers: {
          'Authorization': `Token ${token}`
        }
      });
<<<<<<< HEAD
      
      // --- 6. PEGA A SENHA DA RESPOSTA ---
      const tempPassword = response.data.temp_password;

      // --- 7. MOSTRA A SENHA NA MENSAGEM DE SUCESSO ---
      setSuccess(`Aluno criado com sucesso! A senha temporária é: ${tempPassword}`);
      
      // (Não há mais redirecionamento automático)
=======

      setSuccess('Aluno e Usuário criados com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/alunos'); // Volta para a lista de alunos
      }, 2000);
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

    } catch (err) {
      console.error("Erro ao criar aluno:", err);
      if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para criar alunos.');
      } else if (err.response && err.response.data && err.response.data.cpf) {
<<<<<<< HEAD
          setError('Erro: ' + err.response.data.cpf[0]); 
=======
          setError('Erro: ' + err.response.data.cpf[0]); // Ex: "Já existe um usuário com este CPF."
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
      } else if (err.response && err.response.data && err.response.data.detail) {
          setError('Erro: ' + err.response.data.detail);
      } else {
          setError('Erro ao criar aluno. Verifique todos os campos.');
      }
<<<<<<< HEAD
    } finally {
        setIsSubmitting(false); // <-- 8. DESATIVA O SPINNER
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Criar Novo Aluno
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
<<<<<<< HEAD
          Isso criará um novo Usuário (cargo 'aluno') com uma senha aleatória e o perfil de Aluno vinculado.
=======
          Isso criará um novo Usuário (cargo 'aluno') com senha padrão '12345678' e o perfil de Aluno vinculado.
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
<<<<<<< HEAD
                required fullWidth margin="normal"
                disabled={isSubmitting || !!success} // <-- Desabilita após sucesso
=======
                required
                fullWidth
                margin="normal"
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
<<<<<<< HEAD
                required fullWidth margin="normal"
                disabled={isSubmitting || !!success} // <-- Desabilita após sucesso
=======
                required
                fullWidth
                margin="normal"
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
              />
            </Grid>
          </Grid>
          
          <TextField
            label="CPF (será o login)"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
<<<<<<< HEAD
            required fullWidth margin="normal"
            helperText="O CPF será usado como username para o login."
            disabled={isSubmitting || !!success} // <-- Desabilita após sucesso
=======
            required
            fullWidth
            margin="normal"
            helperText="O CPF será usado como username para o login."
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
          />

          <TextField
            label="Email (Opcional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
            fullWidth margin="normal"
            disabled={isSubmitting || !!success} // <-- Desabilita após sucesso
=======
            fullWidth
            margin="normal"
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="turma-label">Turma</InputLabel>
            <Select
              labelId="turma-label"
              value={turmaId}
              label="Turma"
              onChange={(e) => setTurmaId(e.target.value)}
<<<<<<< HEAD
              disabled={isSubmitting || !!success} // <-- Desabilita após sucesso
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
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
<<<<<<< HEAD
              disabled={isSubmitting || !!success} // <-- Desabilita após sucesso
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
<<<<<<< HEAD
          {/* --- 9. FEEDBACK COM ALERTS --- */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, mb: 2, '.MuiAlert-message': { fontSize: '1.1rem', wordBreak: 'break-all' } }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={isSubmitting || !!success} // <-- Desabilita no envio ou sucesso
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Salvar Aluno"}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/alunos')} 
              disabled={isSubmitting} // <-- Só desabilita durante o envio
            >
              {success ? 'Voltar para Lista' : 'Cancelar'}
=======
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
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarAluno;