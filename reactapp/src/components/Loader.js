// src/components/Loader.js
import React from 'react';

const Loader = ({ message = 'Loading...' }) => (
  <div className="state-container">
    <div className="spinner" aria-label="Loading"></div>
    <p className="state-text">{message}</p>
  </div>
);

export default Loader;
