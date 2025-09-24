import React, { useContext } from 'react'; // Importar useContext
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext'; // Importar o contexto
import Navbar from './components/Navbar';
import Alunos from './pages/Alunos';
import Turmas from './pages/Turmas';
import Professores from './pages/Professores';
import Atividades from './pages/Atividades';
import Calendario from './pages/Calendario';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const { theme } = useContext(ThemeContext); // Usar o contexto

  return (
    // Aplicar o atributo data-theme aqui
    <div className="App" data-theme={theme}>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/turmas" element={<Turmas />} />
            <Route path="/professores" element={<Professores />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/calendario" element={<Calendario />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;