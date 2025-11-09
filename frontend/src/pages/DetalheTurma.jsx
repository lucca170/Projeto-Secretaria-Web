<<<<<<< HEAD
// Em: frontend/src/pages/DetalheTurma.jsx (ARQUIVO MODIFICADO)
=======
// Em: frontend/src/pages/DetalheTurma.jsx (NOVO ARQUIVO)
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

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

<<<<<<< HEAD
// --- 1. ADICIONE AS FUNÇÕES DE ROLE ---
const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.role;
  } catch (e) { return null; }
};
const canManageRoles = ['administrador', 'coordenador', 'diretor', 'ti', 'professor'];
// -----------------------------------

function DetalheTurma() {
  const { turmaId } = useParams(); 
=======
function DetalheTurma() {
  const { turmaId } = useParams(); // Pega o ID da URL
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [userRole, setUserRole] = useState(null); // <-- 2. ADICIONE O ESTADO
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
    setUserRole(getUserRole()); // <-- 3. DEFINA O ROLE

=======
    // URL da action customizada que criamos
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
    const apiUrl = `http://127.0.0.1:8000/pedagogico/api/turmas/${turmaId}/detalhe_com_alunos/`;
    
    axios.get(apiUrl, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
<<<<<<< HEAD
      setTurma(response.data.turma);   
      setAlunos(response.data.alunos); 
=======
      setTurma(response.data.turma);   // Pega os dados da turma
      setAlunos(response.data.alunos); // Pega a lista de alunos
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
      setLoading(false);
    })
    .catch(err => {
      console.error("Erro ao buscar detalhes da turma:", err);
      setError("Não foi possível carregar os dados da turma.");
      setLoading(false);
    });
<<<<<<< HEAD
  }, [turmaId, token]); 
=======
  }, [turmaId, token]); // Roda se o ID da turma mudar
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

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
<<<<<<< HEAD
        
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
=======
        <Typography variant="h4" gutterBottom>
          Turma: {turma?.nome}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Turno: {turma?.turno_display}
        </Typography>
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
        
        <Button variant="outlined" onClick={() => navigate('/turmas')} sx={{ mb: 2 }}>
          Voltar para todas as turmas
        </Button>
<<<<<<< HEAD
        {/* --- FIM DA MODIFICAÇÃO --- */}
=======
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c

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
<<<<<<< HEAD
                  primary={aluno.nome} 
=======
                  primary={aluno.nome} // Vem do AlunoSerializer
>>>>>>> cc2921efa3437c520e2c524795c3e57a8bdac22c
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