// Em: frontend/src/pages/RelatoriosGerenciais.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, 
    Typography, 
    Paper, 
    Box, 
    CircularProgress, 
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid
} from '@mui/material';

const token = localStorage.getItem('authToken');

function RelatoriosGerenciais() {
  const [relatorioTaxas, setRelatorioTaxas] = useState([]);
  const [relatorioFaltas, setRelatorioFaltas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRelatorios = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = { 'Authorization': `Token ${token}` };
        
        const [resTaxas, resFaltas] = await Promise.all([
          axios.get('http://127.0.0.1:8000/pedagogico/relatorio/gerencial/', { headers }),
          axios.get('http://127.0.0.1:8000/pedagogico/relatorio/faltas/', { headers })
        ]);
        
        setRelatorioTaxas(resTaxas.data);
        setRelatorioFaltas(resFaltas.data);
        
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
        setError('Você não tem permissão para ver estes relatórios ou ocorreu um erro.');
      } finally {
        setLoading(false);
      }
    };
    fetchRelatorios();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Relatório de Taxas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Taxas por Turma</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Turma</TableCell>
                    <TableCell align="right">Aprovação</TableCell>
                    <TableCell align="right">Evasão</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relatorioTaxas.map((item) => (
                    <TableRow key={item.turma.id}>
                      <TableCell>{item.turma.nome}</TableCell>
                      <TableCell align="right">{item.taxa_aprovacao}</TableCell>
                      <TableCell align="right">{item.taxa_evasao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Relatório de Faltas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Relatório Geral de Faltas</Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Aluno (CPF)</TableCell>
                    <TableCell>Disciplina</TableCell>
                    <TableCell align="right">Total Faltas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relatorioFaltas.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.aluno__usuario__username}</TableCell>
                      <TableCell>{item.disciplina__nome}</TableCell>
                      <TableCell align="right">{item.total_faltas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default RelatoriosGerenciais;