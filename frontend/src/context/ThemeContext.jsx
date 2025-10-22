// src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Função para detectar a preferência inicial
const getInitialTheme = () => {
  // 1a. Verifica se o usuário já salvou uma preferência
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // 1b. Se não, verifica a preferência do sistema operacional
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// 2. Criar o Contexto
const ThemeContext = createContext();

// 3. Criar o Provedor
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // 4. Efeito para aplicar a classe no <body> e salvar no localStorage
  useEffect(() => {
    // Remove a classe antiga e adiciona a nova
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    
    // Salva a preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 5. Função para trocar o tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 6. Fornece o tema e a função para os componentes filhos
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 7. Hook customizado para facilitar o uso do contexto
export const useTheme = () => useContext(ThemeContext);
