import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Renomeia para evitar conflito
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';

export default function SidebarItems() {
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    // Força o redirecionamento para a página de login
    window.location.href = '/'; 
  };

  return (
    <>
      {/* Link para o Dashboard */}
      <ListItemButton component={RouterLink} to="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      
      {/* Link para Alunos (Exemplo) */}
      <ListItemButton component={RouterLink} to="/dashboard/alunos">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Alunos" />
      </ListItemButton>
      
      {/* Link para Pedagógico (Placeholder) */}
      <ListItemButton component={RouterLink} to="/dashboard/pedagogico">
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Pedagógico" />
      </ListItemButton>

      {/* Link para Financeiro (Placeholder) */}
      <ListItemButton component={RouterLink} to="/dashboard/financeiro">
        <ListItemIcon>
          <AttachMoneyIcon />
        </ListItemIcon>
        <ListItemText primary="Financeiro" />
      </ListItemButton>

      {/* Botão de Logout */}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </>
  );
}