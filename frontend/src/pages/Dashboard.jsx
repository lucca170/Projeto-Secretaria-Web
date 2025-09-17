import React from 'react';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="container">
        <h1 className="dashboard-title">Painel de Controle</h1>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Alunos</h2>
            <p>Gerenciar alunos, matrículas e informações.</p>
            <a href="/alunos" className="card-link">Ver Alunos</a>
          </div>
          <div className="dashboard-card">
            <h2>Turmas</h2>
            <p>Administrar turmas, horários e professores.</p>
            <a href="/turmas" className="card-link">Ver Turmas</a>
          </div>
          <div className="dashboard-card">
            <h2>Disciplinas</h2>
            <p>Visualizar e editar as disciplinas oferecidas.</p>
            <a href="/disciplinas" className="card-link">Ver Disciplinas</a>
          </div>
           <div className="dashboard-card upcoming-events">
            <h2>Próximos Eventos</h2>
            <ul>
              <li>Reunião de Pais - 25/10</li>
              <li>Feira de Ciências - 05/11</li>
              <li>Feriado - 15/11</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;