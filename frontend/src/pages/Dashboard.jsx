// Em: frontend/src/pages/Dashboard.jsx
import React from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// 1. O caminho da sua imagem .png (na pasta /public)
const imageUrl = '/dashboard-bg.png'; 

function Dashboard() {
  return (
    <Box sx={{
      // Configurações de alinhamento
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: { xs: 4, md: 8 }, // Padding interno para o texto
      overflow: 'hidden', 
      
      // --- Ajustes para Tela Cheia ---
      width: '100%',
      minHeight: 'calc(100vh - 64px)', // Altura correta
      
      // Imagem de fundo e overlay
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      
      // Cor do texto
      color: 'common.white', 
    }}>
      
      {/* Container para o conteúdo de texto */}
      <Container maxWidth="md" sx={{ zIndex: 2 }}> 
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Mais que alunos, formamos protagonistas
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.85)' }}> 
          Descubra um ambiente de aprendizado inovador e inspirador.
        </Typography>
        
        <Button variant="contained" color="secondary" size="large" component={RouterLink} to="/eventos">
          Agende sua visita →
        </Button>
      </Container>
    </Box>
  );
}

export default Dashboard;