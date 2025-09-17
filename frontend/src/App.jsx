import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />x
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alunos" element={<Alunos />} />
      </Routes>
    </Router>
  );
}

export default App;