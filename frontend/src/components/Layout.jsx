import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import SidebarItems from './SidebarItems'; // Importa os links do menu

const drawerWidth = 240; // Largura do menu lateral

export default function Layout({ toggleTheme }) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  // Verifica se o usuário está logado, senão, redireciona para o login
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // --- CORREÇÃO: Verificação de token mais robusta ---
    // Impede que um token "undefined" (string) seja considerado válido
    if (!token || token === 'undefined') {
      navigate('/');
    }
  }, [navigate]);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Conteúdo do menu lateral
  const drawer = (
    <div>
      <Toolbar /> {/* Espaçador para ficar abaixo da barra superior */}
      <List>
        <SidebarItems />
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Barra Superior (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} // Ícone do menu (só aparece no mobile)
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Secretaria Escolar
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Menu Lateral (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Gaveta temporária (Mobile) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhor performance em mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Gaveta permanente (Desktop) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Conteúdo Principal da Página */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // Padding
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Espaçador para o conteúdo não ficar atrás da AppBar */}
        <Outlet /> {/* Aqui é onde o React Router renderiza a página atual (ex: Dashboard, Alunos) */}
      </Box>
    </Box>
  );
}