import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import * as api from '../utils/api';
import ProductList from './ProductList';

jest.mock('../utils/api');

describe('ProductList', () => {
  const productsMock = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 1999.99, stockQuantity: 10 },
    { id: 2, name: 'Phone', category: 'Electronics', price: 699.99, stockQuantity: 7 },
    { id: 3, name: 'Blender', category: 'Home', price: 49.50, stockQuantity: 23 }
  ];

  beforeEach(() => {
    api.fetchProducts.mockResolvedValue(productsMock);
  });

  test('renders product table and filter controls', async () => {
    render(<ProductList onEditProduct={() => {}} onDeleteProduct={() => {}} onCreateProduct={() => {}} />);
    await screen.findByText('Products');
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Create New Product')).toBeInTheDocument();
    productsMock.forEach(p => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getAllByText(p.category)[0]).toBeInTheDocument();
    });
  });

  test('pagination controls work', async () => {
    const many = Array.from({ length: 13 }, (_, i) => ({ id: i + 1, name: 'Product' + (i + 1), category: 'Test', price: 10, stockQuantity: 5 }));
    api.fetchProducts.mockResolvedValue(many);
    render(<ProductList onEditProduct={() => {}} onDeleteProduct={() => {}} onCreateProduct={() => {}} />);
    await screen.findByText('Product1');
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('page-next'));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('page-prev'));
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('Edit and Delete buttons fire handler', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<ProductList onEditProduct={onEdit} onDeleteProduct={onDelete} onCreateProduct={() => {}} />);
    await screen.findByText('Laptop');
    fireEvent.click(screen.getByTestId('edit-button-1'));
    expect(onEdit).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByTestId('delete-button-1'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('displays error if API fails', async () => {
    api.fetchProducts.mockRejectedValue({ message: 'Product API Error' });
    render(<ProductList onEditProduct={() => {}} onDeleteProduct={() => {}} onCreateProduct={() => {}} />);
    await screen.findByText('Product API Error');
    expect(screen.getByText('Product API Error')).toBeInTheDocument();
  });
});