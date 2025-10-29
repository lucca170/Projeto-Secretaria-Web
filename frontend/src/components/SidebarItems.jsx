import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; 
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BookIcon from '@mui/icons-material/Book';


export default function SidebarItems() {
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData'); // <-- Limpa os dados do usuário também
    window.location.href = '/'; 
  };
  
  let userRole = null;
  try {
    const data = localStorage.getItem('userData');
    if (data) {
      // O 'role' agora será 'professor', 'aluno', or 'administrador'
      userRole = JSON.parse(data).role;
    }
  } catch (e) {
    console.error("Falha ao ler dados do usuário no menu", e);
  }

  return (
    <>
      {/* Link para o Dashboard (Todos veem) */}
      <ListItemButton component={RouterLink} to="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      
      {/* --- LÓGICA DE PERMISSÃO CORRIGIDA --- */}

      {/* Aluno vê seu Boletim */}
      {userRole === 'aluno' && (
        <ListItemButton component={RouterLink} to="/dashboard/meu-boletim">
          <ListItemIcon>
            <AssignmentIndIcon />
          </ListItemIcon>
          <ListItemText primary="Meu Boletim" />
        </ListItemButton>
      )}

      {/* Professor/Administrador veem links de gestão */}
      {(userRole === 'professor' || userRole === 'administrador') && (
        <>
          <ListItemButton component={RouterLink} to="/dashboard/alunos">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Gerir Alunos" />
          </ListItemButton>
          
          <ListItemButton component={RouterLink} to="/dashboard/pedagogico">
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Pedagógico" />
          </ListItemButton>

          <ListItemButton component={RouterLink} to="/dashboard/disciplinas">
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Disciplinas" />
          </ListItemButton>
        </>
      )}

      {/* Link que só o Administrador vê (ex: Financeiro) */}
      {userRole === 'administrador' && (
        <ListItemButton component={RouterLink} to="/dashboard/financeiro">
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Financeiro" />
        </ListItemButton>
      )}

      {/* Botão de Logout (Todos veem) */}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </>
  );
}