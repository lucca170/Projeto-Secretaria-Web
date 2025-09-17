import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import './App.css';

// Componente para renderizar o layout principal com Navbar
const MainLayout = () => {
  const location = useLocation();
  // Não mostra o Navbar na página de login
  const showNavbar = location.pathname !== '/login';

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alunos" element={<Alunos />} />
            {/* Adicione outras rotas que usam o layout principal aqui */}
          </Routes>
        </div>
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de Login sem o layout principal */}
        <Route path="/login" element={<Login />} />
        {/* Todas as outras rotas usarão o MainLayout */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;