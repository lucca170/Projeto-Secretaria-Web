// Em: frontend/src/components/EditarNotasModal.jsx (MODIFICADO)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Alert
} from '@mui/material';

const token = localStorage.getItem('authToken');
const apiUrl = 'http://127.0.0.1:8000/pedagogico/api';
const bimestres = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

function EditarNotasModal({ open, onClose, alunoId, alunoNome, turmaId, turmaNome }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [notas, setNotas] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    if (!open || !alunoId || !turmaId) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Buscar disciplinas (O backend agora filtra por permissão)
      const disciplinasRes = await axios.get(`${apiUrl}/disciplinas/?turma_id=${turmaId}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setDisciplinas(disciplinasRes.data);

      // 2. Buscar TODAS as notas do aluno (A API de notas também filtra por permissão)
      const notasRes = await axios.get(`${apiUrl}/notas/?aluno_id=${alunoId}`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      // 3. Mapear as notas
      const notasMap = {};
      for (const nota of notasRes.data) {
        if (!notasMap[nota.disciplina]) {
          notasMap[nota.disciplina] = {};
        }
        notasMap[nota.disciplina][nota.bimestre] = {
          id: nota.id,
          valor: nota.valor
        };
      }
      setNotas(notasMap);

    } catch (err) {
      console.error("Erro ao buscar dados para o modal:", err);
      setError("Não foi possível carregar os dados de notas.");
    } finally {
      setLoading(false);
    }
  }, [open, alunoId, turmaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // (handleNotaChange não muda)
  const handleNotaChange = (disciplinaId, bimestre, valor) => {
    const valorNumerico = valor === '' ? '' : parseFloat(valor);
    if (valorNumerico !== '' && (valorNumerico < 0 || valorNumerico > 10)) {
      return;
    }
    setNotas(prevNotas => {
      const disciplinaNotas = prevNotas[disciplinaId] || {};
      const notaAtual = disciplinaNotas[bimestre] || {};
      return {
        ...prevNotas,
        [disciplinaId]: {
          ...disciplinaNotas,
          [bimestre]: {
            ...notaAtual, 
            valor: valorNumerico
          }
        }
      };
    });
  };

  // (handleSave não muda)
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    const payload = [];

    for (const disciplina of disciplinas) {
      for (const bimestre of bimestres) {
        const notaObj = notas[disciplina.id] ? notas[disciplina.id][bimestre] : null;

        if (notaObj && (notaObj.valor !== null && notaObj.valor !== '')) {
          payload.push({
            id: notaObj.id || null, 
            aluno: alunoId,
            disciplina: disciplina.id,
            bimestre: bimestre,
            valor: notaObj.valor
          });
        }
      }
    }

    if (payload.length === 0) {
      setSuccess("Nenhuma nota para salvar.");
      setSaving(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/notas/bulk_update_notas/`, payload, {
        headers: { 'Authorization': `Token ${token}` }
      });
      
      if (response.status === 207 && response.data.erros && response.data.erros.length > 0) {
          setError(`Erro: ${response.data.erros[0]}`);
      } else {
          setSuccess('Notas salvas com sucesso!');
      }
      fetchData(); 
    } catch (err) {
      console.error("Erro ao salvar notas:", err);
      if (err.response && err.response.data && err.response.data.erros) {
        setError(`Erro: ${err.response.data.erros[0]}`);
      } else {
        setError('Erro ao salvar notas. Verifique os valores.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose(); 
    setSuccess('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        Lançar Notas
        <Typography variant="body1" color="text.secondary">
          Aluno: {alunoNome} (Turma: {turmaNome})
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : error && !saving ? ( 
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '60vh' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: '200px' }}>Disciplina</TableCell>
                  {bimestres.map(b => <TableCell key={b} align="center" sx={{ fontWeight: 'bold' }}>{b}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {disciplinas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography sx={{p: 2, textAlign: 'center'}}>
                        Nenhuma disciplina encontrada para esta turma (ou você não está alocado em nenhuma disciplina desta turma).
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {disciplinas.map((disciplina, index) => (
                  <TableRow 
                    key={disciplina.id} 
                    hover
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: (theme) => theme.palette.action.hover, } }}
                  >
                    <TableCell component="th" scope="row">
                      {/* --- ALTERADO --- */}
                      <Typography variant="body2" fontWeight="bold">
                        {disciplina.materia_nome}
                      </Typography>
                      {/* --- ALTERADO --- */}
                      <Typography variant="caption" color="text.secondary">
                        Profs: {disciplina.professores_nomes.join(', ') || 'N/A'}
                      </Typography>
                    </TableCell>
                    {bimestres.map(bimestre => {
                      const notaObj = (notas[disciplina.id] && notas[disciplina.id][bimestre]) 
                                      ? notas[disciplina.id][bimestre] 
                                      : { valor: '' };
                      return (
                        <TableCell key={bimestre} align="center">
                          <TextField
                            type="number"
                            value={notaObj.valor}
                            onChange={(e) => handleNotaChange(disciplina.id, bimestre, e.target.value)}
                            inputProps={{ step: "0.1", min: "0", max: "10" }}
                            sx={{ width: '90px' }}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 1, justifyContent: 'space-between' }}>
        <Box flexGrow={1}>
            {error && <Alert severity="error" sx={{maxWidth: 400}}>{error}</Alert>}
            {success && <Alert severity="success" sx={{maxWidth: 400}}>{success}</Alert>}
        </Box>
        <Button onClick={handleClose} color="secondary" disabled={saving}>
          Fechar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={saving || loading}>
          {saving ? <CircularProgress size={24} /> : "Salvar Alterações"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditarNotasModal;