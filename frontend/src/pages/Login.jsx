// Em: frontend/src/pages/Login.jsx (VERSÃO ATUALIZADA)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Container, 
    Paper, // <-- Adicionado
    CssBaseline, // <-- Adicionado
    InputAdornment, // <-- Adicionado
    Link as MuiLink, // <-- Adicionado
    Grid // <-- Adicionado
} from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material'; // <-- Ícones

// A URL da imagem de fundo do seu dashboard
const imageUrl = '/dashboard-bg.png';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // A lógica de handleSubmit (login) permanece a mesma
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const loginUrl = 'http://127.0.0.1:8000/api/login/'; 

      const response = await axios.post(loginUrl, {
        username: username,
        password: password,
      });

      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      onLoginSuccess();

    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response && err.response.status === 400) {
        setError('Usuário ou senha inválidos.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login.');
      }
    }
  };

  return (
    // Container principal que cobre toda a tela
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        {/* "Card" de login */}
        <Paper 
          elevation={6} 
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2, // Bordas levemente arredondadas
          }}
        >
          {/* Logo da Escola */}
          <img 
            src="/logo1.png" // <--- MUDANÇA REALIZADA AQUI
            alt="Logo SESI" 
            style={{ height: '80px', marginBottom: '16px' }} 
          />
          
          <Typography component="h1" variant="h5">
            Secretaria Web
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário (CPF)"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            
            {error && (
              <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            
            {/* --- LINK "ESQUECI SENHA" ADICIONADO --- */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink 
                  component={RouterLink} 
                  to="/esqueci-senha" 
                  variant="body2"
                >
                  Esqueci minha senha
                </MuiLink>
              </Grid>
            </Grid>
            
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;