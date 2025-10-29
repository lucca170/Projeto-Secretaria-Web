import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Páginas Base (serão criadas a seguir)
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import EventosExtracurriculares from './pages/EventosExtracurriculares'; // <-- ADICIONE
import CalendarioAcademico from './pages/CalendarioAcademico';

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
          mode,
        },
      }),
    [mode],
  );

  // **** SIMULAÇÃO BÁSICA DE LOGIN ****
  // Vamos usar um estado simples para saber se o usuário está "logado"
  // SUBSTITUA ISSO pela sua lógica real com useAuth.js depois
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isSimulatedLoggedIn')); // Verifica se já simulamos login

  const handleLoginSuccess = () => {
    localStorage.setItem('isSimulatedLoggedIn', 'true'); // Marca como logado no localStorage
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isSimulatedLoggedIn'); // Remove a marca
    setIsLoggedIn(false);
    // Idealmente, redirecionar para /login aqui, mas pode ser feito no Layout
  };
  // **** FIM DA SIMULAÇÃO ****

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
