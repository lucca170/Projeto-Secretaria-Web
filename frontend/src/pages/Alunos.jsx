import React from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Importa o Link

function Alunos() {
  // --- DADOS SIMULADOS (Substitua pela busca real de alunos) ---
  const alunosExemplo = [
    { id: 1, nome: 'Aluno Teste 1' },
    { id: 2, nome: 'Aluno Teste 2' },
    { id: 5, nome: 'Aluno Teste 5' },
  ];
  // --- FIM DA SIMULAÇÃO ---

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
                component={Link} // Usa o Link do react-router-dom
                to={`/relatorio/aluno/${aluno.id}`} // Constrói a URL com o ID
                variant="outlined" 
                size="small"
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