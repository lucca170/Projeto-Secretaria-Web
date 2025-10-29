import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Adiciona useNavigate
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

// REMOVEMOS: useAuth

function Layout({ toggleTheme, onLogout }) { // Recebe onLogout do App.jsx
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); // Chama a função passada pelo App
    navigate('/login'); // Redireciona para login após logout
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Secretaria Web
          </Typography>
          {/* Adicione seu ThemeToggleButton aqui se tiver */}
          <Button color="inherit" onClick={handleLogoutClick}>Logout</Button> {/* Chama handleLogoutClick */}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/alunos">
              <ListItemText primary="Alunos" />
            </ListItem>
            <ListItem button component={Link} to="/calendario">
              <ListItemText primary="Calendário" />
            </ListItem>
            <ListItem button component={Link} to="/eventos">
              <ListItemText primary="Eventos" />
            </ListItem>
            {/* ADICIONAREMOS NOVOS LINKS AQUI */}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;