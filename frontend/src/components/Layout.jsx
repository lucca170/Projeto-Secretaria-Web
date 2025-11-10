// Em: frontend/src/components/Layout.jsx (COM A TROCA DE 'DASHBOARD' PARA 'HOME')

import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Box, 
    Button, 
    Link as MuiLink,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    Divider
} from '@mui/material';

// --- ÍCONES (Alterado: Dashboard -> HomeIcon) ---
import {
    Home as HomeIcon, // <-- MUDANÇA AQUI
    People, School, Class, CalendarToday, LibraryBooks,
    MeetingRoom, Category, Assessment, Assignment, Logout,
    Report, Bookmarks
} from '@mui/icons-material';

// --- CSS (Permanece o mesmo) ---
import './Layout.css'; 

const drawerWidth = 240;

const getUserData = () => {
  try {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString || userDataString === "null") {
      return null;
    }
    return JSON.parse(userDataString); 
  } catch (e) { 
    console.error("Erro ao parsear userData:", e);
    return null; 
  }
};

function Layout({ toggleTheme, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => getUserData()); 

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };
  
  // --- FUNÇÃO MODIFICADA (Label e Ícone) ---
  const getNavLinks = () => {
    const role = userData ? userData.cargo : null; 
    
    const adminLinks = [
      { label: 'Home', path: '/dashboard', icon: <HomeIcon /> }, // <-- MUDANÇA AQUI
      { label: 'Alunos', path: '/alunos', icon: <People /> },
      { label: 'Professores', path: '/professores', icon: <School /> },
      { label: 'Turmas', path: '/turmas', icon: <Class /> },
      { label: 'Matérias', path: '/materias', icon: <Assignment /> }, 
      { label: 'Calendário', path: '/calendario', icon: <CalendarToday /> },
      { label: 'Biblioteca', path: '/biblioteca', icon: <LibraryBooks /> },
      { label: 'Salas', path: '/salas', icon: <MeetingRoom /> },
      { label: 'Materiais', path: '/materiais', icon: <Category /> },
      { label: 'Relatórios', path: '/relatorios', icon: <Assessment /> },
    ];
    
    const professorLinks = [
      { label: 'Home', path: '/dashboard', icon: <HomeIcon /> }, // <-- MUDANÇA AQUI
      { label: 'Minhas Turmas', path: '/turmas', icon: <Class /> }, 
      { label: 'Minha Agenda', path: '/agenda', icon: <Report /> },
      { label: 'Calendário', path: '/calendario', icon: <CalendarToday /> },
    ];
    
    const alunoLinks = [
      { label: 'Home', path: '/dashboard', icon: <HomeIcon /> }, // <-- MUDANÇA AQUI
      { label: 'Meu Boletim', path: `/relatorio/aluno/${userData ? userData.aluno_id : ''}`, icon: <Assessment /> }, 
      { label: 'Calendário', path: '/calendario', icon: <CalendarToday /> },
      { label: 'Biblioteca', path: '/biblioteca', icon: <LibraryBooks /> },
      { label: 'Meus Empréstimos', path: '/biblioteca/meus-emprestimos', icon: <Bookmarks /> },
    ];

    const adminRolesList = ['administrador', 'coordenador', 'diretor', 'ti'];
    if (adminRolesList.includes(role)) {
        return adminLinks;
    }
    if (role === 'professor') {
        return professorLinks;
    }
     if (role === 'aluno') {
        return alunoLinks;
    }
    return [{ label: 'Home', path: '/dashboard', icon: <HomeIcon /> }]; // <-- MUDANÇA AQUI
  };
  
  const navLinks = getNavLinks();
  const userName = userData ? `${userData.first_name} ${userData.last_name}` : 'Usuário';
  const userRole = userData ? userData.cargo : '...';

  // --- ESTRUTURA (Sem alteração) ---
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Barra Superior */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" noWrap component="div">
              {navLinks.find(link => link.path === location.pathname || (link.path !== '/' && location.pathname.startsWith(link.path)))?.label || 'Secretaria Web'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button color="inherit" onClick={handleLogoutClick} startIcon={<Logout />}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Lateral Fixo */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            backgroundColor: '#101a8dff',
            color: '#ffffff',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Logo no topo do Menu */}
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, height: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }} component={RouterLink} to="/">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: '40px', marginRight: '12px' }}
            />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              SESI Garavelo
            </Typography>
          </Box>
        </Toolbar>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Informações do Usuário */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{userName}</Typography>
            <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>{userRole}</Typography>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Lista de Links de Navegação */}
        <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }} className="custom-scrollbar">
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#FFC800', 
                      color: '#101a8dff',
                      fontWeight: 'bold',
                      '& .MuiListItemIcon-root': {
                        color: '#101a8dff',
                      },
                    },
                     '&.Mui-selected:hover': {
                      backgroundColor: '#FFD700',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 0, 
          minHeight: '100vh',
          width: `calc(100% - ${drawerWidth}px)`
        }}
      >
        <Toolbar /> {/* Espaçador para o AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;