import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          Secretaria Escolar
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/alunos" className="nav-links">
              Alunos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/turmas" className="nav-links">
              Turmas
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/disciplinas" className="nav-links">
              Disciplinas
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/logout" className="nav-links-logout">
              Sair
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;