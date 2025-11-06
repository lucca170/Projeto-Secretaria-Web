// Em: frontend/src/pages/RelatorioAluno.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Button, 
    Divider 
} from '@mui/material';

// --- (FUNÇÃO AUXILIAR PARA FORMATAR DATA) ---
const formatarData = (dataStr) => {
    try {
        const data = new Date(dataStr);
        // Adiciona 1 dia (ajuste comum para fuso horário UTC)
        data.setUTCDate(data.getUTCDate() + 1);
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (e) {
        return 'Data inválida';
    }
};

function RelatorioAluno() {
    const { alunoId } = useParams(); 
    
    const [alunoData, setAlunoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- ADICIONE ESTES ESTADOS ---
    const [advertencias, setAdvertencias] = useState([]);
    const [suspensoes, setSuspensoes] = useState([]);
    // ----------------------------

    const backendUrl = 'http://127.0.0.1:8000'; 

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        // URLs das APIs
        const apiUrlRelatorio = `${backendUrl}/pedagogico/relatorio/aluno/${alunoId}/`; 
        const apiUrlAdvertencias = `${backendUrl}/disciplinar/api/advertencias/?aluno_id=${alunoId}`;
        const apiUrlSuspensoes = `${backendUrl}/disciplinar/api/suspensoes/?aluno_id=${alunoId}`;

        setLoading(true);
        setError(null);

        // --- ATUALIZE O FETCH DE DADOS ---
        const fetchDados = async () => {
            try {
                const headers = { 'Authorization': `Token ${token}` };

                // 1. Busca dados do relatório (médias, faltas)
                const resRelatorio = await axios.get(apiUrlRelatorio, { headers });
                setAlunoData(resRelatorio.data);

                // 2. Busca advertências
                const resAdvertencias = await axios.get(apiUrlAdvertencias, { headers });
                setAdvertencias(resAdvertencias.data);

                // 3. Busca suspensões
                const resSuspensoes = await axios.get(apiUrlSuspensoes, { headers });
                setSuspensoes(resSuspensoes.data);

            } catch (err) {
                console.error("Erro ao buscar dados do aluno:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                     setError('Acesso não autorizado. Faça login novamente.');
                } else if (err.response && err.response.status === 404) {
                     setError(`Aluno com ID ${alunoId} não encontrado.`);
                } else {
                    setError('Não foi possível carregar os dados do aluno.');
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchDados();
        // ---------------------------------

    }, [alunoId]); // Re-executa se o alunoId mudar

    const handleDownloadPdf = () => {
        const token = localStorage.getItem('authToken');
        // NOTA: A API de PDF do Django pode precisar de autenticação.
        // Se o download falhar, pode ser necessário buscar o PDF como 'blob' 
        // e usar 'FileSaver.js' para salvar, ou abrir a URL com o token (se suportado).
        // Por enquanto, mantemos a abertura da URL.
        const pdfUrl = `${backendUrl}/pedagogico/relatorio/aluno/${alunoId}/pdf/`;
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

            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6">Aluno: {alunoData.aluno?.nome || 'Nome não disponível'}</Typography>
                <Typography variant="body1">Turma: {alunoData.aluno?.turma?.nome || 'N/A'}</Typography>
                <Typography variant="body1">Status: {alunoData.aluno?.status || 'N/A'}</Typography>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ marginBottom: 2 }}>
                <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
                    Baixar Boletim em PDF
                </Button>
            </Box>

            <Divider sx={{ marginY: 2 }} />

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

            <Typography variant="h6" gutterBottom>Frequência</Typography>
            <Typography variant="body1">Total de Faltas: {alunoData.faltas?.count ?? 'N/A'}</Typography>
            <Typography variant="body1">Total de Presenças: {alunoData.presencas?.count ?? 'N/A'}</Typography>

            {/* --- ADICIONE ESTA SEÇÃO (ADVERTÊNCIAS) --- */}
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6" gutterBottom>Advertências</Typography>
            {advertencias.length > 0 ? (
                <List dense>
                    {advertencias.map((item) => (
                        <ListItem key={item.id}>
                            <ListItemText 
                                primary={`Data: ${formatarData(item.data)}`}
                                secondary={item.motivo} 
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2">Nenhuma advertência registrada.</Typography>
            )}

            {/* --- ADICIONE ESTA SEÇÃO (SUSPENSÕES) --- */}
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6" gutterBottom>Suspensões</Typography>
            {suspensoes.length > 0 ? (
                <List dense>
                    {suspensoes.map((item) => (
                        <ListItem key={item.id}>
                            <ListItemText 
                                primary={`De: ${formatarData(item.data_inicio)} | Até: ${formatarData(item.data_fim)}`}
                                secondary={item.motivo} 
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2">Nenhuma suspensão registrada.</Typography>
            )}

        </Paper>
    );
}

export default RelatorioAluno;