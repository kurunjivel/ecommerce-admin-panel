// src/components/OrderDetails.js
import React, { useState, useEffect } from 'react';
import { getOrderById, updateOrderStatus } from '../utils/api';

const OrderDetails = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        setError(err.message || 'Order not found');
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleSave = async () => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrder(updated);
      setMessage('Status updated');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  if (error) return <div>{error}</div>;
  if (!order) return <div>Loading...</div>;

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
      <button onClick={onBack}>Back to Orders</button>

      {message && <div data-testid="success-message">{message}</div>}


<h2>Items</h2>
<table>
<thead>
<tr>
<th>Product</th>
<th>Qty</th>
<th>Price</th>
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

<h3>Total: <span>${order.totalAmount.toFixed(2)}</span></h3>
</div>
);
};

export default OrderDetails;