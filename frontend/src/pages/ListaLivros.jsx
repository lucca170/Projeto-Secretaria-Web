// Em: frontend/src/pages/ListaLivros.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom'; // <-- Importado
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Paper, 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button,
    Alert 
} from '@mui/material';

// Funções de Role
const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.role; 
  } catch (e) { return null; }
};
const adminRoles = ['administrador', 'coordenador', 'diretor', 'ti'];


function ListaLivros() {
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const token = localStorage.getItem('authToken');

    const fetchLivros = () => {
        setLoading(true);
        axios.get('http://127.0.0.1:8000/biblioteca/api/livros/', {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(response => {
            setLivros(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao buscar livros:", err);
            setError('Não foi possível carregar os livros.');
            setLoading(false);
        });
    };

    useEffect(() => {
        setUserRole(getUserRole());
        fetchLivros();
    }, [token]);

    const handleEmprestar = (livroId) => {
        setError(null);
        setSuccess(null);
        
        const apiUrl = `http://127.0.0.1:8000/biblioteca/api/livros/${livroId}/emprestar/`;

        axios.post(apiUrl, {}, {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(response => {
            setSuccess(`Livro '${response.data.livro.titulo}' emprestado com sucesso!`);
            fetchLivros(); // Recarrega a lista
        })
        .catch(err => {
            console.error("Erro ao emprestar:", err);
            if (err.response && err.response.data && err.response.data.erro) {
                setError(err.response.data.erro);
            } else if (err.response && err.response.status === 403) {
                 setError("Apenas alunos podem emprestar livros.");
            } else {
                setError('Erro ao processar o empréstimo.');
            }
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                    Biblioteca
                </Typography>
                <Box>
                    {/* Botão para Alunos */}
                    {userRole === 'aluno' && (
                        <Button
                            component={RouterLink}
                            to="/biblioteca/meus-emprestimos"
                            variant="contained"
                            color="secondary"
                            sx={{ mr: 2 }}
                        >
                            Ver Meus Empréstimos
                        </Button>
                    )}
                    {/* Botão para Admins */}
                    {adminRoles.includes(userRole) && (
                         <Button
                            component={RouterLink}
                            to="/biblioteca/adicionar-livro" // <-- Rota atualizada
                            variant="contained"
                            color="primary"
                        >
                            Adicionar Livro
                        </Button>
                    )}
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Grid container spacing={3}>
                {livros.length > 0 ? (
                    livros.map((livro) => (
                        <Grid item xs={12} sm={6} md={4} key={livro.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {livro.titulo}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        por {livro.autor?.nome || 'Autor desconhecido'}
                                    </Typography>
                                    <Typography variant="body2">
                                        ISBN: {livro.isbn || 'N/A'}
                                    </Typography>
                                    
                                    {adminRoles.includes(userRole) ? (
                                        <Typography variant="body2" color="primary.main">
                                            Disponíveis: {livro.quantidade_disponivel} / {livro.quantidade_total}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" color="primary.main">
                                            Disponíveis: {livro.quantidade_disponivel}
                                        </Typography>
                                    )}

                                </CardContent>
                                <CardActions>
                                    {userRole === 'aluno' ? (
                                        <Button 
                                            size="small" 
                                            onClick={() => handleEmprestar(livro.id)}
                                            disabled={livro.quantidade_disponivel === 0}
                                        >
                                            Emprestar
                                        </Button>
                                    ) : adminRoles.includes(userRole) ? (
                                        // --- BOTÃO DE GERENCIAR ATUALIZADO ---
                                        <Button 
                                            size="small" 
                                            component={RouterLink} 
                                            to={`/biblioteca/livro/${livro.id}`} // <-- Rota atualizada
                                        >
                                            Gerenciar
                                        </Button>
                                    ) : null}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography>Nenhum livro disponível no momento.</Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

export default ListaLivros;