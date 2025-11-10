// Em: frontend/src/pages/GerenciarMateriais.jsx
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
    Checkbox
} from '@mui/material';

const token = localStorage.getItem('authToken');

function GerenciarMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMateriais = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Token ${token}` };
        // Nova API criada no Passo 2
        const res = await axios.get('http://127.0.0.1:8000/coordenacao/api/materiais/', { headers });
        setMateriais(res.data);
      } catch (err) {
        setError('Erro ao buscar materiais.');
      } finally {
        setLoading(false);
      }
    };
    fetchMateriais();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Gerenciar Materiais Didáticos</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell align="center">Disponível</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materiais.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell align="right">{item.quantidade}</TableCell>
                  <TableCell align="center">
                    <Checkbox checked={item.disponivel} disabled />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default GerenciarMateriais;