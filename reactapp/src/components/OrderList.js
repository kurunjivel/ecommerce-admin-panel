// src/components/OrderList.js
import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../utils/api';

const PAGE_SIZE = 10;

const OrderList = ({ onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      }
    };
    loadOrders();
  }, []);

  if (error) return <div>{error}</div>;
  if (!orders.length) return <div>Loading...</div>;

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map(order => (
            <tr key={order.id}>
              <td>{order.customerName}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                <button data-testid={`view-button-${order.id}`} onClick={() => onViewOrder(order.id)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button data-testid="page-prev" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button data-testid="page-next" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderList;
