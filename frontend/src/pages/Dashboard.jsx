import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1>Painel de Controle</h1>
        <p>Bem-vindo ao sistema de secretaria escolar!</p>
      </div>
    </div>
  );
};

export default Dashboard;