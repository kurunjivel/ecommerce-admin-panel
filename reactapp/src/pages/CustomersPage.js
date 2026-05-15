// src/pages/CustomersPage.js
import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../utils/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const orders = await fetchOrders();
        // Derive unique customers from orders
        const map = {};
        orders.forEach(o => {
          const key = o.customerEmail;
          if (!map[key]) {
            map[key] = {
              email:       o.customerEmail,
              name:        o.customerName,
              orderCount:  0,
              totalSpent:  0,
              lastOrder:   o.orderDate,
              statuses:    [],
            };
          }
          map[key].orderCount++;
          if (o.status !== 'CANCELLED') map[key].totalSpent += o.totalAmount;
          if (o.orderDate && o.orderDate > map[key].lastOrder) map[key].lastOrder = o.orderDate;
          map[key].statuses.push(o.status);
        });
        const sorted = Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(sorted);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">👥 Customers</h1>
        <span className="page-subtitle">{customers.length} unique customers</span>
      </div>

      <div className="filter-bar card">
        <input
          className="filter-input"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && <Loader />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon="👥" message="No customers found." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="card table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.email}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="customer-cell">
                      <span className="avatar avatar-sm">{c.name?.[0]?.toUpperCase()}</span>
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td>{c.email}</td>
                  <td><span className="badge">{c.orderCount} orders</span></td>
                  <td className="price-cell">${c.totalSpent.toFixed(2)}</td>
                  <td>{c.lastOrder}</td>
                  <td>
                    <span className={`status-badge ${c.totalSpent > 200 ? 'status-delivered' : 'status-pending'}`}>
                      {c.totalSpent > 200 ? 'VIP' : 'Regular'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
