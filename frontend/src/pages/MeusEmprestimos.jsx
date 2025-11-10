// Em: frontend/src/pages/MeusEmprestimos.jsx (NOVO ARQUIVO)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Paper, 
    Container, 
    List, 
    ListItem, 
    ListItemText, 
    Button,
    Alert,
    Divider
} from '@mui/material';

function MeusEmprestimos() {
    const [emprestimos, setEmprestimos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const token = localStorage.getItem('authToken');

    const fetchEmprestimos = () => {
        setLoading(true);
        axios.get('http://127.0.0.1:8000/biblioteca/api/emprestimos/', {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(response => {
            setEmprestimos(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao buscar empréstimos:", err);
            setError('Não foi possível carregar seus empréstimos. Verifique se você é um aluno.');
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchEmprestimos();
    }, [token]);

    const handleDevolver = (emprestimoId) => {
        setError(null);
        setSuccess(null);
        
        const apiUrl = `http://127.0.0.1:8000/biblioteca/api/emprestimos/${emprestimoId}/devolver/`;

        axios.post(apiUrl, {}, {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(response => {
            setSuccess(`Livro '${response.data.livro.titulo}' devolvido com sucesso!`);
            // Atualiza a lista de empréstimos
            fetchEmprestimos();
        })
        .catch(err => {
            console.error("Erro ao devolver:", err);
            if (err.response && err.response.data && err.response.data.erro) {
                setError(err.response.data.erro);
            } else {
                setError('Erro ao processar a devolução.');
            }
        });
    };
    
    const formatarData = (data) => {
        if (!data) return 'N/A';
        return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Meus Empréstimos
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                
                <Typography variant="h6" gutterBottom>Ativos</Typography>
                <List>
                    {emprestimos.filter(e => !e.data_devolucao_real).length > 0 ? 
                        emprestimos.filter(e => !e.data_devolucao_real).map((emp) => (
                        <ListItem 
                            key={emp.id}
                            secondaryAction={
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => handleDevolver(emp.id)}
                                >
                                    Devolver
                                </Button>
                            }
                        >
                            <ListItemText 
                                primary={emp.livro?.titulo || 'Livro não encontrado'}
                                secondary={`Emprestado em: ${formatarData(emp.data_emprestimo)} | Devolver até: ${formatarData(emp.data_devolucao_prevista)}`}
                            />
                        </ListItem>
                    )) : (
                        <Typography variant="body2" sx={{ p: 2 }}>Você não possui empréstimos ativos.</Typography>
                    )}
                </List>
                
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Histórico (Devolvidos)</Typography>
                <List>
                    {emprestimos.filter(e => e.data_devolucao_real).length > 0 ? 
                        emprestimos.filter(e => e.data_devolucao_real).map((emp) => (
                        <ListItem key={emp.id} dense>
                            <ListItemText 
                                primary={emp.livro?.titulo || 'Livro não encontrado'}
                                secondary={`Devolvido em: ${formatarData(emp.data_devolucao_real)}`}
                            />
                        </ListItem>
                    )) : (
                        <Typography variant="body2" sx={{ p: 2 }}>Nenhum livro devolvido ainda.</Typography>
                    )}
                </List>
            </Paper>
        </Container>
    );
}

export default MeusEmprestimos;