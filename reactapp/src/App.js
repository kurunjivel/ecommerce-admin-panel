// src/App.js
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar      from './components/Sidebar';
import Dashboard    from './components/Dashboard';
import ProductList  from './components/ProductList';
import ProductForm  from './components/ProductForm';
import OrderList    from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import CreateOrder  from './components/CreateOrder';

function App() {
  const [view, setView]                     = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId]     = useState(null);
  const [darkMode, setDarkMode]             = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // ── Navigation ─────────────────────────────────────────────────

  const navigate = (target) => {
    setView(target);
    setSelectedProductId(null);
    setSelectedOrderId(null);
  };

  // ── Product handlers ───────────────────────────────────────────

  const handleCreateProduct = () => {
    setSelectedProductId(null);
    setView('productForm');
  };

  const handleEditProduct = (id) => {
    setSelectedProductId(id);
    setView('productForm');
  };

  const handleSaveProduct = () => {
    setView('productList');
  };

  const handleCancelProduct = () => {
    setView('productList');
  };

  // ── Order handlers ─────────────────────────────────────────────

  const handleViewOrder = (id) => {
    setSelectedOrderId(id);
    setView('orderDetails');
  };

  const handleBackToOrders = () => {
    setView('orderList');
  };

  const handleOrderCreated = () => {
    setView('orderList');
  };

  return (
    <div className={`app-layout ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar
        currentView={view}
        onNavigate={navigate}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />

      <main className="main-content">
        {view === 'dashboard' && (
          <Dashboard onNavigate={navigate} />
        )}

        {view === 'productList' && (
          <ProductList
            onEditProduct={handleEditProduct}
            onCreateProduct={handleCreateProduct}
          />
        )}

        {view === 'productForm' && (
          <ProductForm
            productId={selectedProductId}
            onSave={handleSaveProduct}
            onCancel={handleCancelProduct}
          />
        )}

        {view === 'orderList' && (
          <OrderList onViewOrder={handleViewOrder} />
        )}

        {view === 'orderDetails' && selectedOrderId && (
          <OrderDetails
            orderId={selectedOrderId}
            onBack={handleBackToOrders}
          />
        )}

        {view === 'createOrder' && (
          <CreateOrder onOrderCreated={handleOrderCreated} />
        )}
      </main>

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

export default App;
