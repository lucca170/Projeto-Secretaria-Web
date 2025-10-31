// Em: frontend/src/pages/RelatorioAluno.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para pegar o ID da URL
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Button, Divider } from '@mui/material';

function RelatorioAluno() {
    // Pega o parâmetro 'alunoId' da URL (definido na rota)
    const { alunoId } = useParams(); 
    
    const [alunoData, setAlunoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base do backend (ajuste se necessário)
    const backendUrl = 'http://127.0.0.1:8000'; 

    useEffect(() => {
        // URL da view que retorna os dados do relatório para exibição
        const apiUrl = `${backendUrl}/pedagogico/relatorio/aluno/${alunoId}/`; 

        setLoading(true);
        setError(null);

        axios.get(apiUrl)
            .then(response => {
                // Usar diretamente os dados da API
                setAlunoData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar dados do aluno:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                     setError('Acesso não autorizado. Faça login novamente.');
                } else if (err.response && err.response.status === 404) {
                     setError(`Aluno com ID ${alunoId} não encontrado.`);
                } else {
                    setError('Não foi possível carregar os dados do aluno. Verifique a conexão com o backend.');
                }
                setLoading(false);
            });

    }, [alunoId]); // Re-executa se o alunoId mudar

    // Função para lidar com o download do PDF
    const handleDownloadPdf = () => {
        // URL da view Django que gera e retorna o PDF
        const pdfUrl = `${backendUrl}/pedagogico/relatorio/aluno/${alunoId}/pdf/`;
        
        // Abre a URL em uma nova aba para iniciar o download
        // O navegador cuidará de baixar o arquivo PDF retornado pelo Django
        window.open(pdfUrl, '_blank');
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

    if (!alunoData) {
        return <Typography sx={{ padding: '20px' }}>Nenhum dado encontrado para este aluno.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
            <Typography variant="h4" gutterBottom>
                Relatório de Desempenho
            </Typography>

            {/* Informações Básicas */}
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6">Aluno: {alunoData.aluno?.nome || 'Nome não disponível'}</Typography>
                <Typography variant="body1">Turma: {alunoData.aluno?.turma?.nome || 'N/A'}</Typography>
                <Typography variant="body1">Status: {alunoData.aluno?.status || 'N/A'}</Typography>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            {/* Botão de Download */}
            <Box sx={{ marginBottom: 2 }}>
                <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
                    Baixar Boletim em PDF
                </Button>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            {/* Médias */}
            <Typography variant="h6" gutterBottom>Médias por Disciplina</Typography>
            {alunoData.medias_disciplinas && alunoData.medias_disciplinas.length > 0 ? (
                <List dense>
                    {alunoData.medias_disciplinas.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText 
                                primary={item.disciplina__nome} 
                                secondary={`Média: ${parseFloat(item.media).toFixed(2)}`} 
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2">Nenhuma nota encontrada.</Typography>
            )}

            <Divider sx={{ marginY: 2 }} />

            {/* Frequência */}
            <Typography variant="h6" gutterBottom>Frequência</Typography>
            <Typography variant="body1">Total de Faltas: {alunoData.faltas?.count ?? 'N/A'}</Typography>
            <Typography variant="body1">Total de Presenças: {alunoData.presencas?.count ?? 'N/A'}</Typography>

            {/* Adicionar aqui seções para Advertências e Suspensões se a view retornar esses dados */}

        </Paper>
    );
}

export default RelatorioAluno;