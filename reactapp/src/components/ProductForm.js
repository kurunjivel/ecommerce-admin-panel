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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const product = await createProduct({
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
      });
      onSave(product);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  return (
    <div>
      <h2>Product Form</h2>

      {['name','description','price','category','stockQuantity','imageUrl'].map(field => (
        <div key={field}>
          <label htmlFor={field}>
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            id={field}
            name={field}
            data-testid={`${field}-input`}
            value={form[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      {error && <div>[Error - You need to specify the message]</div>}

      <button data-testid="form-save" onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ProductForm;
