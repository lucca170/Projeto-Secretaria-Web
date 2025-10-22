// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import './Navbar.css';

const Navbar = () => {
  return (
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
  );
};

export default Navbar;