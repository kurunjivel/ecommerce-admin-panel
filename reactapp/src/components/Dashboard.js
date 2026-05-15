// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchOrders } from '../utils/api';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-body">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

const Dashboard = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [prods, ords] = await Promise.all([fetchProducts(), fetchOrders()]);
        setProducts(prods);
        setOrders(ords);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;
  if (error)   return <ErrorMessage message={error} />;

  // ── Computed Analytics ─────────────────────────────────────────
  const totalProducts  = products.length;
  const totalOrders    = orders.length;
  const lowStock       = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
  const outOfStock     = products.filter(p => p.stockQuantity === 0);
  const revenue        = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders  = orders.filter(o => o.status === 'PENDING').length;
  const shippedOrders  = orders.filter(o => o.status === 'SHIPPED').length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  // Status distribution for simple bar chart
  const statusData = [
    { label: 'Pending',   count: pendingOrders,   color: '#f59e0b' },
    { label: 'Shipped',   count: shippedOrders,   color: '#3b82f6' },
    { label: 'Delivered', count: deliveredOrders, color: '#10b981' },
    { label: 'Cancelled', count: cancelledOrders, color: '#ef4444' },
  ];
  const maxCount = Math.max(...statusData.map(s => s.count), 1);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <span className="page-subtitle">Welcome back, Admin</span>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="stats-grid">
        <StatCard icon="📦" label="Total Products"  value={totalProducts}       color="blue"   />
        <StatCard icon="🛒" label="Total Orders"    value={totalOrders}         color="purple" />
        <StatCard icon="💰" label="Total Revenue"   value={`$${revenue.toFixed(2)}`} color="green" sub="Excluding cancelled" />
        <StatCard icon="⏳" label="Pending Orders"  value={pendingOrders}       color="yellow" />
        <StatCard icon="🚚" label="Shipped"         value={shippedOrders}       color="blue"   />
        <StatCard icon="✅" label="Delivered"       value={deliveredOrders}     color="green"  />
        <StatCard icon="❌" label="Cancelled"       value={cancelledOrders}     color="red"    />
        <StatCard icon="⚠️" label="Low Stock Items" value={lowStock.length}     color="orange" sub={`${outOfStock.length} out of stock`} />
      </div>

      <div className="dashboard-bottom">
        {/* ── Order Status Chart ────────────────────────────────────── */}
        <div className="card chart-card">
          <h2 className="section-title">Order Status Distribution</h2>
          <div className="bar-chart">
            {statusData.map(s => (
              <div className="bar-group" key={s.label}>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${(s.count / maxCount) * 100}%`, background: s.color }}
                    title={`${s.label}: ${s.count}`}
                  ></div>
                </div>
                <div className="bar-count">{s.count}</div>
                <div className="bar-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Orders ─────────────────────────────────────────── */}
        <div className="card recent-card">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <button className="btn btn-sm btn-outline" onClick={() => onNavigate('orderList')}>
              View All →
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="state-text">No orders yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Customer</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>{o.customerName}</td>
                    <td className="price-cell">${o.totalAmount.toFixed(2)}</td>
                    <td><span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Low Stock Alerts ──────────────────────────────────────────── */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="card alert-card">
          <h2 className="section-title">🚨 Stock Alerts</h2>
          <div className="alert-list">
            {outOfStock.map(p => (
              <div className="alert-item alert-item--danger" key={p.id}>
                <span>❌ <strong>{p.name}</strong></span>
                <span className="stock-badge stock-zero">OUT OF STOCK</span>
              </div>
            ))}
            {lowStock.map(p => (
              <div className="alert-item alert-item--warning" key={p.id}>
                <span>⚠️ <strong>{p.name}</strong></span>
                <span className="stock-badge stock-low">Only {p.stockQuantity} left</span>
              </div>
            ))}
          </div>
          <button className="btn btn-sm btn-outline" onClick={() => onNavigate('productList')} style={{ marginTop: '1rem' }}>
            Manage Products →
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
