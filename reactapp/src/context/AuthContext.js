// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    const { token, name, email, role } = authResponse;
    const userData = { name, email, role };
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const hasRole = (...roles) => user && roles.includes(user.role);
  const isAdmin = () => hasRole('SUPER_ADMIN', 'ADMIN');
  const isManager = () => hasRole('SUPER_ADMIN', 'ADMIN', 'MANAGER');

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
