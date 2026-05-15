// src/pages/ForbiddenPage.js
import React from 'react';

const ForbiddenPage = ({ onNavigate }) => (
  <div className="error-page">
    <div className="error-code" style={{ color: '#ef4444' }}>403</div>
    <h2 className="error-title">Access Denied</h2>
    <p className="error-desc">You don't have permission to view this page. Contact your administrator.</p>
    <button className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
      ← Back to Dashboard
    </button>
  </div>
);

export default ForbiddenPage;
