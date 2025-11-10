// Em: frontend/src/pages/VerificarCodigo.jsx (NOVO ARQUIVO)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Container, 
    Paper,
    CssBaseline,
    Link as MuiLink,
    CircularProgress,
    Alert,
    Grid
} from '@mui/material';

const imageUrl = '/dashboard-bg.png';

// Hook para pegar o e-mail da URL (ex: ?email=teste@teste.com)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function VerificarCodigo({ onLoginSuccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get('email'); // Pega o e-mail da URL

  useEffect(() => {
    if (!email) {
      setError("E-mail não fornecido. Volte e tente novamente.");
    }
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const apiUrl = 'http://127.0.0.1:8000/api/password-reset-login/';
      
      // Envia o e-mail e o código para a nova API
      const response = await axios.post(apiUrl, { 
        email: email,
        code: code
      });

      setSuccess('Login efetuado com sucesso! Redirecionando...');
      
      // --- LOGIN ---
      // A resposta da API é a mesma do login normal
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      // Chama a função do App.jsx para atualizar o estado
      onLoginSuccess();
      
      // Redireciona para o Home
      navigate('/dashboard');

    } catch (err) {
      console.error("Erro ao verificar código:", err);
      setError(err.response?.data?.erro || 'Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <Paper 
          elevation={6} 
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <img 
            src="/logo1.png" // O logo que você pediu
            alt="Logo" 
            style={{ height: '80px', marginBottom: '16px' }} 
          />
          
          <Typography component="h1" variant="h5">
            Verificar Código
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Digite o código de 6 dígitos que enviamos para {email}.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Código de 6 dígitos"
              name="code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading || !email}
              inputProps={{ 
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem' } 
              }}
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 1, width: '100%' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 1, width: '100%' }}>
                {success}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email || code.length < 6}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verificar e Entrar'}
            </Button>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink 
                  component={RouterLink} 
                  to="/esqueci-senha" 
                  variant="body2"
                >
                  Não recebeu? Enviar novamente
                </MuiLink>
              </Grid>
            </Grid>
            
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default VerificarCodigo;