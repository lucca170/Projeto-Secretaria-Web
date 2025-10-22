import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Dashboard
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Selecione uma opção no menu ao lado para começar a gerenciar a secretaria.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;