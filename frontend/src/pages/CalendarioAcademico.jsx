// Em: frontend/src/pages/CalendarioAcademico.jsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import './Calendario.css';
import { Box, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const getUserRole = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    const user = JSON.parse(userData);
    return user.role;
  } catch (e) {
    console.error("Erro ao ler dados do usuário:", e);
    return null;
  }
};
const adminRoles = ['administrador', 'coordenador', 'diretor', 'ti'];

function CalendarioAcademico() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate(); 

    const fetchEventos = () => {
        const apiUrl = 'http://127.0.0.1:8000/pedagogico/calendario/'; 
        axios.get(apiUrl, {
            headers: { 'Authorization': `Token ${token}` }
        })
            .then(response => {
                setEventos(response.data); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar eventos:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                     setError('Acesso não autorizado. Faça login novamente.');
                } else {
                    setError('Não foi possível carregar o calendário. Verifique a conexão com o backend.');
                }
                setLoading(false);
            });
    };

    useEffect(() => {
        setUserRole(getUserRole());
        fetchEventos();
    }, []);

    const handleEventClick = (clickInfo) => {
        const eventId = clickInfo.event.id;
        navigate(`/calendario/evento/${eventId}`);
    };

    // --- CORREÇÃO ESTÁ AQUI ---
    // Os `if (loading)` e `if (error)` devem vir ANTES do `return` principal
    if (loading) {
        return <div>Carregando calendário...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }
    // -------------------------

    return (
        <div className="calendario-container">
            <h2>Calendário Acadêmico</h2>

            {/* Botão Adicionar (continua o mesmo) */}
            {adminRoles.includes(userRole) && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginBottom: 2,
                paddingRight: '10px'
              }}>
                <Button 
                  component={RouterLink} 
                  to="/calendario/adicionar" 
                  variant="contained" 
                  color="primary"
                >
                  Adicionar Evento
                </Button>
              </Box>
            )}

            {/* --- CORREÇÃO PRINCIPAL AQUI ---
              As propriedades 'plugins', 'initialView', 'locale', 
              'buttonText' e 'headerToolbar' estavam faltando.
            */}
            <FullCalendar
                plugins={[dayGridPlugin]} // <-- Faltava esta linha
                initialView="dayGridMonth"  // <-- Faltava esta linha
                weekends={true}
                events={eventos}
                locale="pt-br" // <-- Faltava esta linha
                buttonText={{ // <-- Faltava esta linha
                    today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista'
                }}
                headerToolbar={{ // <-- Faltava esta linha
                    left: 'prev,next today', center: 'title', right: 'dayGridMonth'
                }}
                eventClick={handleEventClick} 
                eventDidMount={(info) => {
                    if (info.event.extendedProps && info.event.extendedProps.description) {
                        info.el.setAttribute('title', info.event.extendedProps.description);
                    } else if (info.event.title) {
                         info.el.setAttribute('title', info.event.title);
                    }
                }}
            />
        </div>
    );
}

export default CalendarioAcademico;