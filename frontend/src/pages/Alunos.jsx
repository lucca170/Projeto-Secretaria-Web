import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useAuth from '../hooks/useAuth'; // <-- Importa o hook

function Alunos() {
  const userData = useAuth(); // <-- Pega os dados do usuário logado
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Só executa se tivermos os dados do usuário
    if (!userData) return; 

    setError('');
    setLoading(true);

    const fetchAlunos = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || token === 'undefined') {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }
      
      try {
        // ATENÇÃO: Esta URL '/pedagogico/api/alunos/' é um EXEMPLO.
        // Você precisará criá-la no seu `pedagogico/urls.py` e `views.py`
        const response = await fetch('http://127.0.0.1:8000/pedagogico/api/alunos/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
             throw new Error('Sessão expirada. Faça login novamente.');
          }
          throw new Error('Falha ao carregar dados da API.');
        }
        
        const data = await response.json();
        setAlunos(data);
        
      } catch (err) {
        setError(`Erro ao buscar dados: ${err.message}. (Verifique se a rota de API já foi criada no Django)`);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();

  }, [userData]); // <-- Re-executa se userData mudar

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Gestão de Alunos
        </Typography>
        
        {/* --- LÓGICA DE PERMISSÃO CORRIGIDA --- */}
        {/* Só mostra o botão se o cargo for 'professor' ou 'administrador' */}
        {userData && (userData.role === 'professor' || userData.role === 'administrador') && (
          <Button variant="contained" startIcon={<AddIcon />}>
            Novo Aluno
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        
        {!loading && !error && alunos.length === 0 && (
           <Alert severity="info" sx={{ m: 2 }}>
             {/* Mostra msg de erro se a API falhou, ou 'nenhum aluno' se ela funcionou */}
             {error ? 'Erro ao carregar dados.' : 'Nenhum aluno encontrado.'}
           </Alert>
        )}

        {!loading && !error && alunos.length > 0 && (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Matrícula</TableCell>
                <TableCell>Turma</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell component="th" scope="row">
                    {aluno.nome}
                  </TableCell>
                  <TableCell>{aluno.matricula || 'N/A'}</TableCell>
                  <TableCell>{aluno.turma || 'N/A'}</TableCell>
                  <TableCell align="right">
                  
                    {/* --- LÓGICA DE PERMISSÃO CORRIGIDA --- */}
                    {/* Professor/Admin pode editar/excluir */}
                    {userData && (userData.role === 'professor' || userData.role === 'administrador') && (
                      <>
                        <Button size="small">Editar</Button>
                        <Button size="small" color="error">Excluir</Button>
                      </>
                    )}
                    
                    {/* Aluno vê um botão diferente */}
                    {userData && userData.role === 'aluno' && (
                       <Button size="small">Ver Notas</Button>
                    )}
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}

export default Alunos;