import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../utils/api';

const PAGE_SIZE = 10;

const OrderList = ({ onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(err => setError(err.message || 'Error loading orders'));
  }, []);

  if (error) return <div>[Error - You need to specify the message]</div>;
  if (!orders.length) return <div>Loading...</div>;

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = orders.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {visible.map(o => (
          <li key={o.id}>
            {o.customerName} - ${o.totalAmount}
            <button
              data-testid={`view-button-${o.id}`}
              onClick={() => onViewOrder(o.id)}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
      <div>
        <button
          data-testid="page-prev"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          data-testid="page-next"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderList;
