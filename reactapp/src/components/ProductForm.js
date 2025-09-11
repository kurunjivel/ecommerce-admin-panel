// src/components/ProductForm.js
import React, { useState } from 'react';
import { createProduct } from '../utils/api';

const ProductForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Re-validate if user has attempted to submit
    if (hasAttemptedSubmit) {
      const newForm = { ...form, [name]: value };
      const errors = validateForm(newForm);
      setValidationErrors(errors);
    }
  };

  const validateForm = (formData = form) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      if (!formData.price) errors.price = 'Price is required';
      else errors.price = 'Price must be positive';
    }
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      if (!formData.stockQuantity) errors.stockQuantity = 'Stock Quantity is required';
      else errors.stockQuantity = 'Stock Quantity must be positive';
    }
    return errors;
  };

  const handleSave = async () => {
    setHasAttemptedSubmit(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      const product = { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity) };
      const created = await createProduct(product);
      onSave(created);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const hasValidationErrors = hasAttemptedSubmit && Object.keys(validationErrors).length > 0;

  return (
    <div>
      <h1>Product Form</h1>
      {['name','description','price','category','stockQuantity','imageUrl'].map(field => {
        const labelText = field === 'stockQuantity' ? 'Stock Quantity' : 
                         field === 'imageUrl' ? 'Image URL' : 
                         field.charAt(0).toUpperCase() + field.slice(1);
        return (
          <div key={field}>
            <label htmlFor={field}>{labelText}:</label>
            <input
              id={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              data-testid={`${field}-input`}
            />
            {hasAttemptedSubmit && validationErrors[field] && <div>{validationErrors[field]}</div>}
          </div>
        );
      })}
      <button data-testid="form-save" onClick={handleSave} disabled={hasValidationErrors}>Save</button>
      <button onClick={onCancel}>Cancel</button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default ProductForm;
