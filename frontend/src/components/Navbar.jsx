import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-logo">
          <NavLink to="/">
            {/* Você pode substituir isso por um SVG do seu logo */}
            <span className="logo-text">SecretariaWeb</span>
          </NavLink>
        </div>
        <ul className="navbar-links">
          <li><NavLink to="/alunos">Alunos</NavLink></li>
          <li><NavLink to="/turmas">Turmas</NavLink></li>
          <li><NavLink to="/professores">Professores</NavLink></li>
        </ul>
        <div className="navbar-actions">
          <ThemeSwitcher />
          {/* Pode adicionar um menu de usuário aqui no futuro */}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;