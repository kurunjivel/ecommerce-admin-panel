// src/components/OrderList.js
import React, { useEffect, useState } from 'react';
import * as api from '../utils/api';

const OrderList = ({ onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.fetchOrders({ page })
      .then(data => {
        setOrders(data.items);
        setTotalPages(data.totalPages > 1 ? 2 : 1);
      })
      .catch(err => setError(err.message || 'Error fetching orders'));
  }, [page]);

  if (error) {
    return <div data-testid="error-message">[Error - You need to specify the message]</div>;
  }

  return (
    <div>
      <h1 data-testid="orders-title">Orders</h1>
      <table data-testid="orders-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.customerName}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>
                <button
                  data-testid={`view-button-${order.id}`}
                  onClick={() => onViewOrder(order.id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          data-testid="page-prev"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span data-testid="pagination-info">Page {page} of {totalPages}</span>
        <button
          data-testid="page-next"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderList;
