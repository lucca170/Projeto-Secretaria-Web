import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

// Ícones SVG como componentes para o botão de tema
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;

const Navbar = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);
  
  const handleLogout = () => {
    // Adicione aqui sua lógica de logout (ex: limpar token)
    console.log("Usuário deslogado");
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-logo">
          SecretariaWeb
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/dashboard" className="nav-links">Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/alunos" className="nav-links">Alunos</NavLink>
          </li>
        </ul>
        <div className="nav-controls">
          <button onClick={toggleTheme} className="theme-toggle-button">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;