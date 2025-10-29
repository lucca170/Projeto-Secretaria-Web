import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios'; // Mantenha este se já adicionou

// Páginas Base
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import EventosExtracurriculares from './pages/EventosExtracurriculares';
import CalendarioAcademico from './pages/CalendarioAcademico';
import RelatorioAluno from './pages/RelatorioAluno'; // <-- ADICIONE ESTA LINHA

// REMOVEMOS: useAuth e ProtectedRoute pois não temos useAuth.js

function App() {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // Mantém a alternância light/dark
          primary: {
            main: '#101a8dff', // Verde principal
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#FFC800', // Amarelo para contraste
            contrastText: '#333333',
          },
          background: {
            default: mode === 'light' ? '#f4f6f8' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#e0e0e0',
            secondary: mode === 'light' ? '#666666' : '#b0b0b0',
          }
        },
        typography: {
          fontFamily: '"Poppins", Arial, sans-serif',
          h4: {
            fontWeight: 600,
          },
          // Outras customizações de tipografia podem ser adicionadas aqui
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '20px',
                textTransform: 'none',
              },
              containedPrimary: {
                // Estilos específicos se necessário
              },
              outlinedPrimary: {
                borderColor: '#ffffff',
                color: '#ffffff',
                '&:hover': {
                  borderColor: '#dddddd',
                  color: '#dddddd',
                }
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: '#207ed6ff',
                boxShadow: 'none',
              }
            }
          },
          // Adicione overrides para outros componentes se desejar
        }
      }),
    [mode],
  );

  // Atualize a lógica de login para usar o token do localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      return true;
    }
    return false;
  });

  const handleLoginSuccess = () => {
    // O token já foi setado no header pelo Login.jsx
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    // O navigate('/login') pode ficar no Layout.jsx ou aqui
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Rota de Login */}
          {/* Passa a função para marcar como logado */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />

          {/* Rotas dentro do Layout */}
          <Route
            path="/"
            element={isLoggedIn ? <Layout toggleTheme={toggleTheme} onLogout={handleLogout} /> : <Navigate to="/login" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="alunos" element={<Alunos />} />
            <Route path="calendario" element={<CalendarioAcademico />} />
            <Route path="eventos" element={<EventosExtracurriculares />} />
            <Route path="relatorio/:alunoId" element={<RelatorioAluno />} />
            <Route path="relatorio/aluno/:alunoId" element={<RelatorioAluno />} />
            {/* ADICIONAREMOS NOVAS ROTAS AQUI DEPOIS */}
          </Route>

          {/* Rota para "não encontrado" */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
