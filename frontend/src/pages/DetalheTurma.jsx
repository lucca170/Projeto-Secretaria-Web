// Em: frontend/src/pages/DetalheTurma.jsx (ARQUIVO MODIFICADO)

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
    Paper, 
    Divider 
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
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
const canManageRoles = ['administrador', 'coordenador', 'diretor', 'ti', 'professor'];
// -----------------------------------

function DetalheTurma() {
  const { turmaId } = useParams(); 
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // <-- 3. DEFINA O ESTADO
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    setUserRole(getUserRole()); // <-- 3. DEFINA O ROLE

    const apiUrl = `http://127.0.0.1:8000/pedagogico/api/turmas/${turmaId}/detalhe_com_alunos/`;
    
    axios.get(apiUrl, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      setTurma(response.data.turma);   
      setAlunos(response.data.alunos); 
      setLoading(false);
    })
    .catch(err => {
      console.error("Erro ao buscar detalhes da turma:", err);
      setError("Não foi possível carregar os dados da turma.");
      setLoading(false);
    });
  }, [turmaId, token]); 

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
        
        {/* --- 4. CABEÇALHO MODIFICADO COM BOTÕES --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Turma: {turma?.nome}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Turno: {turma?.turno_display}
            </Typography>
          </Box>
          
          {/* Botões de Ação */}
          {canManageRoles.includes(userRole) && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                component={RouterLink}
                to={`/turmas/${turmaId}/frequencia`} // <-- Link para a nova página
                variant="contained"
                color="primary"
              >
                Lançar Frequência
              </Button>
            </Box>
          )}
        </Box>
        
        <Button variant="outlined" onClick={() => navigate('/turmas')} sx={{ mb: 2 }}>
          Voltar para todas as turmas
        </Button>
        {/* --- FIM DA MODIFICAÇÃO --- */}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" gutterBottom>
          Alunos da Turma ({alunos.length})
        </Typography>

        <List>
          {alunos.length > 0 ? (
            alunos.map((aluno) => (
              <ListItem
                key={aluno.id}
                secondaryAction={
                  <Button
                    component={RouterLink}
                    to={`/relatorio/aluno/${aluno.id}`}
                    variant="outlined"
                    size="small"
                  >
                    Ver Relatório
                  </Button>
                }
              >
                <ListItemText 
                  primary={aluno.nome} 
                  secondary={`ID: ${aluno.id} | Status: ${aluno.status}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>Nenhum aluno encontrado nesta turma.</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default DetalheTurma;