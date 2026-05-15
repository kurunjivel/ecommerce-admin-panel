// src/components/CreateOrder.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createOrder, fetchProducts } from '../utils/api';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const EMPTY_ITEM = { productId: '', quantity: 1 };

const CreateOrder = ({ onOrderCreated }) => {
  const [form, setForm] = useState({
    customerName:    '',
    customerEmail:   '',
    shippingAddress: '',
  });
  const [items, setItems]             = useState([{ ...EMPTY_ITEM }]);
  const [products, setProducts]       = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError]       = useState('');
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState('');
  const [submitted, setSubmitted]     = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        setProductError('Failed to load products. Please refresh.');
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (idx, field, value) => {
    setItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM }]);

  const removeItem = (idx) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const getSelectedProduct = (productId) =>
    products.find(p => String(p.id) === String(productId));

  const calculateTotal = () =>
    items.reduce((sum, item) => {
      const prod = getSelectedProduct(item.productId);
      return prod ? sum + prod.price * (parseInt(item.quantity) || 0) : sum;
    }, 0);

  const validate = () => {
    if (!form.customerName.trim())    return 'Customer name is required';
    if (!form.customerEmail.trim())   return 'Customer email is required';
    if (!/\S+@\S+\.\S+/.test(form.customerEmail)) return 'Valid email is required';
    if (!form.shippingAddress.trim()) return 'Shipping address is required';
    for (let i = 0; i < items.length; i++) {
      if (!items[i].productId)         return `Item ${i + 1}: please select a product`;
      if (!items[i].quantity || parseInt(items[i].quantity) < 1)
                                       return `Item ${i + 1}: quantity must be at least 1`;
      const prod = getSelectedProduct(items[i].productId);
      if (prod && parseInt(items[i].quantity) > prod.stockQuantity)
        return `Item ${i + 1}: only ${prod.stockQuantity} in stock`;
    }
    return null;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        customerName:    form.customerName,
        customerEmail:   form.customerEmail,
        shippingAddress: form.shippingAddress,
        orderItems: items.map(item => ({
          productId: parseInt(item.productId),
          quantity:  parseInt(item.quantity),
        })),
      };
      const created = await createOrder(payload);
      toast.success(`Order #${created.id} created successfully!`);
      onOrderCreated(created);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create order';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loadingProducts) return <Loader message="Loading products..." />;
  if (productError)    return <ErrorMessage message={productError} />;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">➕ Create New Order</h1>
      </div>

      <div className="card form-card">
        <h2 className="section-title">Customer Details</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="customerName">Customer Name</label>
            <input
              id="customerName"
              name="customerName"
              className="form-input"
              placeholder="Full name"
              value={form.customerName}
              onChange={handleFormChange}
              data-testid="customerName-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="customerEmail">Email</label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              className="form-input"
              placeholder="email@example.com"
              value={form.customerEmail}
              onChange={handleFormChange}
              data-testid="customerEmail-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="shippingAddress">Shipping Address</label>
          <input
            id="shippingAddress"
            name="shippingAddress"
            className="form-input"
            placeholder="Full shipping address"
            value={form.shippingAddress}
            onChange={handleFormChange}
            data-testid="shippingAddress-input"
          />
        </div>

        {/* ── Order Items ────────────────────────────────────────────── */}
        <h2 className="section-title" style={{ marginTop: '1.5rem' }}>Order Items</h2>

        {items.map((item, idx) => {
          const selectedProd = getSelectedProduct(item.productId);
          return (
            <div className="order-item-row" key={idx}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Product</label>
                <select
                  className="form-input"
                  value={item.productId}
                  onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                  data-testid={`product-select-${idx}`}
                >
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stockQuantity === 0}>
                      {p.name} — ${p.price.toFixed(2)} (Stock: {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max={selectedProd?.stockQuantity || 9999}
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                  data-testid={`quantity-input-${idx}`}
                />
              </div>

              <div className="form-group item-subtotal">
                <label className="form-label">Subtotal</label>
                <span className="price-cell">
                  {selectedProd
                    ? `$${(selectedProd.price * (parseInt(item.quantity) || 0)).toFixed(2)}`
                    : '—'}
                </span>
              </div>

              <button
                className="btn btn-sm btn-danger remove-item-btn"
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          );
        })}

        <button className="btn btn-outline" onClick={addItem} data-testid="add-item-btn">
          + Add Item
        </button>

        {/* ── Total Preview ─────────────────────────────────────────── */}
        <div className="order-total-preview">
          <span>Estimated Total:</span>
          <strong className="price-cell">${calculateTotal().toFixed(2)}</strong>
        </div>

        {submitted && formError && (
          <div className="alert alert-error">{formError}</div>
        )}

        <div className="form-actions">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving}
            data-testid="submit-order-btn"
          >
            {saving ? 'Placing Order...' : '🛒 Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
