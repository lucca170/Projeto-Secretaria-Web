// Em: frontend/src/pages/AdicionarEvento.jsx

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
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

// Opções baseadas no seu modelo EventoAcademico (escola/pedagogico/models.py)
const tiposDeEvento = [
  { value: 'prova', label: 'Prova' },
  { value: 'trabalho', label: 'Entrega de Trabalho' },
  { value: 'feriado', label: 'Feriado' },
  { value: 'evento', label: 'Evento Escolar' },
  { value: 'reuniao', label: 'Reunião' },
];

function AdicionarEvento() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [descricao, setDescricao] = useState('');
  const [turmaId, setTurmaId] = useState(''); // ID da Turma
  const [disciplinaId, setDisciplinaId] = useState(''); // ID da Disciplina
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pega o token do localStorage (definido no App.jsx/Login.jsx)
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Formata as datas para o formato ISO que o Django espera
    const formatarData = (data) => {
        if (!data) return null;
        return new Date(data).toISOString();
    }

    const eventoData = {
      titulo,
      tipo,
      data_inicio: formatarData(dataInicio),
      data_fim: formatarData(dataFim) || null, // data_fim pode ser nula
      descricao,
      // Envia os IDs como null se estiverem vazios
      turma: turmaId ? parseInt(turmaId) : null,
      disciplina: disciplinaId ? parseInt(disciplinaId) : null,
    };

    try {
      // URL da API (de escola/pedagogico/urls.py)
      const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/eventos-academicos/';
      
      await axios.post(apiUrl, eventoData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      setSuccess('Evento criado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/calendario'); // Volta para o calendário
      }, 2000);

    } catch (err) {
      console.error("Erro ao criar evento:", err);
      if (err.response && err.response.status === 403) {
          setError('Você não tem permissão para criar eventos.');
      } else {
          setError('Erro ao criar evento. Verifique os campos.');
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Adicionar Novo Evento Acadêmico
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Título do Evento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="tipo-evento-label">Tipo de Evento</InputLabel>
            <Select
              labelId="tipo-evento-label"
              value={tipo}
              label="Tipo de Evento"
              onChange={(e) => setTipo(e.target.value)}
            >
              {tiposDeEvento.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data e Hora de Início"
            type="datetime-local"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Data e Hora de Fim (Opcional)"
            type="datetime-local"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Descrição (Opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />

          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Vincular (Opcional):
          </Typography>
          
          <TextField
            label="ID da Turma (Opcional)"
            type="number"
            value={turmaId}
            onChange={(e) => setTurmaId(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="ID da Disciplina (Opcional)"
            type="number"
            value={disciplinaId}
            onChange={(e) => setDisciplinaId(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          {/* Feedback */}
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
              Salvar Evento
            </Button>
            <Button variant="outlined" onClick={() => navigate('/calendario')}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarEvento;