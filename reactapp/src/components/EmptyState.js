// src/components/EmptyState.js
import React from 'react';

const EmptyState = ({ icon = '📭', message = 'No data found.' }) => (
  <div className="state-container empty-state">
    <span className="state-icon">{icon}</span>
    <p className="state-text">{message}</p>
  </div>
);

export default EmptyState;
