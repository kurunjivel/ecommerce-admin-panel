import React, { useEffect, useState } from 'react';
import { getOrderById, updateOrderStatus } from '../utils/api';

const OrderDetails = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    getOrderById(orderId)
      .then(data => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch(err => {
        setError(err.message || 'Error loading order');
      });
  }, [orderId]);

  const handleSave = async () => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrder(updated);
      setSuccessMsg('Status updated');
    } catch (err) {
      setError(err.message || 'Failed to update');
    }
  };

  if (error) return <div>[Error - You need to specify the message]</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>{order.customerName}</p>
      <p>{order.customerEmail}</p>
      <p>{order.shippingAddress}</p>
      <p>{new Date(order.orderDate).toLocaleString()}</p>

      <table>
        <thead>
          <tr>
            <th>Product</th><th>Qty</th><th>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map(item => (
            <tr key={item.id}>
              <td>{item.product?.name}</td>
              <td>{item.quantity}</td>
              <td>${item.priceAtPurchase}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        </select>
        <button onClick={handleSave}>Save</button>
      </div>

      <p>Total: ${order.totalAmount.toFixed(2)}</p>
      {successMsg && <div>{successMsg}</div>}

      <button onClick={onBack}>Back to Orders</button>
    </div>
  );
};

export default OrderDetails;
