// Em: frontend/src/pages/CalendarioAcademico.jsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios'; // Importa o axios
import './Calendario.css'; // (Criaremos este CSS a seguir)

function CalendarioAcademico() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // AJUSTE SE NECESSÁRIO: URL da sua view Django
        const apiUrl = 'http://127.0.0.1:8000/pedagogico/calendario/'; 

        // Tenta buscar os eventos
        axios.get(apiUrl, { 
                 // Se sua view exigir autenticação, você precisará enviar o token/cookie
                 // Exemplo com localStorage (adapte à sua lógica real de auth):
                 // headers: {
                 //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
                 // },
                 withCredentials: true // Importante se usar cookies/sessões CSRF do Django
             })
            .then(response => {
                // A view Django retorna { eventos_json: "..." }
                try {
                    // response.data já deve ser o objeto JS, .eventos_json é a string
                    const eventosFormatados = JSON.parse(response.data.eventos_json); 
                    setEventos(eventosFormatados);
                } catch (parseError) {
                    console.error("Erro ao parsear JSON dos eventos:", parseError);
                    setError('Erro ao processar dados do calendário.');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar eventos:", err);
                 // Verifica se o erro é de autenticação (401 ou 403)
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                     setError('Acesso não autorizado. Faça login novamente.');
                     // Aqui você poderia redirecionar para o login
                } else {
                    setError('Não foi possível carregar o calendário. Verifique a conexão com o backend.');
                }
                setLoading(false);
            });
    }, []); // Roda apenas uma vez

    if (loading) {
        return <div>Carregando calendário...</div>;
    }

    if (error) {
        // Mostra a mensagem de erro que definimos no catch
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    return (
        <div className="calendario-container">
            <h2>Calendário Acadêmico</h2>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={eventos}
                locale="pt-br"
                buttonText={{
                    today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista'
                }}
                headerToolbar={{
                    left: 'prev,next today', center: 'title', right: 'dayGridMonth'
                }}
                eventDidMount={(info) => {
                    // Adiciona tooltip com a descrição do evento
                    if (info.event.extendedProps && info.event.extendedProps.description) {
                        info.el.setAttribute('title', info.event.extendedProps.description);
                    } else if (info.event.title) {
                         info.el.setAttribute('title', info.event.title); // Usa o título se não houver descrição
                    }
                }}
                // Adiciona um handler para clique no evento (opcional)
                eventClick={(info) => {
                    alert('Evento: ' + info.event.title + '\nDescrição: ' + (info.event.extendedProps.description || 'N/A'));
                    info.jsEvent.preventDefault(); // Impede o navegador de seguir o link (se houver)
                }}
            />
        </div>
    );
}

export default CalendarioAcademico;