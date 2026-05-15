// src/pages/NotFoundPage.js
import React from 'react';

const NotFoundPage = ({ onNavigate }) => (
  <div className="error-page">
    <div className="error-code">404</div>
    <h2 className="error-title">Page Not Found</h2>
    <p className="error-desc">The page you're looking for doesn't exist or has been moved.</p>
    <button className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
      ← Back to Dashboard
    </button>
  </div>
);

export default NotFoundPage;
