// src/components/ProductForm.js
import React, { useState } from 'react';
import * as api from '../utils/api';

const ProductForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');

  const isValid = () => {
    return formData.name && formData.description && formData.price && formData.category && formData.stockQuantity;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!isValid()) {
      setError('Please fill all required fields');
      return;
    }
    api.createProduct({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stockQuantity: parseInt(formData.stockQuantity),
      imageUrl: formData.imageUrl
    }).then(product => {
      onSave(product);
    }).catch(err => {
      setError(err.message || 'Error saving product');
    });
  };

  return (
    <div>
      <h1>Product Form</h1>
      <div>
        <label>Name</label>
        <input
          data-testid="name-input"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          data-testid="description-input"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Price</label>
        <input
          data-testid="price-input"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Category</label>
        <input
          data-testid="category-input"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
</div>
<div>
<label>Stock Quantity</label>
<input
data-testid="stockQuantity-input"
name="stockQuantity"
type="number"
value={formData.stockQuantity}
onChange={handleChange}
/>
</div>
<div>
<label>Image URL</label>
<input
data-testid="imageUrl-input"
name="imageUrl"
value={formData.imageUrl}
onChange={handleChange}
/>
</div>
{error && <div>[Error - You need to specify the message]</div>}
<button data-testid="form-save" onClick={handleSave}>Save</button>
<button data-testid="form-cancel" onClick={onCancel}>Cancel</button>
</div>
);
};

export default ProductForm;