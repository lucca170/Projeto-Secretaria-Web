// Em: frontend/src/pages/EsqueciSenha.jsx (CÓDIGO COMPLETO)

import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Container, 
    Paper,
    CssBaseline,
    InputAdornment,
    Link as MuiLink,
    CircularProgress,
    Alert,
    Grid
} from '@mui/material';
import { Email } from '@mui/icons-material';

const imageUrl = '/dashboard-bg.png';

function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const apiUrl = 'http://127.0.0.1:8000/api/password-reset/';
      const response = await axios.post(apiUrl, { email: email });

      setSuccess(response.data.sucesso || 'Solicitação enviada com sucesso!');
      
      // Redireciona para a página de verificação
      setTimeout(() => {
        navigate(`/verificar-codigo?email=${encodeURIComponent(email)}`);
      }, 2000); 
      
    } catch (err) {
      console.error("Erro ao solicitar redefinição:", err);
      setError(err.response?.data?.erro || 'Ocorreu um erro. Tente novamente.');
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
      <Container component="main" maxWidth="xs"> {/* <-- Esta linha estava cortada */}
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
            src="/logo1.png"
            alt="Logo" 
            style={{ height: '80px', marginBottom: '16px' }} 
          />
          
          <Typography component="h1" variant="h5">
            Recuperar Acesso
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Digite seu e-mail para enviarmos um código de recuperação.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!success}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
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
              disabled={loading || !!success}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Enviar Código'}
            </Button>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink 
                  component={RouterLink} 
                  to="/login" 
                  variant="body2"
                >
                Voltar para Login
                </MuiLink>
              </Grid>
            </Grid>
            
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default EsqueciSenha;