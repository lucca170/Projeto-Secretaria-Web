import React, { useState } from 'react';
import axios from 'axios'; // Certifique-se de importar axios

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
      // URL do seu endpoint de login customizado
      const loginUrl = 'http://127.0.0.1:8000/api/login/'; // Ou a URL correta do seu backend

      const response = await axios.post(loginUrl, {
        username: username,
        password: password,
      });

      // Assumindo que sua API retorna { token: '...', user: {...} }
      const { token, user } = response.data;

      // --- Gerenciamento de Autenticação ---
      // 1. Armazene o token (localStorage é comum, mas considere segurança)
      localStorage.setItem('authToken', token);
      // 2. Armazene dados do usuário se necessário (opcional)
      localStorage.setItem('userData', JSON.stringify(user));
      // 3. Configure o header Authorization para futuras requisições Axios
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      // 4. Chame a função para atualizar o estado no App.jsx
      onLoginSuccess();

    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response && err.response.status === 400) {
        setError('Usuário ou senha inválidos.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Verifique a conexão ou as credenciais.');
      }
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