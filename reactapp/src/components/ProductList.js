// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../utils/api';

const PAGE_SIZE = 10;

const ProductList = ({ onEditProduct, onDeleteProduct, onCreateProduct }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      }
    };
    loadProducts();
  }, []);

  if (error) return <div>{error}</div>;
  if (!products.length) return <div>Loading...</div>;

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1>Products</h1>
      <button onClick={onCreateProduct}>Create New Product</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>{p.stockQuantity}</td>
              <td>
                <button data-testid={`edit-button-${p.id}`} onClick={() => onEditProduct(p.id)}>Edit</button>
                <button data-testid={`delete-button-${p.id}`} onClick={() => onDeleteProduct(p.id)}>Delete</button>
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

export default ProductList;
