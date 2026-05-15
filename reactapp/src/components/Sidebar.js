// src/components/Sidebar.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

const allNavItems = [
  { key: 'dashboard',   icon: '📊', label: 'Dashboard',    roles: ['SUPER_ADMIN','ADMIN','MANAGER','STAFF'] },
  { key: 'productList', icon: '📦', label: 'Products',     roles: ['SUPER_ADMIN','ADMIN','MANAGER'] },
  { key: 'orderList',   icon: '🛒', label: 'Orders',       roles: ['SUPER_ADMIN','ADMIN','MANAGER','STAFF'] },
  { key: 'createOrder', icon: '➕', label: 'Create Order', roles: ['SUPER_ADMIN','ADMIN','MANAGER','STAFF'] },
  { key: 'customers',   icon: '👥', label: 'Customers',    roles: ['SUPER_ADMIN','ADMIN'] },
  { key: 'settings',    icon: '⚙️', label: 'Settings',    roles: ['SUPER_ADMIN','ADMIN','MANAGER','STAFF'] },
];

const Sidebar = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'STAFF';

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
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
        <div className="sidebar-user">
          <span className="avatar avatar-sm">{user?.name?.[0]?.toUpperCase()}</span>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-role">{role?.replace('_', ' ')}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Sign out">
          🚪
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
