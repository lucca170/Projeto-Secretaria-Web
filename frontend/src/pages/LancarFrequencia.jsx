// Em: frontend/src/pages/LancarFrequencia.jsx (NOVO ARQUIVO)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Button,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider
} from '@mui/material';
import './LancarFrequencia.css'; // Vamos criar este arquivo a seguir

// Função para pegar a data de hoje no formato YYYY-MM-DD
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

function LancarFrequencia() {
  const { turmaId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const apiUrl = 'http://127.0.0.1:8000/pedagogico/api';

  // Estados dos dados
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  // Estados do formulário
  const [dataSelecionada, setDataSelecionada] = useState(getTodayDate());
  const [disciplinaId, setDisciplinaId] = useState('');
  const [alunosAusentes, setAlunosAusentes] = useState(new Set()); // Guarda os IDs dos ausentes

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Busca inicial (alunos e disciplinas da turma)
  useEffect(() => {
    const fetchDadosDaTurma = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { 'Authorization': `Token ${token}` };
        
        // 1. Buscar detalhes da turma e alunos
        const urlAlunos = `${apiUrl}/turmas/${turmaId}/detalhe_com_alunos/`;
        const resAlunos = await axios.get(urlAlunos, { headers });
        setTurma(resAlunos.data.turma);
        setAlunos(resAlunos.data.alunos);

        // 2. Buscar disciplinas da turma
        const urlDisciplinas = `${apiUrl}/disciplinas/?turma_id=${turmaId}`;
        const resDisciplinas = await axios.get(urlDisciplinas, { headers });
        setDisciplinas(resDisciplinas.data);

      } catch (err) {
        console.error("Erro ao buscar dados da turma:", err);
        setError("Não foi possível carregar os dados da turma. Você tem permissão para esta turma?");
      } finally {
        setLoading(false);
      }
    };

    fetchDadosDaTurma();
  }, [turmaId, token]);

  // Função para marcar/desmarcar aluno
  const handleToggleAluno = (alunoId) => {
    setAlunosAusentes(prevAusentes => {
      const novosAusentes = new Set(prevAusentes);
      if (novosAusentes.has(alunoId)) {
        novosAusentes.delete(alunoId);
      } else {
        novosAusentes.add(alunoId);
      }
      return novosAusentes;
    });
  };

  // Função de envio para a API
  const handleSubmit = async () => {
    if (!disciplinaId) {
      setError("Por favor, selecione uma disciplina.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      data: dataSelecionada,
      disciplina_id: disciplinaId,
      alunos_ausentes_ids: Array.from(alunosAusentes),
    };

    try {
      const urlLancar = `${apiUrl}/faltas/lancar/`;
      const response = await axios.post(urlLancar, payload, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setSuccess(response.data.sucesso || "Frequência salva com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar frequência:", err);
      const errorMsg = err.response?.data?.erro || "Erro ao salvar. Verifique os dados e sua permissão.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lançar Frequência
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Turma: {turma?.nome}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* --- Formulário de Seleção --- */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="disciplina-label">Disciplina</InputLabel>
              <Select
                labelId="disciplina-label"
                value={disciplinaId}
                label="Disciplina"
                onChange={(e) => setDisciplinaId(e.target.value)}
              >
                {disciplinas.length > 0 ? (
                  disciplinas.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.materia_nome} ({d.professores_nomes.join(', ')})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Nenhuma disciplina encontrada</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Data da Aula"
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* --- Lista de Alunos --- */}
        <Typography variant="h6" gutterBottom>
          Lista de Alunos (Marque os Ausentes)
        </Typography>
        <Paper variant="outlined" sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <List dense className="lista-frequencia">
            {alunos.map((aluno) => (
              <ListItem
                key={aluno.id}
                button
                onClick={() => handleToggleAluno(aluno.id)}
              >
                <Checkbox
                  edge="start"
                  checked={alunosAusentes.has(aluno.id)}
                  tabIndex={-1}
                  disableRipple
                  color="error"
                />
                <ListItemText primary={aluno.nome} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* --- Feedback e Ações --- */}
        <Box sx={{ mt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/turmas/${turmaId}`)}
              disabled={isSubmitting}
            >
              Voltar para Turma
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !disciplinaId || loading}
              sx={{ minWidth: '180px' }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : `Salvar Frequência (${alunosAusentes.size} Ausentes)`}
            </Button>
          </Box>
        </Box>

      </Paper>
    </Container>
  );
}

export default LancarFrequencia;