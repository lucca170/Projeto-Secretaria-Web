import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Páginas
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos'; // Página de exemplo

function App() {
  // Estado para controlar o modo do tema (light ou dark)
  const [mode, setMode] = useState('light');

  // Função para alternar o tema
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Cria o tema MUI com base no modo atual
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline reseta o CSS padrão do navegador e aplica o fundo do tema */}
      <CssBaseline />
      <Routes>
        {/* Rota de Login (fora do layout do dashboard) */}
        <Route path="/" element={<Login />} />

        {/* Rotas do Dashboard (dentro do layout com menu) */}
        <Route path="/dashboard" element={<Layout toggleTheme={toggleTheme} />}>
          {/* A rota "index" é a página inicial do dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Exemplo de nova rota (http://.../dashboard/alunos) */}
          <Route path="alunos" element={<Alunos />} />

          {/* Adicione outras rotas aqui (ex: financeiro, pedagogico) */}
          {/* <Route path="financeiro" element={<PaginaFinanceiro />} /> */}
          {/* <Route path="pedagogico" element={<PaginaPedagogico />} /> */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;