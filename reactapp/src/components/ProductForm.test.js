import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import * as api from '../utils/api';
import ProductForm from './ProductForm';

jest.mock('../utils/api');

describe('ProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const valid = {
    name: 'Car',
    description: 'A fancy car',
    price: 42.5,
    category: 'Vehicles',
    stockQuantity: 6,
    imageUrl: 'http://test.img',
  };

  test('renders all fields, save/cancel buttons', async () => {
    render(<ProductForm onSave={() => {}} onCancel={() => {}} />);
    ['Name', 'Description', 'Price', 'Category', 'Stock Quantity', 'Image URL'].forEach(label => {
      expect(screen.getByLabelText(new RegExp(label, 'i'))).toBeInTheDocument();
    });
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('shows validation and disables save on error', async () => {
    render(<ProductForm onSave={()=>{}} onCancel={()=>{}} />);
    fireEvent.click(screen.getByTestId('form-save'));
    await waitFor(() => {
      expect(screen.getAllByText(/required/i)).toHaveLength(5);
    });
    // Fill invalid price
    fireEvent.change(screen.getByTestId('price-input'), { target: { value: '-5' } });
    fireEvent.click(screen.getByTestId('form-save'));
    await waitFor(() => {
      expect(screen.getByText(/must be positive/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId('form-save')).toBeDisabled();
  });

  test('calls API with valid data and calls onSave', async () => {
    api.createProduct.mockResolvedValue({ id: 100, ...valid });
    const onSave = jest.fn();
    render(<ProductForm onSave={onSave} onCancel={() => {}} />);
    Object.entries(valid).forEach(([k, v]) => {
      fireEvent.change(screen.getByTestId(`${k}-input`), { target: { value: v } });
    });
    fireEvent.click(screen.getByTestId('form-save'));
    await waitFor(() => {
      expect(api.createProduct).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ id: 100, name: 'Car' }));
    });
  });

  test('shows server error on save failure', async () => {
    api.createProduct.mockRejectedValue({ message: 'Invalid product data' });
    render(<ProductForm onSave={() => {}} onCancel={() => {}} />);
    Object.entries(valid).forEach(([k, v]) => {
      fireEvent.change(screen.getByTestId(`${k}-input`), { target: { value: v } });
    });
    fireEvent.click(screen.getByTestId('form-save'));
    await waitFor(() => {
      expect(screen.getByText('Invalid product data')).toBeInTheDocument();
    });
  });
});