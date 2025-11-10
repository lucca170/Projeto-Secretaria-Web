// Em: frontend/src/App.jsx
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
import CalendarioAcademico from './pages/CalendarioAcademico';
import RelatorioAluno from './pages/RelatorioAluno'; 
import AdicionarEvento from './pages/AdicionarEvento';
import DetalheEvento from './pages/DetalheEvento';
import ListaTurmas from './pages/ListaTurmas';
import DetalheTurma from './pages/DetalheTurma';
import AdicionarTurma from './pages/AdicionarTurma';
import AdicionarAluno from './pages/AdicionarAluno';

// Imports da Biblioteca
import ListaLivros from './pages/ListaLivros';
import MeusEmprestimos from './pages/MeusEmprestimos';
import AdicionarLivro from './pages/AdicionarLivro'; 
import EditarLivro from './pages/EditarLivro';     

// --- IMPORTS ATUALIZADOS ---
import RelatoriosGerenciais from './pages/RelatoriosGerenciais';
import AgendaProfessor from './pages/AgendaProfessor';
import GerenciarMateriais from './pages/GerenciarMateriais';
import GerenciarSalas from './pages/GerenciarSalas';
import AdicionarSala from './pages/AdicionarSala'; 
import AdicionarMaterial from './pages/AdicionarMaterial'; 
import GerenciarMaterias from './pages/GerenciarMaterias';
import AdicionarMateria from './pages/AdicionarMateria';   
import GerenciarProfessores from './pages/GerenciarProfessores'; // <-- NOVO
import AdicionarProfessor from './pages/AdicionarProfessor';   // <-- NOVO
// --- FIM IMPORTS ---


function App() {
  // ... (código do 'theme' e 'login' continua igual) ...
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, 
          primary: { main: '#101a8dff', contrastText: '#ffffff', },
          secondary: { main: '#FFC800', contrastText: '#333333', },
          background: { default: mode === 'light' ? '#f4f6f8' : '#121212', paper: mode === 'light' ? '#ffffff' : '#1e1e1e', },
          text: { primary: mode === 'light' ? '#333333' : '#e0e0e0', secondary: mode === 'light' ? '#666666' : '#b0b0b0', }
        },
        typography: { fontFamily: '"Poppins", Arial, sans-serif', h4: { fontWeight: 600, }, },
        components: { 
          MuiButton: { 
            styleOverrides: { 
              root: { 
                borderRadius: '20px', 
                textTransform: 'none', 
              },
            } 
          },
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
            
            {/* Rotas de Professores (NOVO) */}
            <Route path="professores" element={<GerenciarProfessores />} />
            <Route path="professores/adicionar" element={<AdicionarProfessor />} />
            
            {/* Rotas de Alunos e Turmas */}
            <Route path="alunos" element={<Alunos />} />
            <Route path="alunos/adicionar" element={<AdicionarAluno />} />
            <Route path="turmas" element={<ListaTurmas />} />
            <Route path="turmas/:turmaId" element={<DetalheTurma />} />
            <Route path="turmas/adicionar" element={<AdicionarTurma />} />

            {/* Rotas de Calendário */}
            <Route path="calendario" element={<CalendarioAcademico />} />
            <Route path="calendario/adicionar" element={<AdicionarEvento />} />
            <Route path="calendario/evento/:eventoId" element={<DetalheEvento />} />
            
            {/* Rotas da Biblioteca */}
            <Route path="biblioteca" element={<ListaLivros />} />
            <Route path="biblioteca/meus-emprestimos" element={<MeusEmprestimos />} />
            <Route path="biblioteca/adicionar-livro" element={<AdicionarLivro />} />
            <Route path="biblioteca/livro/:livroId" element={<EditarLivro />} /> 

            {/* Rota de Relatório Individual */}
            <Route path="relatorio/aluno/:alunoId" element={<RelatorioAluno />} />
            
            {/* --- ROTAS ATUALIZADAS --- */}
            <Route path="relatorios" element={<RelatoriosGerenciais />} />
            <Route path="agenda" element={<AgendaProfessor />} />
            <Route path="materiais" element={<GerenciarMateriais />} />
            <Route path="salas" element={<GerenciarSalas />} />
            <Route path="salas/adicionar" element={<AdicionarSala />} />
            <Route path="materiais/adicionar" element={<AdicionarMaterial />} />
            <Route path="materias" element={<GerenciarMaterias />} /> 
            <Route path="materias/adicionar" element={<AdicionarMateria />} /> 
            {/* --- FIM NOVAS ROTAS --- */}

          </Route>

          {/* Rota para "não encontrado" */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;