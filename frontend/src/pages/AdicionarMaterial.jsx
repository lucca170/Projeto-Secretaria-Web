// Em: frontend/src/pages/AdicionarMaterial.jsx (NOVO ARQUIVO)

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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

function AdicionarMaterial() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [disponivel, setDisponivel] = useState(true); // Padrão 'true'
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const materialData = {
      nome,
      tipo,
      quantidade: parseInt(quantidade) || 0,
      disponivel,
    };

    try {
      const apiUrl = 'http://127.0.0.1:8000/coordenacao/api/materiais/';
      
      await axios.post(apiUrl, materialData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setSuccess('Material criado com sucesso! Redirecionando...');
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/materiais'); // Volta para a lista de materiais
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar material:", err);
      if (err.response && err.response.data) {
         const errors = Object.values(err.response.data).join(', ');
         setError(`Erro ao criar material: ${errors}`);
      } else if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para adicionar materiais.');
      } else {
         setError('Erro ao criar material. Verifique os campos.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Adicionar Novo Material Didático
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nome do Material"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={isSubmitting}
          />
          
          <TextField
            label="Tipo (ex: Projetor, Livro, Bola)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={isSubmitting}
          />

          <TextField
            label="Quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { min: 0 } }}
            disabled={isSubmitting}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="disponivel-label">Disponível</InputLabel>
            <Select
              labelId="disponivel-label"
              value={disponivel}
              label="Disponível"
              onChange={(e) => setDisponivel(e.target.value)}
              disabled={isSubmitting}
            >
              <MenuItem value={true}>Sim</MenuItem>
              <MenuItem value={false}>Não (ex: em manutenção)</MenuItem>
            </Select>
          </FormControl>
          
          {error && ( <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> )}
          {success && ( <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert> )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : "Salvar Material"}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/materiais')} disabled={isSubmitting}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarMaterial;