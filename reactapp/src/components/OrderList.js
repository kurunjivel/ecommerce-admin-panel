// src/components/OrderList.js
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchOrders, cancelOrder } from '../utils/api';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

const PAGE_SIZE = 10;

const STATUS_COLORS = {
  PENDING:   'status-pending',
  SHIPPED:   'status-shipped',
  DELIVERED: 'status-delivered',
  CANCELLED: 'status-cancelled',
};

const OrderList = ({ onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [page, setPage]     = useState(1);
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled and stock restored.');
      loadOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">🛒 Orders</h1>
      </div>

      {loading && <Loader />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && orders.length === 0 && (
        <EmptyState icon="🛒" message="No orders found yet." />
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="card table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, idx) => (
                  <tr key={order.id}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td><strong>{order.customerName}</strong></td>
                    <td>{order.customerEmail}</td>
                    <td className="price-cell">${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.orderDate}</td>
                    <td className="action-cell">
                      <button
                        className="btn btn-sm btn-outline"
                        data-testid={`view-button-${order.id}`}
                        onClick={() => onViewOrder(order.id)}
                      >
                        👁️ Details
                      </button>
                      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <button
                          className="btn btn-sm btn-danger"
                          data-testid={`cancel-button-${order.id}`}
                          onClick={() => handleCancel(order.id)}
                          disabled={cancellingId === order.id}
                        >
                          {cancellingId === order.id ? '...' : '✕ Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-sm btn-outline"
                data-testid="page-prev"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                ‹ Prev
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button
                className="btn btn-sm btn-outline"
                data-testid="page-next"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
