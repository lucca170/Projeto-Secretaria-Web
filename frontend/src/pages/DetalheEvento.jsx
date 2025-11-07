// Em: frontend/src/pages/DetalheEvento.jsx (NOVO ARQUIVO)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';

// Funções auxiliares (copiadas do CalendarioAcademico)
const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.role;
  } catch (e) { return null; }
};
const adminRoles = ['administrador', 'coordenador', 'diretor', 'ti'];

// Opções (copiadas do AdicionarEvento)
const tiposDeEvento = [
  { value: 'prova', label: 'Prova' },
  { value: 'trabalho', label: 'Entrega de Trabalho' },
  { value: 'feriado', label: 'Feriado' },
  { value: 'evento', label: 'Evento Escolar' },
  { value: 'reuniao', label: 'Reunião' },
];

// Função para formatar a data para leitura (DD/MM/AAAA HH:MM)
const formatarDataLeitura = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const data = new Date(isoString);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Data inválida';
    }
}
// Função para formatar a data para o input (YYYY-MM-DDTHH:MM)
const formatarDataInput = (isoString) => {
    if (!isoString) return '';
    return isoString.slice(0, 16);
}

function DetalheEvento() {
  const navigate = useNavigate();
  const { eventoId } = useParams(); 
  const [userRole, setUserRole] = useState(null);
  
  // Estado para o formulário
  const [formData, setFormData] = useState({
      titulo: '',
      tipo: '',
      data_inicio: '',
      data_fim: '',
      descricao: '',
      turma: '',
      disciplina: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Controla o modo (Leitura vs Edição)

  const token = localStorage.getItem('authToken');
  const apiUrl = `http://127.0.0.1:8000/pedagogico/api/eventos-academicos/${eventoId}/`;

  // Busca os dados do evento
  useEffect(() => {
    setUserRole(getUserRole());
    
    axios.get(apiUrl, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      const evento = response.data;
      // Define os dados do formulário
      setFormData({
          titulo: evento.titulo,
          tipo: evento.tipo,
          data_inicio: formatarDataInput(evento.data_inicio),
          data_fim: formatarDataInput(evento.data_fim),
          descricao: evento.descricao || '',
          turma: evento.turma || '',
          disciplina: evento.disciplina || ''
      });
      setLoading(false);
    })
    .catch(err => {
      console.error("Erro ao buscar evento:", err);
      setError("Não foi possível carregar os dados do evento.");
      setLoading(false);
    });
  }, [apiUrl, token]);

  // Atualiza o estado do formulário
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Envia a ATUALIZAÇÃO (PUT)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const formatarDataISO = (data) => {
        if (!data) return null;
        return new Date(data).toISOString();
    }

    const eventoData = {
      titulo: formData.titulo,
      tipo: formData.tipo,
      data_inicio: formatarDataISO(formData.data_inicio),
      data_fim: formatarDataISO(formData.data_fim) || null,
      descricao: formData.descricao,
      turma: formData.turma ? parseInt(formData.turma) : null,
      disciplina: formData.disciplina ? parseInt(formData.disciplina) : null,
    };

    try {
      await axios.put(apiUrl, eventoData, {
        headers: { 'Authorization': `Token ${token}` }
      });
      setSuccess('Evento atualizado com sucesso!');
      setIsEditing(false); // Volta para o modo de leitura
      setLoading(true); // Força recarregar os dados
      
      // Recarrega os dados atualizados
      axios.get(apiUrl, { headers: { 'Authorization': `Token ${token}` }})
        .then(response => {
            const evento = response.data;
            setFormData({
                titulo: evento.titulo,
                tipo: evento.tipo,
                data_inicio: formatarDataInput(evento.data_inicio),
                data_fim: formatarDataInput(evento.data_fim),
                descricao: evento.descricao || '',
                turma: evento.turma || '',
                disciplina: evento.disciplina || ''
            });
            setLoading(false);
        });

    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
      setError('Erro ao atualizar evento. Verifique os campos.');
    }
  };

  // Envia a EXCLUSÃO (DELETE)
  const handleDelete = () => {
      if (window.confirm("Tem certeza que quer excluir este evento? Esta ação não pode ser desfeita.")) {
          axios.delete(apiUrl, {
              headers: { 'Authorization': `Token ${token}` }
          })
          .then(() => {
              alert('Evento excluído com sucesso!');
              navigate('/calendario'); // Volta para o calendário
          })
          .catch(err => {
              console.error("Erro ao excluir evento:", err);
              setError("Você não tem permissão para excluir este evento.");
          });
      }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !isEditing) { // Só mostra erro fatal se não estiver editando
    return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginY: 4 }}>
        
        {/*
          /////////////////////////////////////////////////
          // MODO DE EDIÇÃO (Formulário)
          /////////////////////////////////////////////////
        */}
        {isEditing ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
              Editar Evento Acadêmico
            </Typography>
            
            <TextField
              label="Título do Evento"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required fullWidth margin="normal"
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="tipo-evento-label">Tipo de Evento</InputLabel>
              <Select
                labelId="tipo-evento-label"
                name="tipo"
                value={formData.tipo}
                label="Tipo de Evento"
                onChange={handleChange}
              >
                {tiposDeEvento.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Data e Hora de Início"
              type="datetime-local"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
              required fullWidth margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Data e Hora de Fim (Opcional)"
              type="datetime-local"
              name="data_fim"
              value={formData.data_fim}
              onChange={handleChange}
              fullWidth margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Descrição (Opcional)"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              multiline rows={4} fullWidth margin="normal"
            />
            
            <TextField
              label="ID da Turma (Opcional)"
              type="number"
              name="turma"
              value={formData.turma}
              onChange={handleChange}
              fullWidth margin="normal"
            />
            
            <TextField
              label="ID da Disciplina (Opcional)"
              type="number"
              name="disciplina"
              value={formData.disciplina}
              onChange={handleChange}
              fullWidth margin="normal"
            />
            
            {error && ( <Typography color="error" sx={{ mt: 2 }}>{error}</Typography> )}
            {success && ( <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography> )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Salvar Alterações
              </Button>
              <Button variant="outlined" onClick={() => {
                  setIsEditing(false); // Cancela edição
                  setError(''); // Limpa erros
                  setSuccess(''); // Limpa sucesso
              }}>
                Cancelar Edição
              </Button>
            </Box>
          </Box>
        
        ) : (

        /*
          /////////////////////////////////////////////////
          // MODO DE LEITURA (Padrão)
          /////////////////////////////////////////////////
        */
          <Box>
            <Typography variant="h4" gutterBottom>
              {formData.titulo}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="overline" color="text.secondary">Tipo</Typography>
                <Typography variant="body1">{tiposDeEvento.find(t => t.value === formData.tipo)?.label || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="overline" color="text.secondary">Turma / Disciplina (IDs)</Typography>
                <Typography variant="body1">
                    {formData.turma ? `Turma: ${formData.turma}` : ''}
                    {formData.disciplina ? ` Disciplina: ${formData.disciplina}` : ''}
                    {!formData.turma && !formData.disciplina ? 'Geral' : ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="overline" color="text.secondary">Início</Typography>
                <Typography variant="body1">{formatarDataLeitura(formData.data_inicio)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="overline" color="text.secondary">Término</Typography>
                <Typography variant="body1">{formatarDataLeitura(formData.data_fim)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="overline" color="text.secondary">Descrição</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {formData.descricao || 'Nenhuma descrição fornecida.'}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="outlined" onClick={() => navigate('/calendario')}>
                Voltar ao Calendário
              </Button>
              
              {/* Botões de Admin */}
              {adminRoles.includes(userRole) && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={handleDelete}>
                    Excluir
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}

      </Paper>
    </Container>
  );
}

export default DetalheEvento;