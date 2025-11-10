// Em: frontend/src/pages/Alunos.jsx
import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Button, 
    Container,
    CircularProgress, 
    Box, 
    Paper 
} from '@mui/material';
import { Link, Link as RouterLink } from 'react-router-dom'; 
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

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setUserRole(getUserRole()); // Define o cargo

    // URL da API de alunos (registrada no urls.py)
    const apiUrl = 'http://127.0.0.1:8000/pedagogico/api/alunos/';
    
    axios.get(apiUrl, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      setAlunos(response.data); // 'response.data' já virá ordenado da API
      setLoading(false);
    })
    .catch(err => {
      console.error("Erro ao buscar alunos:", err);
      setError("Não foi possível carregar a lista de alunos.");
      setLoading(false);
    });
  }, [token]); // Roda uma vez

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
            Gerenciamento de Alunos
          </Typography>
          {adminRoles.includes(userRole) && (
            <Button
              component={RouterLink}
              to="/alunos/adicionar"
              variant="contained"
              color="primary"
            >
              Criar Aluno
            </Button>
          )}
        </Box>
        {/* ------------------------- */}

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Lista de Alunos (em ordem alfabética):
        </Typography>

        <List>
          {alunos.map((aluno) => (
            <ListItem
              key={aluno.id}
              secondaryAction={
                <Button
                  component={Link}
                  to={`/relatorio/aluno/${aluno.id}`} // Link para o relatório
                  variant="contained"
                  size="small"
                  color="secondary"
                >
                  Ver Relatório
                </Button>
              }
            >
              {/* 'aluno.nome' e 'aluno.turma_nome' vêm do AlunoSerializer */}
              {/* --- ATUALIZADO AQUI --- */}
              <ListItemText 
                primary={aluno.nome} 
                secondary={`CPF (Login): ${aluno.cpf || 'N/A'} | Turma: ${aluno.turma_nome || 'N/A'}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Alunos;