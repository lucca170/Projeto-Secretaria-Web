import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-logo">
          <NavLink to="/">
            <span className="logo-text">SecretariaWeb</span>
          </NavLink>
        </div>
        
        {user && ( // Mostra os links apenas se o usuário estiver logado
          <ul className="navbar-links">
            <li><NavLink to="/alunos">Alunos</NavLink></li>
            <li><NavLink to="/turmas">Turmas</NavLink></li>
            <li><NavLink to="/professores">Professores</NavLink></li>
          </ul>
        )}

        <div className="navbar-actions">
          <ThemeSwitcher />
          {user && (
            <div className="user-info">
              <span>{user.first_name} ({user.cargo})</span>
              <button onClick={logout} className="btn-logout">Sair</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;