import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import './Alunos.css';

function Alunos() {
  const [alunos, setAlunos] = useState([]); // Garante que o valor inicial seja um array
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlunos = async () => {
      setError(null); // Limpa erros anteriores
      try {
        const response = await apiClient.get('/pedagogico/api/alunos/');
        
        // --- CORREÇÃO PRINCIPAL AQUI ---
        // Verificamos se a resposta (response.data) é um array.
        // Se não for, usamos um array vazio como padrão.
        // Isso previne o erro .map() de um valor undefined.
        const dadosAlunos = Array.isArray(response.data) ? response.data : [];
        
        setAlunos(dadosAlunos);

      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        setError("Não foi possível carregar os dados dos alunos.");
        setAlunos([]); // Em caso de erro, também garantimos que seja um array vazio
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  const handleSelecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Alunos</h1>
        <button className="btn-primary">Adicionar Aluno +</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="content-layout">
        <div className="lista-container card">
          <div className="table-responsive">
            <table className="alunos-table">
              <thead>
                <tr>
                  <th>Nome do Aluno</th>
                  <th>Matrícula</th>
                  <th>Turma</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="table-state">Carregando...</td></tr>
                ) : alunos.length > 0 ? (
                  alunos.map((aluno) => (
                    <tr
                      key={aluno.id}
                      className={aluno.id === alunoSelecionado?.id ? 'selecionado' : ''}
                      onClick={() => handleSelecionarAluno(aluno)}
                    >
                      <td>{aluno.nome}</td>
                      <td>{aluno.matricula}</td>
                      <td>{aluno.turma ? aluno.turma.nome : 'Sem turma'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="table-state">Nenhum aluno encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="detalhes-container">
          {alunoSelecionado ? (
            <div>
              <div className="card-detalhes card">
                <div className="card-header">
                  <h3>Informações Pessoais</h3>
                </div>
                <div className="card-body">
                  <p><strong>Nome:</strong> {alunoSelecionado.nome}</p>
                  <p><strong>Matrícula:</strong> {alunoSelecionado.matricula}</p>
                  <p><strong>Turma:</strong> {alunoSelecionado.turma ? `${alunoSelecionado.turma.nome} (${alunoSelecionado.turma.turno})` : 'Não definida'}</p>
                </div>
              </div>
              <div className="card-detalhes card">
                <div className="card-header">
                  <h3>Advertências</h3>
                </div>
                <div className="card-body">
                  {alunoSelecionado.advertencias && alunoSelecionado.advertencias.length > 0 ? (
                    <ul>{alunoSelecionado.advertencias.map((adv, i) => <li key={i}><strong>{adv.data}:</strong> {adv.motivo}</li>)}</ul>
                  ) : <p className="nenhum-registro">Nenhum registro de advertência.</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="card empty-details">
              <h3>Selecione um aluno</h3>
              <p>Clique em um aluno na tabela para ver seus detalhes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alunos;