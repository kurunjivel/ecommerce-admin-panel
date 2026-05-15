// src/components/ErrorMessage.js
import React from 'react';

const ErrorMessage = ({ message = 'Something went wrong.' }) => (
  <div className="state-container error-state">
    <span className="state-icon">⚠️</span>
    <p className="state-text">{message}</p>
  </div>
);

export default ErrorMessage;
