// Em: frontend/src/components/Layout.jsx
import React from 'react';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Link as MuiLink } from '@mui/material';

function Layout({ toggleTheme, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

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

          {/* Links de Navegação */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            { [
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Alunos', path: '/alunos' },
              { label: 'Turmas', path: '/turmas' },
              { label: 'Calendário', path: '/calendario' },
              { label: 'Biblioteca', path: '/biblioteca' },
              // --- LINK "MEUS EMPRÉSTIMOS" REMOVIDO DESTA BARRA ---
            ].map((item) => (
              <MuiLink
                key={item.label}
                component={RouterLink}
                to={item.path}
                color="inherit"
                // --- MODIFICADO PARA CORRIGIR HIGHLIGHT ---
                underline={location.pathname.startsWith(item.path) && item.path !== '/' ? 'always' : 'hover'}
                sx={{ fontWeight: location.pathname.startsWith(item.path) && item.path !== '/' ? 'bold' : 'normal' }}
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