
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Importar o hook

// Estilos simples para o botão (você pode usar seu CSS)
const buttonStyle = {
  padding: '10px 15px',
  fontSize: '1rem',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '8px',
  background: 'var(--primary-color)',
  color: 'white',
};

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={buttonStyle}>
      {/* Mostra um ícone diferente dependendo do tema */}
      {theme === 'light' ? 'Mudar para 🌙 (Escuro)' : 'Mudar para ☀️ (Claro)'}
    </button>
  );
};

export default ThemeToggleButton;
