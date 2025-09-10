// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import * as api from '../utils/api';

const ProductList = ({ onEditProduct, onDeleteProduct, onCreateProduct }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.fetchProducts({ page })
      .then(data => {
        setProducts(data.items);
        setTotalPages(data.totalPages);
      })
      .catch(err => setError(err.message || 'Error fetching products'));
  }, [page]);

  if (error) {
    return <div>[Error - You need to specify the message]</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <button data-testid="create-product" onClick={onCreateProduct}>
        Create New Product
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>{product.stockQuantity}</td>
              <td>
                <button data-testid={`edit-button-${product.id}`} onClick={() => onEditProduct(product.id)}>
                  Edit
                </button>
                <button data-testid={`delete-button-${product.id}`} onClick={() => onDeleteProduct(product.id)}>
                  Delete
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
        <span>Page {page} of {totalPages}</span>
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

export default ProductList;
