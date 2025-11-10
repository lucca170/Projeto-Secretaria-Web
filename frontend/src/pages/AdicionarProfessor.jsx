// Em: frontend/src/pages/AdicionarProfessor.jsx (NOVO ARQUIVO)

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
  CircularProgress,
  Grid
} from '@mui/material';

function AdicionarProfessor() {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState(''); // Será o 'username'
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const professorData = {
      username: cpf, // CPF vai para o campo username
      first_name: firstName,
      last_name: lastName,
      email: email,
      cargo: 'professor', // Define o cargo automaticamente
    };

    try {
      // POST para a API de /api/users/ (UserViewSet)
      const apiUrl = 'http://127.0.0.1:8000/api/users/';
      
      const response = await axios.post(apiUrl, professorData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      const tempPassword = response.data.temp_password;

      setSuccess(`Professor criado com sucesso! A senha temporária é: ${tempPassword}`);
      // Não limpa o formulário para o admin poder copiar a senha

    } catch (err) {
      console.error("Erro ao criar professor:", err);
      if (err.response && err.response.data && err.response.data.username) {
          setError('Erro: ' + err.response.data.username[0]); // ex: "A user with that username already exists."
      } else if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para criar usuários.');
      } else {
          setError('Erro ao criar professor. Verifique todos os campos.');
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Criar Novo Professor
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Isso criará um novo Usuário (cargo 'professor') com uma senha aleatória.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required fullWidth margin="normal"
                disabled={isSubmitting || !!success}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required fullWidth margin="normal"
                disabled={isSubmitting || !!success}
              />
            </Grid>
          </Grid>
          
          <TextField
            label="CPF (será o login)"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required fullWidth margin="normal"
            helperText="O CPF será usado como username para o login."
            disabled={isSubmitting || !!success}
          />

          <TextField
            label="Email (Opcional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth margin="normal"
            disabled={isSubmitting || !!success}
          />
          
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
              disabled={isSubmitting || !!success}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Salvar Professor"}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/professores')} 
              disabled={isSubmitting}
            >
              {success ? 'Voltar para Lista' : 'Cancelar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarProfessor;