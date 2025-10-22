<<<<<<< HEAD
// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
=======
import React from 'react';
import { NavLink } from 'react-router-dom';
>>>>>>> 0619855925e5aad0ec7553204e69828ab97532e1
import './Navbar.css';

const Navbar = () => {
  return (
<<<<<<< HEAD
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Secretaria Web</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
        {/* Adicione outros links aqui */}
      </ul>
      <div className="navbar-actions">
        {/* 2. Adicionar o botão aqui */}
        <ThemeToggleButton />
      </div>
    </nav>
=======
    <header className="header">
      <nav className="navbar">
        <NavLink to="/dashboard" className="navbar-logo">
          Secretaria Web
        </NavLink>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/alunos" className="nav-links" activeClassName="active">
              Alunos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/turmas" className="nav-links" activeClassName="active">
              Turmas
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/disciplinas" className="nav-links" activeClassName="active">
              Disciplinas
            </NavLink>
          </li>
        </ul>
        <div className="nav-logout">
            <NavLink to="/logout" className="logout-button">
              Sair
            </NavLink>
        </div>
      </nav>
    </header>
>>>>>>> 0619855925e5aad0ec7553204e69828ab97532e1
  );
};

export default Navbar;