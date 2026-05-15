// src/components/OrderDetails.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getOrderById, updateOrderStatus } from '../utils/api';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const VALID_STATUSES = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS = {
  PENDING:   'status-pending',
  SHIPPED:   'status-shipped',
  DELIVERED: 'status-delivered',
  CANCELLED: 'status-cancelled',
};

const OrderDetails = ({ orderId, onBack }) => {
  const [order, setOrder]     = useState(null);
  const [status, setStatus]   = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrder(updated);
      toast.success('Order status updated!');
      setError('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update status';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading order details..." />;
  if (error && !order) return (
    <div className="page-content">
      <ErrorMessage message={error} />
      <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: '1rem' }}>← Back to Orders</button>
    </div>
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📋 Order Details</h1>
        <button className="btn btn-secondary" onClick={onBack}>← Back to Orders</button>
      </div>

      {/* ── Customer Info Card ──────────────────────────────────────── */}
      <div className="card detail-card">
        <h2 className="section-title">Customer Information</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Name</span>
            <span className="detail-value" data-testid="customer-name">{order.customerName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value" data-testid="customer-email">{order.customerEmail}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Shipping Address</span>
            <span className="detail-value" data-testid="shipping-address">{order.shippingAddress}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Order Date</span>
            <span className="detail-value" data-testid="order-date">
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>

        {/* ── Status Update ──────────────────────────────────────────── */}
        <div className="status-update-section">
          <label className="form-label" htmlFor="status">Order Status:</label>
          <div className="status-row">
            <span className={`status-badge ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
            <select
              id="status"
              aria-label="Order Status:"
              data-testid="status-dropdown"
              className="form-input status-select"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {VALID_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              data-testid="save-button"
              onClick={handleSave}
              disabled={saving || status === order.status}
            >
              {saving ? 'Saving...' : 'Save Status'}
            </button>
          </div>
          {error && <div className="alert alert-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
        </div>
      </div>

      {/* ── Order Items Table ────────────────────────────────────────── */}
      <div className="card table-card">
        <h2 className="section-title">Order Items</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td><strong>{item.productName || item.product?.name}</strong></td>
                <td>{item.quantity}</td>
                <td className="price-cell">${item.priceAtPurchase.toFixed(2)}</td>
                <td className="price-cell">${(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="order-total">
          <span>Total Amount:</span>
          <strong>${order.totalAmount.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;