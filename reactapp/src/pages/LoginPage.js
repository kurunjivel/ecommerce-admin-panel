// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../utils/api';
import { toast } from 'react-toastify';

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi(form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Check your credentials.';
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
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              required
              data-testid="email-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              data-testid="password-input"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            data-testid="login-btn"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <button className="link-btn" onClick={() => onNavigate('register')}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
