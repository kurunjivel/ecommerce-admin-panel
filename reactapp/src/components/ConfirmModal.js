// src/components/ConfirmModal.js
import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay" role="dialog" aria-modal="true">
    <div className="modal-box">
      <p className="modal-message">{message}</p>
      <div className="modal-actions">
        <button className="btn btn-danger" onClick={onConfirm} data-testid="confirm-yes">Yes, Delete</button>
        <button className="btn btn-secondary" onClick={onCancel} data-testid="confirm-no">Cancel</button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
