import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
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
  );
};

export default Navbar;