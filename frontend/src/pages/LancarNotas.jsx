// Em: frontend/src/pages/LancarNotas.jsx (NOVO ARQUIVO)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

// Hook para buscar o token
const useAuthToken = () => {
    return localStorage.getItem('authToken');
};

function LancarNotas() {
  const token = useAuthToken();
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [notas, setNotas] = useState({}); // Objeto para mapear {alunoId: {bimestre: notaObj}}
  
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState('');
  const [selectedBimestre, setSelectedBimestre] = useState('1º Bimestre');
  
  const [loading, setLoading] = useState(true);
  const [loadingNotas, setLoadingNotas] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bimestres = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
  const apiUrl = 'http://127.0.0.1:8000/pedagogico/api';

  // 1. Busca as disciplinas do professor logado
  useEffect(() => {
    setLoading(true);
    axios.get(`${apiUrl}/disciplinas/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      setDisciplinas(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Erro ao buscar disciplinas:", err);
      setError('Não foi possível carregar suas disciplinas.');
      setLoading(false);
    });
  }, [token]);

  // 2. Busca alunos da turma e as notas da disciplina/bimestre selecionados
  const fetchAlunosENotas = useCallback(async (disciplinaId, bimestre) => {
    if (!disciplinaId || !bimestre) return;

    setLoadingNotas(true);
    setError('');
    setAlunos([]);
    setNotas({});

    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    if (!disciplina) return;

    try {
      // Busca os alunos da turma
      const alunosRes = await axios.get(`${apiUrl}/turmas/${disciplina.turma}/detalhe_com_alunos/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setAlunos(alunosRes.data.alunos || []);

      // Busca as notas já existentes
      const notasRes = await axios.get(`${apiUrl}/notas/?disciplina_id=${disciplinaId}&bimestre=${bimestre}`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      // Mapeia as notas para fácil acesso
      const notasMap = {};
      for (const nota of notasRes.data) {
        if (!notasMap[nota.aluno]) {
            notasMap[nota.aluno] = {};
        }
        notasMap[nota.aluno][nota.bimestre] = {
            id: nota.id,
            valor: nota.valor
        };
      }
      setNotas(notasMap);

    } catch (err) {
      console.error("Erro ao buscar alunos ou notas:", err);
      setError('Não foi possível carregar os dados da turma.');
    } finally {
      setLoadingNotas(false);
    }
  }, [token, disciplinas, apiUrl]); // Depende de 'disciplinas'

  // 3. Atualiza a busca quando os filtros mudam
  useEffect(() => {
    if (selectedDisciplinaId && selectedBimestre) {
      fetchAlunosENotas(selectedDisciplinaId, selectedBimestre);
    }
  }, [selectedDisciplinaId, selectedBimestre, fetchAlunosENotas]);


  // 4. Manipula a mudança no input de nota
  const handleNotaChange = (alunoId, valor) => {
    const valorNumerico = valor === '' ? '' : parseFloat(valor);

    // Validação simples (0-10)
    if (valorNumerico !== '' && (valorNumerico < 0 || valorNumerico > 10)) {
        return; 
    }

    setNotas(prevNotas => {
        const alunoNotas = prevNotas[alunoId] || {};
        const notaAtual = alunoNotas[selectedBimestre] || {};
        
        return {
            ...prevNotas,
            [alunoId]: {
                ...alunoNotas,
                [selectedBimestre]: {
                    ...notaAtual, // Mantém o 'id' se existir
                    valor: valorNumerico 
                }
            }
        };
    });
  };

  // 5. Salva os dados (Cria ou Atualiza)
  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = [];

    // Monta o payload para a API de bulk_update
    for (const aluno of alunos) {
        const notaAluno = notas[aluno.id] ? notas[aluno.id][selectedBimestre] : null;

        if (notaAluno && (notaAluno.valor !== null && notaAluno.valor !== '')) {
            payload.push({
                id: notaAluno.id || null, // ID da nota (se já existe)
                aluno: aluno.id,
                disciplina: selectedDisciplinaId,
                bimestre: selectedBimestre,
                valor: notaAluno.valor
            });
        }
    }

    if (payload.length === 0) {
        setSuccess("Nenhuma nota para salvar.");
        setSaving(false);
        return;
    }

    try {
      await axios.post(`${apiUrl}/notas/bulk_update_notas/`, payload, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setSuccess('Notas salvas com sucesso!');
      
      // Recarrega as notas para pegar os IDs
      fetchAlunosENotas(selectedDisciplinaId, selectedBimestre); 

    } catch (err) {
      console.error("Erro ao salvar notas:", err);
      setError('Erro ao salvar notas. Verifique os valores.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lançamento de Notas
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="disciplina-label">Disciplina</InputLabel>
            <Select
              labelId="disciplina-label"
              value={selectedDisciplinaId}
              label="Disciplina"
              onChange={(e) => setSelectedDisciplinaId(e.target.value)}
            >
              <MenuItem value=""><em>Selecione...</em></MenuItem>
              {disciplinas.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.nome} ({d.turma_nome})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="bimestre-label">Bimestre</InputLabel>
            <Select
              labelId="bimestre-label"
              value={selectedBimestre}
              label="Bimestre"
              onChange={(e) => setSelectedBimestre(e.target.value)}
            >
              {bimestres.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loadingNotas ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : alunos.length > 0 ? (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Aluno (ID)</TableCell>
                    <TableCell>Aluno (Nome)</TableCell>
                    <TableCell align="right">Nota</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alunos.map((aluno) => {
                    const notaObj = (notas[aluno.id] && notas[aluno.id][selectedBimestre]) 
                                    ? notas[aluno.id][selectedBimestre] 
                                    : { valor: '' };
                    
                    return (
                        <TableRow key={aluno.id}>
                            <TableCell>{aluno.id}</TableCell>
                            <TableCell>{aluno.nome}</TableCell>
                            <TableCell align="right">
                            <TextField
                                type="number"
                                value={notaObj.valor}
                                onChange={(e) => handleNotaChange(aluno.id, e.target.value)}
                                inputProps={{ 
                                    step: "0.1", 
                                    min: "0", 
                                    max: "10" 
                                }}
                                sx={{ width: '100px' }}
                                size="small"
                            />
                            </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving ? <CircularProgress size={24} /> : "Salvar Notas"}
                </Button>
            </Box>
          </>
        ) : (
            selectedDisciplinaId && <Typography>Nenhum aluno ativo encontrado para esta turma.</Typography>
        )}

      </Paper>
    </Container>
  );
}

export default LancarNotas;