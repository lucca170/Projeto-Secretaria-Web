import React, { useState, useEffect } from 'react';
import './Alunos.css';

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de chamada de API
    setTimeout(() => {
      const dadosApi = [
        { id: 1, nome: 'Ana Beatriz Costa', matricula: '2025001', turma: '3º Ano A', advertencias: [], recados: [] },
        { id: 2, nome: 'Carlos Eduardo Lima', matricula: '2025002', turma: '2º Ano B', advertencias: [{ data: '20/08/2025', motivo: 'Material incompleto.' }], recados: [] },
        { id: 3, nome: 'Fernanda Gonçalves', matricula: '2025003', turma: '3º Ano A', advertencias: [], recados: [{ data: '22/08/2025', texto: 'Avisar os pais sobre a reunião.' }] },
      ];
      setAlunos(dadosApi);
      setLoading(false);
    }, 1000);
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
                      <td>{aluno.turma}</td>
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
                  <p><strong>Turma:</strong> {alunoSelecionado.turma}</p>
                </div>
              </div>
              <div className="card-detalhes card">
                <div className="card-header">
                  <h3>Advertências</h3>
                </div>
                <div className="card-body">
                  {alunoSelecionado.advertencias.length > 0 ? (
                    <ul>{alunoSelecionado.advertencias.map((adv, i) => <li key={i}><strong>{adv.data}:</strong> {adv.motivo}</li>)}</ul>
                  ) : <p className="nenhum-registro">Nenhum registro encontrado.</p>}
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