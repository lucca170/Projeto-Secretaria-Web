// Em: frontend/src/pages/DetalheTurma.jsx (NOVO ARQUIVO)

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

function DetalheTurma() {
  const { turmaId } = useParams(); // Pega o ID da URL
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    // URL da action customizada que criamos
    const apiUrl = `http://127.0.0.1:8000/pedagogico/api/turmas/${turmaId}/detalhe_com_alunos/`;
    
    axios.get(apiUrl, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      setTurma(response.data.turma);   // Pega os dados da turma
      setAlunos(response.data.alunos); // Pega a lista de alunos
      setLoading(false);
    })
    .catch(err => {
      console.error("Erro ao buscar detalhes da turma:", err);
      setError("Não foi possível carregar os dados da turma.");
      setLoading(false);
    });
  }, [turmaId, token]); // Roda se o ID da turma mudar

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
        <Typography variant="h4" gutterBottom>
          Turma: {turma?.nome}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Turno: {turma?.turno_display}
        </Typography>
        
        <Button variant="outlined" onClick={() => navigate('/turmas')} sx={{ mb: 2 }}>
          Voltar para todas as turmas
        </Button>

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
                  primary={aluno.nome} // Vem do AlunoSerializer
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