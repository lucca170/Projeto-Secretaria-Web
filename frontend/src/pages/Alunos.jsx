// Em: frontend/src/pages/Alunos.jsx
import React, { useState, useEffect } from 'react'; // Adicionar hooks
import { 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Button, 
    Container, // Adicionado
    CircularProgress, // Adicionado
    Box, // Adicionado
    Paper // Adicionado
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importar axios

function Alunos() {
  // Substituir dados de exemplo por estados
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
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
        <Typography variant="h4" gutterBottom>
          Gerenciamento de Alunos
        </Typography>

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
              <ListItemText 
                primary={aluno.nome} 
                secondary={`ID: ${aluno.id} | Turma: ${aluno.turma_nome || 'N/A'}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Alunos;