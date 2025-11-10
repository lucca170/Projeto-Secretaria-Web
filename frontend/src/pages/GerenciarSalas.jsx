// Em: frontend/src/pages/GerenciarSalas.jsx
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
    TableRow
} from '@mui/material';

const token = localStorage.getItem('authToken');

function GerenciarSalas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalas = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Token ${token}` };
        // Nova API criada no Passo 2
        const res = await axios.get('http://127.0.0.1:8000/coordenacao/api/salas/', { headers });
        setSalas(res.data);
      } catch (err) {
        setError('Erro ao buscar salas.');
      } finally {
        setLoading(false);
      }
    };
    fetchSalas();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Gerenciar Salas e Laboratórios</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Capacidade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salas.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell align="right">{item.capacidade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default GerenciarSalas;