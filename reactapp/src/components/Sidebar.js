// src/components/Sidebar.js
import React from 'react';

const navItems = [
  { key: 'dashboard',   icon: '📊', label: 'Dashboard'     },
  { key: 'productList', icon: '📦', label: 'Products'       },
  { key: 'orderList',   icon: '🛒', label: 'Orders'         },
  { key: 'createOrder', icon: '➕', label: 'Create Order'   },
];

const Sidebar = ({ currentView, onNavigate, darkMode, onToggleDark }) => (
  <aside className="sidebar">
    <div className="sidebar-brand">
      <span className="brand-icon">🛍️</span>
      <span className="brand-name">AdminPanel</span>
    </div>

    <nav className="sidebar-nav">
      {navItems.map(item => (
        <button
          key={item.key}
          className={`nav-item ${currentView === item.key ? 'nav-item--active' : ''}`}
          onClick={() => onNavigate(item.key)}
          data-testid={`nav-${item.key}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="sidebar-footer">
      <button className="dark-mode-toggle" onClick={onToggleDark} title="Toggle dark mode">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  </aside>
);

export default Sidebar;
