// src/App.js
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar       from './components/Sidebar';
import Navbar        from './components/Navbar';
import Dashboard     from './components/Dashboard';
import ProductList   from './components/ProductList';
import ProductForm   from './components/ProductForm';
import OrderList     from './components/OrderList';
import OrderDetails  from './components/OrderDetails';
import CreateOrder   from './components/CreateOrder';
import CustomersPage from './pages/CustomersPage';
import SettingsPage  from './pages/SettingsPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import NotFoundPage  from './pages/NotFoundPage';

// ── Inner app (auth-aware) ────────────────────────────────────────────────────
function InnerApp() {
  const { user, loading } = useAuth();

  const [view, setView]                         = useState('dashboard');
  const [authView, setAuthView]                 = useState('login');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId]   = useState(null);
  const [darkMode, setDarkMode]                 = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  if (loading) {
    return (
      <div className="auth-page">
        <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
      </div>
    );
  }

  // ── Not logged in → show Login / Register ──────────────────────────────────
  if (!user) {
    return (
      <div className={darkMode ? 'dark-mode' : ''}>
        {authView === 'login'    && <LoginPage    onNavigate={setAuthView} />}
        {authView === 'register' && <RegisterPage onNavigate={setAuthView} />}
        <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? 'dark' : 'light'} />
      </div>
    );
  }

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const navigate = (target) => {
    setView(target);
    setSelectedProductId(null);
    setSelectedOrderId(null);
  };

  const handleEditProduct   = (id) => { setSelectedProductId(id); setView('productForm'); };
  const handleCreateProduct = ()   => { setSelectedProductId(null); setView('productForm'); };
  const handleSaveProduct   = ()   => setView('productList');
  const handleViewOrder     = (id) => { setSelectedOrderId(id); setView('orderDetails'); };
  const handleOrderCreated  = ()   => setView('orderList');

  return (
    <div className={`app-layout ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar
        currentView={view}
        onNavigate={navigate}
      />

      <div className="app-main">
        <Navbar
          currentView={view}
          onNavigate={navigate}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
        />

        <main className="main-content">
          {view === 'dashboard'    && <Dashboard   onNavigate={navigate} />}
          {view === 'productList'  && <ProductList onEditProduct={handleEditProduct} onCreateProduct={handleCreateProduct} />}
          {view === 'productForm'  && <ProductForm productId={selectedProductId} onSave={handleSaveProduct} onCancel={() => setView('productList')} />}
          {view === 'orderList'    && <OrderList   onViewOrder={handleViewOrder} />}
          {view === 'orderDetails' && selectedOrderId && <OrderDetails orderId={selectedOrderId} onBack={() => setView('orderList')} />}
          {view === 'createOrder'  && <CreateOrder onOrderCreated={handleOrderCreated} />}
          {view === 'customers'    && <CustomersPage />}
          {view === 'settings'     && <SettingsPage darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />}
          {!['dashboard','productList','productForm','orderList','orderDetails','createOrder','customers','settings'].includes(view) && <NotFoundPage onNavigate={navigate} />}
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}

// ── Root app wrapped in AuthProvider ──────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
