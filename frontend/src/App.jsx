import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios'; 


// Páginas Base
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import EventosExtracurriculares from './pages/EventosExtracurriculares';
import CalendarioAcademico from './pages/CalendarioAcademico';
import RelatorioAluno from './pages/RelatorioAluno'; 
import AdicionarEvento from './pages/AdicionarEvento';
import DetalheEvento from './pages/DetalheEvento';
import ListaTurmas from './pages/ListaTurmas';
import DetalheTurma from './pages/DetalheTurma';

// --- ADICIONE ESTES IMPORTS ---
import AdicionarTurma from './pages/AdicionarTurma';
import AdicionarAluno from './pages/AdicionarAluno';
// ------------------------------


function App() {
  // ... (código existente do App: theme, login, logout...)
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        // ... (seu tema existente)
        palette: {
          mode, 
          primary: { main: '#101a8dff', contrastText: '#ffffff', },
          secondary: { main: '#FFC800', contrastText: '#333333', },
          background: { default: mode === 'light' ? '#f4f6f8' : '#121212', paper: mode === 'light' ? '#ffffff' : '#1e1e1e', },
          text: { primary: mode === 'light' ? '#333333' : '#e0e0e0', secondary: mode === 'light' ? '#666666' : '#b0b0b0', }
        },
        typography: { fontFamily: '"Poppins", Arial, sans-serif', h4: { fontWeight: 600, }, },
        components: { 
          MuiButton: { styleOverrides: { root: { borderRadius: '20px', textTransform: 'none', }, outlinedPrimary: { borderColor: '#ffffff', color: '#ffffff', '&:hover': { borderColor: '#dddddd', color: '#dddddd',} } } },
          MuiAppBar: { styleOverrides: { root: { backgroundColor: '#207ed6ff', boxShadow: 'none', } } },
        }
      }),
    [mode],
  );

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      return true;
    }
    return false;
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Rota de Login */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />

          {/* Rotas dentro do Layout */}
          <Route
            path="/"
            element={isLoggedIn ? <Layout toggleTheme={toggleTheme} onLogout={handleLogout} /> : <Navigate to="/login" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="alunos" element={<Alunos />} />
            <Route path="turmas" element={<ListaTurmas />} />
            <Route path="turmas/:turmaId" element={<DetalheTurma />} />
            
            {/* --- ADICIONE ESTAS ROTAS --- */}
            <Route path="alunos/adicionar" element={<AdicionarAluno />} />
            <Route path="turmas/adicionar" element={<AdicionarTurma />} />
            {/* --------------------------- */}

            <Route path="calendario" element={<CalendarioAcademico />} />
            <Route path="calendario/adicionar" element={<AdicionarEvento />} />
            <Route path="calendario/evento/:eventoId" element={<DetalheEvento />} />
            <Route path="eventos" element={<EventosExtracurriculares />} />
            <Route path="relatorio/aluno/:alunoId" element={<RelatorioAluno />} />
            {/* (a rota 'relatorio/:alunoId' está duplicada, removi) */}
          </Route>

          {/* Rota para "não encontrado" */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;