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

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setLoading(true);
    
    // --- CÓDIGO REAL (EXEMPLO CORRIGIDO) ---
    // Agora usando o método de autenticação correto
    const fetchAlunos = async () => {
      const token = localStorage.getItem('authToken');

      if (!token || token === 'undefined') {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }
      
      try {
        // ATENÇÃO: A URL '/pedagogico/api/alunos/' é um EXEMPLO.
        // Você precisa criar essa rota no seu 'pedagogico/urls.py'
        // Por enquanto, ela VAI DAR ERRO (o que é esperado)
        const response = await fetch('http://127.0.0.1:8000/pedagogico/api/alunos/', { // (Ajuste a URL da API)
          headers: {
            // --- CORREÇÃO: Usar "Token" e não "Bearer" ---
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
        // Se a API (ex: /api/alunos/) ainda não existir, ela vai cair aqui.
        // Isso é esperado até você criar os endpoints no Django.
        setError(`Erro ao buscar dados: ${err.message}. (Nota: verifique se a rota de API já foi criada no Django)`);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();

  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Gestão de Alunos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Novo Aluno
        </Button>
      </Box>

      <TableContainer component={Paper}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        
        {!loading && !error && alunos.length === 0 && (
           <Alert severity="info" sx={{ m: 2 }}>Nenhum aluno encontrado.</Alert>
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
                    <Button size="small">Editar</Button>
                    <Button size="small" color="error">Excluir</Button>
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