// Em: frontend/src/pages/EventosExtracurriculares.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Button, Divider, Card, CardContent, CardActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Para o botão de inscrever

function EventosExtracurriculares() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inscricaoStatus, setInscricaoStatus] = useState({}); // Para feedback de inscrição

    // URL base do backend (ajuste se necessário)
    const backendUrl = 'http://127.0.0.1:8000';

    // Função para buscar os eventos
    const fetchEventos = () => {
        const apiUrl = `${backendUrl}/pedagogico/eventos/`; // URL da view de listagem

        setLoading(true);
        setError(null);

        axios.get(apiUrl, { withCredentials: true }) // Envia cookies se houver
            .then(response => {
                // --- ATENÇÃO: Verifique o formato da resposta do Django ---
                // Assumindo que a view retorna um objeto com uma chave 'eventos'
                // Se a view renderiza HTML, você precisará ajustá-la para retornar JSON.
                // Exemplo: return JsonResponse({'eventos': list(eventos.values('id', 'nome', ...)), 'eventos_inscritos_ids': [...]})
                
                // --- SIMULAÇÃO (Remova/Ajuste após confirmar a resposta da API) ---
                if (!response.data || typeof response.data !== 'object' || !response.data.eventos) {
                     console.warn("API não retornou JSON esperado, usando dados simulados.");
                     setEventos([
                         {id: 1, nome: 'Palestra de Tecnologia', data: '2025-11-15', descricao: 'Sobre novas techs.', vagas: 50, num_participantes: 10},
                         {id: 2, nome: 'Workshop de React', data: '2025-11-20', descricao: 'Aprenda React Hooks.', vagas: 20, num_participantes: 18},
                     ]);
                     // Simula IDs inscritos
                     // setInscricaoStatus({ 1: false, 2: true }); 
                } else {
                     setEventos(response.data.eventos || []); 
                     // Marcar status inicial de inscrição (se a API retornar os IDs)
                     const inscritosMap = {};
                     (response.data.eventos_inscritos_ids || []).forEach(id => {
                         inscritosMap[id] = true;
                     });
                     setInscricaoStatus(inscritosMap);
                }
                // --- FIM SIMULAÇÃO ---
                
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar eventos:", err);
                 if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                     setError('Acesso não autorizado. Faça login para ver os eventos.');
                 } else {
                    setError('Não foi possível carregar os eventos. Verifique a conexão com o backend.');
                 }
                setLoading(false);
            });
    };

    // Busca os eventos quando o componente monta
    useEffect(() => {
        fetchEventos();
    }, []);

    // Função para lidar com inscrição/desinscrição
    const handleInscricao = (eventoId) => {
        const apiUrl = `${backendUrl}/pedagogico/eventos/inscrever/${eventoId}/`;
        
        // POST request para a view de inscrição (precisa de CSRF se não for API DRF)
        axios.post(apiUrl, {}, { withCredentials: true }) // Envia POST vazio, Django usa a URL
             .then(response => {
                 // Atualiza o status visualmente e busca novamente a lista para garantir consistência
                 setInscricaoStatus(prev => ({ ...prev, [eventoId]: !prev[eventoId] }));
                 fetchEventos(); // Recarrega a lista para atualizar contagem de vagas, etc.
             })
             .catch(err => {
                  console.error("Erro ao inscrever/desinscrever:", err);
                  alert('Erro ao processar inscrição. Verifique se está logado.'); // Feedback genérico
             });
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error" sx={{ padding: '20px' }}>{error}</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
            <Typography variant="h4" gutterBottom>
                Eventos Extracurriculares
            </Typography>

            {eventos.length > 0 ? (
                <Box>
                    {eventos.map((evento) => (
                        <Card key={evento.id} sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{evento.nome}</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Data: {new Date(evento.data).toLocaleDateString('pt-BR')} | Vagas: {evento.num_participantes ?? '?'} / {evento.vagas}
                                </Typography>
                                <Typography variant="body1">{evento.descricao}</Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button
                                    variant={inscricaoStatus[evento.id] ? "outlined" : "contained"}
                                    color={inscricaoStatus[evento.id] ? "error" : "success"}
                                    onClick={() => handleInscricao(evento.id)}
                                    size="small"
                                >
                                    {inscricaoStatus[evento.id] ? 'Cancelar Inscrição' : 'Inscrever-se'}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1">Nenhum evento extracurricular disponível no momento.</Typography>
            )}
        </Paper>
    );
}

export default EventosExtracurriculares;