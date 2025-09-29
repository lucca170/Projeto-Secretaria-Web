import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import './Turmas.css'; 

function Turmas() {
  // Estados para as turmas 
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  
  // Estados para os alunos da turma selecionada
  const [alunos, setAlunos] = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);

  const [error, setError] = useState(null);

  // Efeito para buscar a lista de turmas quando o componente carrega
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        setLoadingTurmas(true);
        const response = await apiClient.get('pedagogico/turmas/');
        setTurmas(response.data);
      } catch (err) {
        setError('Não foi possível carregar as turmas.');
        console.error(err);
      } finally {
        setLoadingTurmas(false);
      }
    };
    fetchTurmas();
  }, []);

  // Função para buscar os alunos quando uma turma é selecionada
  const fetchAlunosPorTurma = async (turmaId) => {
    try {
      setLoadingAlunos(true);
      // Usamos o filtro que criamos no backend: /alunos/?turma=<turmaId>
      const response = await apiClient.get(`pedagogico/alunos/?turma=${turmaId}`);
      setAlunos(response.data);
    } catch (err) {
      setError('Não foi possível carregar os alunos desta turma.');
      console.error(err);
    } finally {
      setLoadingAlunos(false);
    }
  };

  // Manipulador de clique para selecionar uma turma
  const handleSelecionarTurma = (turma) => {
    setTurmaSelecionada(turma);
    setAlunos([]); // Limpa a lista de alunos anterior
    fetchAlunosPorTurma(turma.id);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Turmas e Alunos</h1>
        <button className="btn-primary">Adicionar Turma +</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="content-layout">
        {/* Coluna da Esquerda: Lista de Turmas */}
        <div className="lista-container card">
          <h3>Turmas</h3>
          <div className="table-responsive">
            <table className="turmas-table">
              <thead>
                <tr>
                  <th>Nome da Turma</th>
                  <th>Ano</th>
                  <th>Turno</th>
                </tr>
              </thead>
              <tbody>
                {loadingTurmas ? (
                  <tr><td colSpan="3" className="table-state">Carregando turmas...</td></tr>
                ) : turmas.length > 0 ? (
                  turmas.map((turma) => (
                    <tr
                      key={turma.id}
                      className={turma.id === turmaSelecionada?.id ? 'selecionado' : ''}
                      onClick={() => handleSelecionarTurma(turma)}
                    >
                      <td>{turma.nome}</td>
                      <td>{turma.ano}</td>
                      <td>{turma.turno}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="table-state">Nenhuma turma encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna da Direita: Detalhes e Alunos da Turma */}
        <div className="detalhes-container">
          {turmaSelecionada ? (
            <div className="card-detalhes card">
              <div className="card-header">
                <h3>Alunos da Turma: {turmaSelecionada.nome}</h3>
              </div>
              <div className="card-body">
                {loadingAlunos ? (
                  <p className="table-state">Carregando alunos...</p>
                ) : alunos.length > 0 ? (
                  <ul className="alunos-lista">
                    {alunos.map(aluno => (
                      <li key={aluno.id}>
                        <span className="aluno-nome">{aluno.nome}</span>
                        <span className="aluno-matricula">Matrícula: {aluno.matricula}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="table-state">Nenhum aluno encontrado nesta turma.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="card empty-details">
              <h3>Selecione uma turma</h3>
              <p>Clique em uma turma na tabela à esquerda para ver os alunos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Turmas;