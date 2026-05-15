// src/components/ProductForm.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createProduct, updateProduct, getProductById } from '../utils/api';
import Loader from './Loader';

const FIELDS = [
  { key: 'name',          label: 'Name',          type: 'text'   },
  { key: 'description',   label: 'Description',   type: 'text'   },
  { key: 'price',         label: 'Price',         type: 'number' },
  { key: 'category',      label: 'Category',      type: 'text'   },
  { key: 'stockQuantity', label: 'Stock Quantity', type: 'number' },
  { key: 'imageUrl',      label: 'Image URL',     type: 'text'   },
];

const INITIAL_FORM = { name: '', description: '', price: '', category: '', stockQuantity: '', imageUrl: '' };

const ProductForm = ({ productId, onSave, onCancel }) => {
  const isEditMode = Boolean(productId);

  const [form, setForm]                       = useState(INITIAL_FORM);
  const [loadingData, setLoadingData]         = useState(false);
  const [error, setError]                     = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [saving, setSaving]                   = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (!isEditMode) return;
    const load = async () => {
      setLoadingData(true);
      try {
        const data = await getProductById(productId);
        setForm({
          name:          data.name          || '',
          description:   data.description   || '',
          price:         data.price         || '',
          category:      data.category      || '',
          stockQuantity: data.stockQuantity ?? '',
          imageUrl:      data.imageUrl      || '',
        });
      } catch (err) {
        setError('Failed to load product for editing.');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [productId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (hasAttemptedSubmit) {
      setValidationErrors(validateForm({ ...form, [name]: value }));
    }
  };

  const validateForm = (formData = form) => {
    const errors = {};
    if (!formData.name.trim())                          errors.name = 'Name is required';
    if (!formData.description.trim())                   errors.description = 'Description is required';
    if (!formData.price)                                errors.price = 'Price is required';
    else if (parseFloat(formData.price) <= 0)           errors.price = 'Price must be positive';
    if (!formData.category.trim())                      errors.category = 'Category is required';
    if (formData.stockQuantity === '')                  errors.stockQuantity = 'Stock Quantity is required';
    else if (parseInt(formData.stockQuantity) < 0)     errors.stockQuantity = 'Stock Quantity must be >= 0';
    return errors;
  };

  const handleSave = async () => {
    setHasAttemptedSubmit(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        price:         parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity),
      };

      let result;
      if (isEditMode) {
        result = await updateProduct(productId, payload);
        toast.success('Product updated successfully!');
      } else {
        result = await createProduct(payload);
        toast.success('Product created successfully!');
      }
      onSave(result);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to save product';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const hasValidationErrors = hasAttemptedSubmit && Object.keys(validationErrors).length > 0;

  if (loadingData) return <Loader message="Loading product data..." />;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? '✏️ Edit Product' : '➕ Create Product'}</h1>
      </div>

      <div className="card form-card">
        {FIELDS.map(({ key, label, type }) => (
          <div className="form-group" key={key}>
            <label className="form-label" htmlFor={key}>{label}</label>
            <input
              id={key}
              name={key}
              type={type}
              className={`form-input ${hasAttemptedSubmit && validationErrors[key] ? 'input-error' : ''}`}
              value={form[key]}
              onChange={handleChange}
              data-testid={`${key}-input`}
              placeholder={label}
            />
            {hasAttemptedSubmit && validationErrors[key] && (
              <span className="field-error">{validationErrors[key]}</span>
            )}
          </div>
        ))}

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-actions">
          <button
            className="btn btn-primary"
            data-testid="form-save"
            onClick={handleSave}
            disabled={hasValidationErrors || saving}
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>
          <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
