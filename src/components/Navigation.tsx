import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navigationItems = [
    { name: 'Početna', path: '/main', exact: true },
    { name: 'Kako funkcioniše', path: '/main/kako-funkcionise' },
    { name: 'Podržani fakulteti', path: '/main/podrzani-fakulteti' },
    { name: 'Demo', path: '/main/demonstracija' },
    { name: 'Cene', path: '/main/cene' },
    { name: 'FAQ', path: '/main/faq' },
    { name: 'Kontakt', path: '/main/kontakt' }
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <Link to="/main" className="nav-brand">
          <div className="nav-logo">
            <div className="nav-logo-icon" />
          </div>
          <span className="nav-brand-name">FAXit</span>
        </Link>

        <div className="nav-menu">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="nav-user-greeting">
                Zdravo, {user?.firstName}!
              </span>
              <Link to="/dashboard" className="nav-login">
                Dashboard
              </Link>
              <button onClick={logout} className="nav-cta">
                Odjava
              </button>
            </>
          ) : (
            <>
              <Link to="/main/login" className="nav-login">
                Prijava
              </Link>
              <Link to="/main/register" className="nav-cta">
                Započni
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;