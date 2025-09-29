import React from 'react'; // Não precisa mais do useContext
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar nosso novo hook
import ThemeSwitcher from './ThemeSwitcher';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth(); // Usar o hook aqui

  // ... o resto do componente continua igual
  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-logo">
          <NavLink to="/">
            <span className="logo-text">Sesi Garavelo</span>
          </NavLink>
        </div>
        
        {user && (
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