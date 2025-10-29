// Em: frontend/src/pages/Alunos.jsx
import React from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Alunos() {
  const alunosExemplo = [
    { id: 1, nome: 'Aluno Teste 1' },
    { id: 2, nome: 'Aluno Teste 2' },
    { id: 5, nome: 'Aluno Teste 5' },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Alunos
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Lista de Alunos (Exemplo):
      </Typography>

      <List>
        {alunosExemplo.map((aluno) => (
          <ListItem
            key={aluno.id}
            secondaryAction={
              <Button
                component={Link}
                to={`/relatorio/aluno/${aluno.id}`}
                variant="contained" // <<< ALTERADO PARA contained (ou mantenha outlined se preferir)
                size="small"
                color="secondary" // <<< ALTERADO PARA secondary (amarelo do tema)
              >
                Ver Relatório
              </Button>
            }
          >
            <ListItemText primary={aluno.nome} secondary={`ID: ${aluno.id}`} />
          </ListItem>
        ))}
      </List>

    </div>
  );
}

export default Alunos;