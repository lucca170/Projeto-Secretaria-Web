// Em: frontend/src/pages/AgendaProfessor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, 
    Typography, 
    Paper, 
    Box, 
    CircularProgress, 
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';

const token = localStorage.getItem('authToken');

const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    return new Date(data.getTime() + data.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');
};

function AgendaProfessor() {
  const [planos, setPlanos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgenda = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Token ${token}` };
        const res = await axios.get('http://127.0.0.1:8000/pedagogico/agenda/professor/', { headers });
        setPlanos(res.data.planos_de_aula);
        setDisciplinas(res.data.disciplinas);
      } catch (err) {
        console.error("Erro ao buscar agenda:", err);
        setError('Você não tem permissão para ver esta agenda ou ocorreu um erro.');
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Minha Agenda (Planos de Aula)</Typography>
        
        {planos.length === 0 && (
            <Typography>Nenhum plano de aula cadastrado para suas disciplinas.</Typography>
        )}

        <List>
          {planos.map((plano) => (
            <React.Fragment key={plano.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${formatarData(plano.data)} - ${plano.disciplina.materia_nome} (${plano.disciplina.turma_nome})`}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        Conteúdo:
                      </Typography>
                      {" "}{plano.conteudo_previsto}
                      {plano.atividades && (
                        <>
                          <br />
                          <Typography component="span" variant="body2" color="text.primary">
                            Atividades:
                          </Typography>
                          {" "}{plano.atividades}
                        </>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default AgendaProfessor;