import React, { useState } from 'react';
// REMOVEMOS: useAuth
// import { useNavigate } from 'react-router-dom'; // Já não precisa aqui
import { Box, TextField, Button, Typography, Container } from '@mui/material';

function Login({ onLoginSuccess }) { // Recebe onLoginSuccess do App.jsx
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // REMOVEMOS: login e navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      // **** SIMULAÇÃO DE LOGIN ****
      // SUBSTITUA pela sua chamada real à API de login depois
      if (username === 'admin' && password === 'admin') { // Exemplo simples
          console.log("Simulando login bem-sucedido...");
          onLoginSuccess(); // Chama a função passada pelo App para marcar como logado
          // O App.jsx vai cuidar do redirecionamento
      } else {
        setError('Usuário ou senha inválidos (teste: admin/admin).');
      }
      // **** FIM DA SIMULAÇÃO ****

    } catch (err) {
      console.error("Erro na simulação de login:", err);
      setError('Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login - Secretaria Web
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        </Box>
      </Box>
    </Container>
  );
}

export default Login;