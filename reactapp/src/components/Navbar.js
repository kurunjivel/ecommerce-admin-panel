// src/components/Navbar.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS = {
  SUPER_ADMIN: '#8b5cf6',
  ADMIN:       '#6366f1',
  MANAGER:     '#10b981',
  STAFF:       '#f59e0b',
};

const Navbar = ({ currentView, onNavigate, darkMode, onToggleDark }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const roleBg = ROLE_COLORS[user?.role] || '#6366f1';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-page-title">
          {currentView === 'dashboard'   && '📊 Dashboard'}
          {currentView === 'productList' && '📦 Products'}
          {currentView === 'productForm' && '✏️ Product Form'}
          {currentView === 'orderList'   && '🛒 Orders'}
          {currentView === 'orderDetails'&& '📋 Order Details'}
          {currentView === 'createOrder' && '➕ Create Order'}
          {currentView === 'customers'   && '👥 Customers'}
          {currentView === 'settings'    && '⚙️ Settings'}
        </span>
      </div>

      <div className="navbar-right">
        {/* Dark mode toggle */}
        <button className="icon-btn" onClick={onToggleDark} title="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Profile dropdown */}
        <div className="profile-dropdown-wrapper">
          <button
            className="profile-btn"
            onClick={() => setProfileOpen(o => !o)}
          >
            <span
              className="avatar"
              style={{ background: roleBg }}
            >
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
            <span className="profile-name">{user?.name}</span>
            <span className="profile-caret">▾</span>
          </button>

          {profileOpen && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <strong>{user?.name}</strong>
                <span className="role-pill" style={{ background: roleBg }}>
                  {user?.role?.replace('_', ' ')}
                </span>
                <small>{user?.email}</small>
              </div>
              <div className="profile-menu-divider" />
              <button className="profile-menu-item" onClick={() => { onNavigate('settings'); setProfileOpen(false); }}>
                ⚙️ Settings
              </button>
              <button className="profile-menu-item danger" onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
