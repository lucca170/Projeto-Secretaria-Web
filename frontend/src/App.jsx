// Em: frontend/src/App.jsx (VERSÃO CORRIGIDA)
import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios'; 

// Páginas Base
import Login from './pages/Login';
import Layout from './components/Layout';
import Home from './pages/Dashboard'; // Renomeado para Home

// --- 1. IMPORTAR AS NOVAS PÁGINAS ---
import EsqueciSenha from './pages/EsqueciSenha';
import VerificarCodigo from './pages/VerificarCodigo'; 
// --- FIM DA IMPORTAÇÃO ---

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

// Imports Admin
import RelatoriosGerenciais from './pages/RelatoriosGerenciais';
import AgendaProfessor from './pages/AgendaProfessor';
import GerenciarMateriais from './pages/GerenciarMateriais';
import GerenciarSalas from './pages/GerenciarSalas';
import AdicionarSala from './pages/AdicionarSala'; 
import AdicionarMaterial from './pages/AdicionarMaterial'; 
import GerenciarMaterias from './pages/GerenciarMaterias';
import AdicionarMateria from './pages/AdicionarMateria';   
import GerenciarProfessores from './pages/GerenciarProfessores';
import AdicionarProfessor from './pages/AdicionarProfessor';
// --- ADICIONANDO PÁGINAS QUE FALTAVAM NO SEU ARQUIVO ORIGINAL ---
import LancarFrequencia from './pages/LancarFrequencia';
import LancarNotas from './pages/LancarNotas';


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
          // Removido o Appbar global para o novo layout
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
          {/* Rotas de Login / Recuperação */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          
          {/* --- 2. ADICIONAR AS ROTAS AQUI --- */}
          <Route 
            path="/esqueci-senha" 
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <EsqueciSenha />} 
          />
          <Route 
            path="/verificar-codigo" 
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <VerificarCodigo onLoginSuccess={handleLoginSuccess} />} 
          />
          {/* --- FIM DAS NOVAS ROTAS --- */}


          {/* Rotas dentro do Layout */}
          <Route
            path="/"
            element={isLoggedIn ? <Layout toggleTheme={toggleTheme} onLogout={handleLogout} /> : <Navigate to="/login" />}
          >
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Home />} />
            
            <Route path="professores" element={<GerenciarProfessores />} />
            <Route path="professores/adicionar" element={<AdicionarProfessor />} />
            
            <Route path="alunos" element={<Alunos />} />
            <Route path="alunos/adicionar" element={<AdicionarAluno />} />
            <Route path="turmas" element={<ListaTurmas />} />
            <Route path="turmas/:turmaId" element={<DetalheTurma />} />
            <Route path="turmas/adicionar" element={<AdicionarTurma />} />
            
            {/* Adicionando as rotas que faltavam no seu App.jsx original */}
            <Route path="turmas/:turmaId/frequencia" element={<LancarFrequencia />} />
            <Route path="notas/lancar" element={<LancarNotas />} />

            <Route path="calendario" element={<CalendarioAcademico />} />
            <Route path="calendario/adicionar" element={<AdicionarEvento />} />
            <Route path="calendario/evento/:eventoId" element={<DetalheEvento />} />
            
            <Route path="biblioteca" element={<ListaLivros />} />
            <Route path="biblioteca/meus-emprestimos" element={<MeusEmprestimos />} />
            <Route path="biblioteca/adicionar-livro" element={<AdicionarLivro />} />
            <Route path="biblioteca/livro/:livroId" element={<EditarLivro />} /> 

            <Route path="relatorio/aluno/:alunoId" element={<RelatorioAluno />} />
            
            <Route path="relatorios" element={<RelatoriosGerenciais />} />
            <Route path="agenda" element={<AgendaProfessor />} />
            <Route path="materiais" element={<GerenciarMateriais />} />
            <Route path="salas" element={<GerenciarSalas />} />
            <Route path="salas/adicionar" element={<AdicionarSala />} />
            <Route path="materiais/adicionar" element={<AdicionarMaterial />} />
            <Route path="materias" element={<GerenciarMaterias />} /> 
            <Route path="materias/adicionar" element={<AdicionarMateria />} /> 

          </Route>

          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;