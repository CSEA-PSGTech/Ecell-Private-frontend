import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { APP_CONFIG, NAV_LINKS } from '@/utils/constants';
import { Button } from '../common/Button';
import './Navbar.css';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar-header glass-panel">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => onNavigate('/')}>
          <div className="logo-badge">🚀</div>
          <div>
            <span className="brand-title">{APP_CONFIG.NAME}</span>
            <span className="brand-subtitle">{APP_CONFIG.ORGANIZATION}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${currentPath === link.path ? 'active' : ''}`}
              onClick={() => onNavigate(link.path)}
            >
              {link.label}
              {link.badge && <span className="nav-badge">{link.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('/dashboard')}>
            Member Portal
          </Button>
        </div>
      </div>
    </header>
  );
};
