// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { fetchDashboard } from '../utils/api';
import { SkeletonStats } from './SkeletonLoader';
import ErrorMessage from './ErrorMessage';

const KPI_CARDS = (d) => [
  { icon: '📦', label: 'Total Products',  value: d.totalProducts,              color: 'blue'   },
  { icon: '🛒', label: 'Total Orders',    value: d.totalOrders,                color: 'purple' },
  { icon: '💰', label: 'Revenue',         value: `$${d.totalRevenue.toFixed(2)}`, color: 'green' },
  { icon: '⏳', label: 'Pending',         value: d.pendingOrders,              color: 'yellow' },
  { icon: '🚚', label: 'Shipped',         value: d.shippedOrders,              color: 'blue'   },
  { icon: '✅', label: 'Delivered',       value: d.deliveredOrders,            color: 'green'  },
  { icon: '❌', label: 'Cancelled',       value: d.cancelledOrders,            color: 'red'    },
  { icon: '⚠️', label: 'Low Stock',      value: d.lowStockCount,              color: 'orange', sub: `${d.outOfStockCount} out of stock` },
];

const STATUS_COLORS = {
  PENDING:   '#f59e0b', SHIPPED:   '#3b82f6',
  DELIVERED: '#10b981', CANCELLED: '#ef4444',
};

const Dashboard = ({ onNavigate }) => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const d = await fetchDashboard();
        setData(d);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page-content"><SkeletonStats /></div>;
  if (error)   return <div className="page-content"><ErrorMessage message={error} /></div>;

  const maxRevenue = Math.max(...Object.values(data.revenueByMonth || { x: 1 }), 1);
  const statusData = [
    { label: 'Pending',   count: data.pendingOrders   },
    { label: 'Shipped',   count: data.shippedOrders   },
    { label: 'Delivered', count: data.deliveredOrders  },
    { label: 'Cancelled', count: data.cancelledOrders  },
  ];
  const maxStatus = Math.max(...statusData.map(s => s.count), 1);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <span className="page-subtitle">Live analytics overview</span>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="stats-grid">
        {KPI_CARDS(data).map(card => (
          <div key={card.label} className={`stat-card stat-card--${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-body">
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
              {card.sub && <div className="stat-sub">{card.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        {/* ── Revenue Chart ─────────────────────────────────────────────── */}
        <div className="card chart-card">
          <h2 className="section-title">💰 Revenue by Month</h2>
          {Object.keys(data.revenueByMonth || {}).length === 0 ? (
            <p className="state-text">No revenue data yet.</p>
          ) : (
            <div className="bar-chart">
              {Object.entries(data.revenueByMonth).map(([month, rev]) => (
                <div className="bar-group" key={month}>
                  <div className="bar-track">
                    <div className="bar-fill bar-fill--green"
                      style={{ height: `${(rev / maxRevenue) * 100}%` }}
                      title={`${month}: $${rev.toFixed(0)}`}
                    />
                  </div>
                  <div className="bar-count">${rev >= 1000 ? (rev/1000).toFixed(1)+'k' : rev.toFixed(0)}</div>
                  <div className="bar-label">{month}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Order Status Chart ─────────────────────────────────────────── */}
        <div className="card chart-card">
          <h2 className="section-title">🛒 Order Status</h2>
          <div className="bar-chart">
            {statusData.map(s => (
              <div className="bar-group" key={s.label}>
                <div className="bar-track">
                  <div className="bar-fill"
                    style={{
                      height: `${(s.count / maxStatus) * 100}%`,
                      background: STATUS_COLORS[s.label.toUpperCase()] || '#6366f1'
                    }}
                    title={`${s.label}: ${s.count}`}
                  />
                </div>
                <div className="bar-count">{s.count}</div>
                <div className="bar-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        {/* ── Top Products ───────────────────────────────────────────────── */}
        <div className="card">
          <h2 className="section-title">🏆 Top Products</h2>
          {(!data.topProducts || data.topProducts.length === 0) ? (
            <p className="state-text">No sales data yet.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>#</th><th>Product</th><th>Sold</th><th>Revenue</th></tr></thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={p.productId}>
                    <td><span className="rank-badge">#{i+1}</span></td>
                    <td><strong>{p.productName}</strong><br/><small>{p.category}</small></td>
                    <td><span className="badge">{p.totalSold} units</span></td>
                    <td className="price-cell">${p.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Recent Orders ──────────────────────────────────────────────── */}
        <div className="card recent-card">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <button className="btn btn-sm btn-outline" onClick={() => onNavigate('orderList')}>
              View All →
            </button>
          </div>
          {(!data.recentOrders || data.recentOrders.length === 0) ? (
            <p className="state-text">No orders yet.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {data.recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>{o.customerName}</td>
                    <td className="price-cell">${o.totalAmount.toFixed(2)}</td>
                    <td><span className={`status-badge status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Category Breakdown ─────────────────────────────────────────────── */}
      {data.productsByCategory && Object.keys(data.productsByCategory).length > 0 && (
        <div className="card">
          <h2 className="section-title">📂 Products by Category</h2>
          <div className="category-pills">
            {Object.entries(data.productsByCategory).map(([cat, count]) => (
              <div className="category-pill" key={cat}>
                <span className="cat-name">{cat}</span>
                <span className="cat-count">{count} products</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stock Alerts ───────────────────────────────────────────────────── */}
      {(data.lowStockCount > 0 || data.outOfStockCount > 0) && (
        <div className="card alert-card">
          <h2 className="section-title">🚨 Stock Alerts</h2>
          <p className="state-text">
            {data.outOfStockCount > 0 && `${data.outOfStockCount} product(s) out of stock. `}
            {data.lowStockCount > 0    && `${data.lowStockCount} product(s) running low (< 5 units).`}
          </p>
          <button className="btn btn-sm btn-outline" onClick={() => onNavigate('productList')} style={{ marginTop: '1rem' }}>
            Manage Inventory →
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
