import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

// Cria o contexto
const AuthContext = createContext();

// Cria o Provedor que irá envolver a aplicação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Adiciona um estado de carregamento inicial
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');

      if (storedToken && storedUserData && storedUserData !== 'undefined') {
        try {
          const userData = JSON.parse(storedUserData);
          setToken(storedToken);
          setUser(userData);
        } catch (e) {
          console.error("Dados de usuário corrompidos, limpando sessão.", e);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false); // Finaliza o carregamento inicial
    };
    
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login/', { email, password });
      
      if (response.data && response.data.key && response.data.user) {
        const { key, user: userData } = response.data;
        localStorage.setItem('authToken', key);
        localStorage.setItem('userData', JSON.stringify(userData));
        setToken(key);
        setUser(userData);
        navigate('/');
      } else {
        throw new Error('Resposta de login inválida do servidor.');
      }
    } catch (error) {
      console.error('Falha no login:', error.response?.data || error.message);
      throw new Error('Email ou senha inválidos.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Não renderiza nada até que a verificação inicial seja concluída
  if (loading) {
    return null; // Ou um componente de "Carregando..." em tela cheia
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Cria um "Hook" customizado para usar o contexto facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};