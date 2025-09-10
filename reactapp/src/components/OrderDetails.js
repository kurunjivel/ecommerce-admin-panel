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
    return <div>[Error - You need to specify the message]</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <div>Customer Name: {order.customerName}</div>
      <div>Email: {order.customerEmail}</div>
      <div>Shipping Address: {order.shippingAddress}</div>
      <div>Order Date: {new Date(order.orderDate).toLocaleString()}</div>
      <div>
        <label htmlFor="status">Order Status:</label>
        <select
          id="status"
          aria-label="Order Status:"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>
      <button onClick={handleSave}>Save</button>
      {message && <div>{message}</div>}
      <h2>Order Items</h2>
      <table>
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
      <div>Total Amount: ${order.totalAmount.toFixed(2)}</div>
      <button onClick={onBack}>Back to Orders</button>
    </div>
  );
};

export default OrderDetails;
