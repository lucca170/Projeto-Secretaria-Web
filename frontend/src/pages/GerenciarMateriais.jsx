// Em: frontend/src/pages/GerenciarMateriais.jsx
import React, { useState, useEffect } from 'react'; // <-- Imports atualizados
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
    Checkbox,
    Button // <-- Importado
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // <-- Importado

const token = localStorage.getItem('authToken');

// --- ADICIONADO: Lógica de permissão ---
const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.cargo; // <-- Verifica o 'cargo'
  } catch (e) { return null; }
};
const adminRoles = ['administrador', 'coordenador', 'diretor', 'ti'];
// ------------------------------------

function GerenciarMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null); // <-- Adicionado

  useEffect(() => {
    setUserRole(getUserRole()); // <-- Adicionado

    const fetchMateriais = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Token ${token}` };
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
        
        {/* --- ADICIONADO: Cabeçalho com Botão --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Gerenciar Materiais Didáticos
          </Typography>
          {adminRoles.includes(userRole) && (
            <Button
              component={RouterLink}
              to="/materiais/adicionar" // <-- (Precisaremos criar esta página depois)
              variant="contained"
              color="primary"
            >
              Adicionar Material
            </Button>
          )}
        </Box>
        {/* ------------------------------------- */}
        
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