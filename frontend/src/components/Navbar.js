import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span role="img" aria-label="fitness">💪</span>
          FitTrack
        </Link>
        <button
          className="navbar-mobile-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
        {user ? (
          <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/exercise-log"
              className={`nav-link ${isActive('/exercise-log') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Exercise Log
            </Link>
            <Link
              to="/food-log"
              className={`nav-link ${isActive('/food-log') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Food Log
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;