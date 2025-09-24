import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './Alunos.css'; 

const Alunos = () => {
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    // Lembre-se que este endpoint precisa ser criado na sua API Django
    fetch('/api/turmas-com-alunos/')
      .then(response => response.json())
      .then(data => setTurmas(data))
      .catch(error => console.error('Erro ao buscar turmas e alunos:', error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Lista de Alunos por Turma</h2>
        {turmas.map(turma => (
          <div key={turma.id}>
            <h3>{turma.nome} ({turma.turno})</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                </tr>
              </thead>
              <tbody>
                {turma.alunos.map(aluno => (
                  <tr key={aluno.id}>
                    <td>{aluno.nome}</td>
                    <td>{aluno.cpf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alunos;