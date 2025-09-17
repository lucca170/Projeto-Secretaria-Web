import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './Alunos.css';

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    fetch('/api/alunos/')
      .then(response => response.json())
      .then(data => setAlunos(data))
      .catch(error => console.error('Erro ao buscar alunos:', error));
  }, []);

  return (
    <div>
      <h2>Lista de Alunos</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.nome}</td>
              <td>{aluno.cpf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Alunos;
