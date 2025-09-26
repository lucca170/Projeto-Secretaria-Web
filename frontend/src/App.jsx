import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { ThemeContext } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import Turmas from './pages/Turmas';
import Professores from './pages/Professores';

function App() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Rotas que precisam de login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/turmas" element={<Turmas />} />
            <Route path="/professores" element={<Professores />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;