// src/pages/SettingsPage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SettingsPage = ({ darkMode, onToggleDark }) => {
  const { user } = useAuth();

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="card settings-card">
        <h2 className="section-title">👤 Profile</h2>
        <div className="settings-profile">
          <div className="avatar avatar-lg">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <p className="settings-name">{user?.name}</p>
            <p className="settings-email">{user?.email}</p>
            <span className="role-pill">{user?.role?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card settings-card">
        <h2 className="section-title">🎨 Appearance</h2>
        <div className="settings-row">
          <div>
            <p className="settings-label">Dark Mode</p>
            <p className="settings-desc">Switch between light and dark interface</p>
          </div>
          <button
            className={`toggle-btn ${darkMode ? 'toggle-btn--on' : ''}`}
            onClick={onToggleDark}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="card settings-card">
        <h2 className="section-title">ℹ️ About</h2>
        <div className="about-grid">
          <div className="about-item"><span>Version</span><strong>2.0.0</strong></div>
          <div className="about-item"><span>Stack</span><strong>Spring Boot + React</strong></div>
          <div className="about-item"><span>Database</span><strong>MySQL 8.0</strong></div>
          <div className="about-item"><span>Auth</span><strong>JWT + Spring Security</strong></div>
          <div className="about-item">
            <span>API Docs</span>
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
              Open Swagger →
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card settings-card">
        <h2 className="section-title">🚀 Quick Actions</h2>
        <div className="settings-actions">
          <button className="btn btn-outline" onClick={() => { toast.info('Cache cleared!'); }}>
            🗑️ Clear Cache
          </button>
          <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-outline">
            📖 API Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
