// Em: frontend/src/components/Layout.jsx
import React, { useState, useEffect } from 'react'; 
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Link as MuiLink } from '@mui/material';

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
  
  const getNavLinks = () => {
    const role = userData ? userData.cargo : null; 
    
    // --- Links Padrão (Admin/Coord) ---
    const adminLinks = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Alunos', path: '/alunos' },
      { label: 'Professores', path: '/professores' }, // <-- ADICIONADO AQUI
      { label: 'Turmas', path: '/turmas' },
      { label: 'Calendário', path: '/calendario' },
      { label: 'Biblioteca', path: '/biblioteca' },
      { label: 'Salas', path: '/salas' },
      { label: 'Materiais', path: '/materiais' },
      { label: 'Matérias', path: '/materias' }, 
      { label: 'Relatórios', path: '/relatorios' },
    ];
    
    // --- Links de Professor ---
    const professorLinks = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Minhas Turmas', path: '/turmas' }, 
      { label: 'Calendário', path: '/calendario' },
      { label: 'Minha Agenda', path: '/agenda' },
    ];
    
    // --- Links de Aluno ---
    const alunoLinks = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Meu Boletim', path: `/relatorio/aluno/${userData ? userData.aluno_id : ''}` }, 
      { label: 'Calendário', path: '/calendario' },
      { label: 'Biblioteca', path: '/biblioteca' },
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
    return [{ label: 'Dashboard', path: '/dashboard' }]; // Padrão
  };
  
  const navLinks = getNavLinks();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo e Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }} component={RouterLink} to="/">
            <img
              src="/logo.png"
              alt="SESI Garavelo Logo"
              style={{
                height: '40px',
                marginRight: '12px',
              }}
            />
            <Typography variant="h6" noWrap component="div">
              SESI Garavelo
            </Typography>
          </Box>

          {/* Links de Navegação Dinâmicos */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {navLinks.map((item) => (
              <MuiLink
                key={item.label}
                component={RouterLink}
                to={item.path}
                color="inherit"
                underline={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'always' : 'hover'}
                sx={{ fontWeight: location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'bold' : 'normal' }}
              >
                {item.label}
              </MuiLink>
            ))}
          </Box>

          {/* Botões de Ação + Logout */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo Principal */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 0
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;