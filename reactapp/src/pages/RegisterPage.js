// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerApi } from '../utils/api';
import { toast } from 'react-toastify';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'];

const RegisterPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ADMIN' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerApi(form);
      login(data);
      toast.success('Account created! Welcome 🎉');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon-lg">🛍️</span>
          <h1 className="auth-title">AdminPanel</h1>
          <p className="auth-subtitle">Create a new admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-input"
              placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input"
              placeholder="john@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input"
              placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" className="form-input" value={form.role} onChange={handleChange}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <button className="link-btn" onClick={() => onNavigate('login')}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
