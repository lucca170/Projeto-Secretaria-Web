// Em: frontend/src/pages/RelatorioAluno.jsx (MODIFICADO)

import React, { useState, useEffect, useCallback } from 'react';
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
// --- CORREÇÃO: Precisamos verificar se o arquivo existe ---
// Se você não criou o arquivo EditarNotasModal.jsx, comente esta linha
import EditarNotasModal from '../components/EditarNotasModal'; 

// --- (Funções de role existentes) ---
const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.role;
  } catch (e) { return null; }
};
const canEditRoles = ['administrador', 'coordenador', 'diretor', 'ti', 'professor'];

const formatarData = (dataStr) => {
    try {
        const data = new Date(dataStr);
        data.setUTCDate(data.getUTCDate() + 1);
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (e) { return 'Data inválida'; }
};

function RelatorioAluno() {
    const { alunoId } = useParams(); 
    
    const [alunoData, setAlunoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null); 

    const [advertencias, setAdvertencias] = useState([]);
    const [suspensoes, setSuspensoes] = useState([]);
    
    const [notas, setNotas] = useState({}); 
    const [loadingNotas, setLoadingNotas] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const backendUrl = 'http://127.0.0.1:8000'; 

    // Efeito principal para buscar dados do relatório
    useEffect(() => {
        setUserRole(getUserRole()); 
        const token = localStorage.getItem('authToken');
        
        const apiUrlRelatorio = `${backendUrl}/pedagogico/relatorio/aluno/${alunoId}/`; 
        const apiUrlAdvertencias = `${backendUrl}/disciplinar/api/advertencias/?aluno_id=${alunoId}`;
        const apiUrlSuspensoes = `${backendUrl}/disciplinar/api/suspensoes/?aluno_id=${alunoId}`;

        setLoading(true);
        setError(null);

        const fetchDados = async () => {
            try {
                const headers = { 'Authorization': `Token ${token}` };
                const resRelatorio = await axios.get(apiUrlRelatorio, { headers });
                setAlunoData(resRelatorio.data);

                const resAdvertencias = await axios.get(apiUrlAdvertencias, { headers });
                setAdvertencias(resAdvertencias.data);

                const resSuspensoes = await axios.get(apiUrlSuspensoes, { headers });
                setSuspensoes(resSuspensoes.data);

            } catch (err) {
                console.error("Erro ao buscar dados do aluno:", err);
                let errorMsg = 'Não foi possível carregar os dados do aluno.';
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                     errorMsg = 'Acesso não autorizado. Faça login novamente.';
                } else if (err.response && err.response.status === 404) {
                     errorMsg = `Aluno com ID ${alunoId} não encontrado.`;
                }
                // --- CORREÇÃO: Define o estado de erro ---
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDados();
    }, [alunoId]); 

    // Efeito para buscar notas
    const fetchNotas = useCallback(() => {
        const token = localStorage.getItem('authToken');
        const apiUrlNotas = `${backendUrl}/pedagogico/api/notas/?aluno_id=${alunoId}`;
        setLoadingNotas(true);
        
        axios.get(apiUrlNotas, { headers: { 'Authorization': `Token ${token}` }})
        .then(res => {
            const notasAgrupadas = res.data.reduce((acc, nota) => {
                const nome = nota.disciplina_nome;
                if (!acc[nome]) {
                    acc[nome] = [];
                }
                acc[nome].push(nota);
                return acc;
            }, {});
            setNotas(notasAgrupadas);
        })
        .catch(err => {
            console.error("Erro ao buscar notas:", err);
        })
        .finally(() => {
            setLoadingNotas(false);
        });
    }, [alunoId]); 
    
    useEffect(() => {
        fetchNotas();
    }, [fetchNotas]);

    const handleDownloadPdf = () => {
        const pdfUrl = `${backendUrl}/pedagogico/relatorio/aluno/${alunoId}/pdf/`;
        window.open(pdfUrl, '_blank');
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        fetchNotas(); 
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // --- CORREÇÃO: O if (error) vem ANTES do if (!alunoData) ---
    if (error) {
        return <Typography color="error" sx={{ padding: '20px' }}>{error}</Typography>;
    }

    if (!alunoData) {
        return <Typography sx={{ padding: '20px' }}>Nenhum dado encontrado para este aluno.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
            {/* --- CORREÇÃO: Adicionado optional chaining (?.) --- */}
            {/* Isso previne o crash se 'turma' for null ou undefined */}
            {alunoData.aluno?.turma?.id && (
                <EditarNotasModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    alunoId={parseInt(alunoId)}
                    alunoNome={alunoData.aluno?.nome}
                    turmaId={alunoData.aluno.turma.id}
                    turmaNome={alunoData.aluno.turma.nome}
                />
            )}
            
            <Typography variant="h4" gutterBottom>
                Relatório de Desempenho
            </Typography>

            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6">Aluno: {alunoData.aluno?.nome || 'Nome não disponível'}</Typography>
                <Typography variant="body1">Turma: {alunoData.aluno?.turma?.nome || 'N/A'}</Typography>
                <Typography variant="body1">Status: {alunoData.aluno?.status || 'N/A'}</Typography>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ marginBottom: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
                    Baixar Boletim em PDF
                </Button>
                {/* --- CORREÇÃO: Adicionado 'alunoData.aluno?.turma?.id' --- */}
                {/* O botão só aparece se o aluno tiver uma turma */}
                {canEditRoles.includes(userRole) && alunoData.aluno?.turma?.id && (
                    <Button variant="contained" color="secondary" onClick={handleOpenModal}>
                        Lançar / Editar Notas
                    </Button>
                )}
            </Box>

            <Divider sx={{ marginY: 2 }} />

            {/* --- (O resto da página: Notas, Frequência, etc. continua igual) --- */}
            <Typography variant="h6" gutterBottom>Notas por Disciplina</Typography>
            {loadingNotas ? <CircularProgress size={24} /> : 
             Object.keys(notas).length > 0 ? (
                <List dense>
                    {Object.keys(notas).sort().map((disciplinaNome) => ( 
                        <ListItem key={disciplinaNome} sx={{ display: 'block', pt: 1, pb: 1 }} divider>
                            <ListItemText 
                                primary={disciplinaNome} 
                                primaryTypographyProps={{ fontWeight: 'bold' }}
                            />
                            <Box sx={{ pl: 2 }}>
                                {notas[disciplinaNome]
                                  .sort((a,b) => a.bimestre.localeCompare(b.bimestre)) 
                                  .map(nota => (
                                    <Typography key={nota.id} variant="body2" component="span" sx={{ mr: 3 }}>
                                        {nota.bimestre}: <strong>{parseFloat(nota.valor).toFixed(2)}</strong>
                                    </Typography>
                                ))}
                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2">Nenhuma nota lançada para este aluno.</Typography>
            )}
            
            {/* ... (Seções de Faltas, Advertências, Suspensões) ... */}
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6" gutterBottom>Frequência</Typography>
            <Typography variant="body1">Total de Faltas: {alunoData.faltas?.count ?? 'N/A'}</Typography>
            <Typography variant="body1">Total de Presenças: {alunoData.presencas?.count ?? 'N/A'}</Typography>

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