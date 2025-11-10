// Em: frontend/src/pages/GerenciarMaterias.jsx (NOVO ARQUIVO)

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
    Button,
    IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

function GerenciarMaterias() {
  const [materias, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  const fetchMaterias = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Token ${token}` };
      const res = await axios.get('http://127.0.0.1:8000/pedagogico/api/materias/', { headers });
      setMateriais(res.data);
    } catch (err) {
      setError('Erro ao buscar matérias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserRole(getUserRole());
    fetchMaterias();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta matéria? Isso pode afetar disciplinas já cadastradas.")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/pedagogico/api/materias/${id}/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        // Remove a matéria da lista local
        setMateriais(materias.filter(m => m.id !== id));
      } catch (err) {
        setError("Erro ao excluir matéria. Verifique se ela não está em uso.");
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Gerenciar Matérias
          </Typography>
          {adminRoles.includes(userRole) && (
            <Button
              component={RouterLink}
              to="/materias/adicionar"
              variant="contained"
              color="primary"
            >
              Adicionar Matéria
            </Button>
          )}
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome da Matéria</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materias.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell align="right">
                    {/* (Botão de editar pode ser adicionado futuramente)
                    <IconButton 
                      component={RouterLink} 
                      to={`/materias/editar/${item.id}`} 
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    */}
                    <IconButton onClick={() => handleDelete(item.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
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

export default GerenciarMaterias;