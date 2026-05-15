// src/components/ProductList.js
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchProducts, deleteProduct } from '../utils/api';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import ConfirmModal from './ConfirmModal';

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: '',           label: 'Default'       },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc',label: 'Price: High → Low' },
  { value: 'name_asc',  label: 'Name: A → Z'   },
  { value: 'name_desc', label: 'Name: Z → A'   },
];

const ProductList = ({ onEditProduct, onCreateProduct }) => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [page, setPage]                 = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [category, setCategory]           = useState('');
  const [minPrice, setMinPrice]           = useState('');
  const [maxPrice, setMaxPrice]           = useState('');
  const [sortOption, setSortOption]       = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sortBy, direction] = sortOption ? sortOption.split('_') : ['', ''];
      const params = {};
      if (searchKeyword) params.searchKeyword = searchKeyword;
      if (category)      params.category      = category;
      if (minPrice)      params.minPrice      = minPrice;
      if (maxPrice)      params.maxPrice      = maxPrice;
      if (sortBy)        params.sortBy        = sortBy;
      if (direction)     params.direction     = direction;

      const data = await fetchProducts(params);
      setProducts(data);
      setPage(1);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, category, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleClearFilters = () => {
    setSearchKeyword('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('');
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteTargetId);
      toast.success('Product deleted successfully');
      setDeleteTargetId(null);
      loadProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
      setDeleteTargetId(null);
    }
  };

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📦 Products</h1>
        <button className="btn btn-primary" onClick={onCreateProduct} data-testid="create-product-btn">
          + Create New Product
        </button>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────── */}
      <div className="filter-bar card">
        <input
          className="filter-input"
          type="text"
          placeholder="🔍 Search by name, description..."
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          data-testid="search-input"
        />
        <input
          className="filter-input"
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          data-testid="category-input"
        />
        <input
          className="filter-input"
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          data-testid="min-price-input"
        />
        <input
          className="filter-input"
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          data-testid="max-price-input"
        />
        <select
          className="filter-input"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          data-testid="sort-select"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button className="btn btn-secondary" onClick={handleClearFilters} data-testid="clear-filters-btn">
          ✕ Clear
        </button>
      </div>

      {/* ── Content States ──────────────────────────────────────────── */}
      {loading && <Loader />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState icon="📦" message="No products found. Try adjusting your filters or create a new product." />
      )}

      {/* ── Products Table ──────────────────────────────────────────── */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="card table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((p, idx) => (
                  <tr key={p.id} className={p.stockQuantity === 0 ? 'row-out-of-stock' : p.stockQuantity < 5 ? 'row-low-stock' : ''}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge">{p.category}</span></td>
                    <td className="price-cell">${p.price.toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${p.stockQuantity === 0 ? 'stock-zero' : p.stockQuantity < 5 ? 'stock-low' : 'stock-ok'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        className="btn btn-sm btn-outline"
                        data-testid={`edit-button-${p.id}`}
                        onClick={() => onEditProduct(p.id)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        data-testid={`delete-button-${p.id}`}
                        onClick={() => setDeleteTargetId(p.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ────────────────────────────────────────── */}
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

      {/* ── Confirm Delete Modal ────────────────────────────────────── */}
      {deleteTargetId && (
        <ConfirmModal
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
