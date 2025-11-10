// Em: frontend/src/pages/ListaTurmas.jsx 

import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    List, 
    ListItemText, 
    Container, 
    CircularProgress, 
    Box, 
    Paper,
    ListItemButton,
    Button 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

// --- FUNÇÃO DE ROLE CORRIGIDA ---
const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.cargo; // <-- CORRIGIDO DE 'user.role' PARA 'user.cargo'
  } catch (e) { return null; }
};
const adminRoles = ['administrador', 'coordenador', 'diretor', 'ti'];
// -------------------------------

function ListaTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // Estado para o cargo
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setUserRole(getUserRole()); // Define o cargo

    const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/turmas/';
    
    axios.get(apiUrl, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      setTurmas(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Erro ao buscar turmas:", err);
      setError("Não foi possível carregar a lista de turmas.");
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginY: 4 }}>
        {/* --- CABEÇALHO COM BOTÃO --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Lista de Turmas
          </Typography>
          {adminRoles.includes(userRole) && (
            <Button
              component={RouterLink}
              to="/turmas/adicionar"
              variant="contained"
              color="primary"
            >
              Criar Turma
            </Button>
          )}
        </Box>
        {/* ------------------------- */}


        <List>
          {turmas.map((turma) => (
            <ListItemButton 
              key={turma.id} 
              component={RouterLink} 
              to={`/turmas/${turma.id}`} 
            >
              <ListItemText 
                primary={turma.nome} 
                secondary={turma.turno_display} 
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default ListaTurmas;