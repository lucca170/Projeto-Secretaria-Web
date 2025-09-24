import React, { useContext, useEffect } from 'react'; // Adicionar useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Alunos from './pages/Alunos';
import Turmas from './pages/Turmas';
import Professores from './pages/Professores';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
// Removi a rota de Atividades que não estava na Navbar para simplificar
// import Atividades from './pages/Atividades'; 
// import Calendario from './pages/Calendario';

function App() {
  const { theme } = useContext(ThemeContext);

  // Este efeito vai aplicar o tema diretamente no <body> do HTML
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/turmas" element={<Turmas />} />
          <Route path="/professores" element={<Professores />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;