import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api'; // Importar nosso configurador da API

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setUser(userData);
      } else {
        logout();
      }
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      // Usando o apiClient para fazer a requisição de login
      const response = await apiClient.post('/auth/login/', { email, password });
      
      const { key, user: userData } = response.data;

      localStorage.setItem('authToken', key);
      localStorage.setItem('userData', JSON.stringify(userData));
      setToken(key);
      setUser(userData);
      navigate('/');
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};