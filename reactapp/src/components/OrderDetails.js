// src/components/OrderDetails.js
import React, { useEffect, useState } from 'react';
import * as api from '../utils/api';

const OrderDetails = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getOrderById(orderId)
      .then(data => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch(err => setError(err.message || 'Error fetching order'));
  }, [orderId]);

  const handleSave = () => {
    api.updateOrderStatus(orderId, status)
      .then(updated => {
        setOrder(updated);
        setMessage('Status updated');
      })
      .catch(err => setError(err.message || 'Error updating status'));
  };

  if (error) {
    return <div data-testid="error-message">[Error - You need to specify the message]</div>;
  }

  if (!order) {
    return <div data-testid="loading-message">Loading...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <div data-testid="customer-name">{order.customerName}</div>
      <div data-testid="customer-email">{order.customerEmail}</div>
      <div data-testid="shipping-address">{order.shippingAddress}</div>
      <div data-testid="order-date">{new Date(order.orderDate).toLocaleString()}</div>
      <div>
        <label htmlFor="status">Order Status:</label>
        <select
          id="status"
          aria-label="Order Status:"
          data-testid="status-dropdown"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>
      <button data-testid="save-button" onClick={handleSave}>Save</button>
      {message && <div data-testid="success-message">{message}</div>}
      <h2>Order Items</h2>
      <table data-testid="order-items-table">

<thead>
<tr>
<th>Product</th>
<th>Quantity</th>
<th>Price at Purchase</th>
</tr>
</thead>
<tbody>
{order.orderItems.map(item => (
<tr key={item.id}>
<td>{item.product.name}</td>
<td>{item.quantity}</td>
<td>${item.priceAtPurchase.toFixed(2)}</td>
</tr>
))}
</tbody>
</table>
<div data-testid="total-amount">Total Amount: ${order.totalAmount.toFixed(2)}</div>
<button data-testid="back-button" onClick={onBack}>Back to Orders</button>
</div>
);
};

export default OrderDetails;