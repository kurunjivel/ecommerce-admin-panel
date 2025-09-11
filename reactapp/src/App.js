// src/App.js
import React, { useState } from 'react';
import OrderDetails from './components/OrderDetails';
import OrderList from './components/OrderList';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  const [view, setView] = useState('productList'); // 'productList', 'orderList', 'productForm', 'orderDetails'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Product handlers
  const handleCreateProduct = () => {
    setSelectedProductId(null);
    setView('productForm');
  };

  const handleEditProduct = (id) => {
    setSelectedProductId(id);
    setView('productForm');
  };

  const handleSaveProduct = (savedProduct) => {
    // Could refresh list or just return to list
    setView('productList');
  };

  const handleCancelProduct = () => {
    setView('productList');
  };

  // Order handlers
  const handleViewOrder = (id) => {
    setSelectedOrderId(id);
    setView('orderDetails');
  };

  const handleBackToOrders = () => {
    setView('orderList');
  };

  return (
    <div className="App">
      {/* Conditional Rendering */}
      {view === 'productList' && (
        <ProductList
          onEditProduct={handleEditProduct}
          onDeleteProduct={(id) => console.log('Delete product', id)}
          onCreateProduct={handleCreateProduct}
        />
      )}

      {view === 'orderList' && (
        <OrderList
          onViewOrder={handleViewOrder}
        />
      )}

      {view === 'orderDetails' && selectedOrderId && (
        <OrderDetails
          orderId={selectedOrderId}
          onBack={handleBackToOrders}
        />
      )}

      {view === 'productForm' && (
        <ProductForm
          onSave={handleSaveProduct}
          onCancel={handleCancelProduct}
        />
      )}

      {/* Navigation Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setView('productList')}>Product List</button>
        <button onClick={() => setView('orderList')}>Order List</button>
      </div>
    </div>
  );
}

export default App;
