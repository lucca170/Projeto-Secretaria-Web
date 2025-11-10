// Em: frontend/src/pages/GerenciarProfessores.jsx (NOVO ARQUIVO)

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
    Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const token = localStorage.getItem('authToken');

// Lógica de permissão
const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.cargo; 
  } catch (e) { return null; }
};
const adminRoles = ['administrador', 'coordenador', 'diretor', 'ti'];

function GerenciarProfessores() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(getUserRole());

    const fetchProfessores = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Token ${token}` };
        // Usamos a API de /api/users/ com o filtro de cargo
        const res = await axios.get('http://127.0.0.1:8000/api/users/?cargo=professor', { headers });
        setProfessores(res.data);
      } catch (err) {
        setError('Erro ao buscar professores.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfessores();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Gerenciar Professores
          </Typography>
          {adminRoles.includes(userRole) && (
            <Button
              component={RouterLink}
              to="/professores/adicionar"
              variant="contained"
              color="primary"
            >
              Adicionar Professor
            </Button>
          )}
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF (Login)</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {professores.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell align="right">{user.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default GerenciarProfessores;