import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação simples
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // --- LÓGICA DE LOGIN REAL IRIA AQUI ---
      // Exemplo:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!response.ok) throw new Error('Credenciais inválidas');
      // const data = await response.json();
      // localStorage.setItem('token', data.token);
      
      console.log('Login com:', { email, password });
      // Simulação de login bem-sucedido
      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'Falha ao fazer login.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Bem-vindo de volta</h1>
          <p>Faça login para acessar o painel</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;