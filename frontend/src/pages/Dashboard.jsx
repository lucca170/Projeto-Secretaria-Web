// Exemplo em frontend/src/pages/Dashboard.jsx
import React from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Dashboard() {
  return (
    <Box sx={{
      // display: 'flex', // Descomente e ajuste se precisar alinhar itens
      // alignItems: 'center',
      // justifyContent: 'center',
      textAlign: 'center', // Centraliza o texto
      padding: { xs: 4, md: 8 }, // Mais padding em telas maiores
      // Adicione um fundo gradiente ou imagem se desejar
      // backgroundColor: theme.palette.primary.main, // Ou use a cor primária
      borderRadius: 2, // Leve arredondamento
      color: (theme) => theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.common.white, // Cor do texto baseada no tema
      minHeight: '40vh', // Altura mínima
    }}>
      <Container maxWidth="md"> {/* Limita a largura do conteúdo */}
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Mais que alunos, formamos protagonistas
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}> {/* Cor secundária do texto */}
          Descubra um ambiente de aprendizado inovador e inspirador.
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={RouterLink} to="/eventos"> {/* Ex: Link para eventos */}
          Agende sua visita →
        </Button>
      </Container>
    </Box>
  );
}

export default Dashboard;