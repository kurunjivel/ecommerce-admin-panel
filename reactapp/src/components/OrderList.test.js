import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import * as api from '../utils/api';
import OrderList from './OrderList';

jest.mock('../utils/api');

describe('OrderList', () => {
  const ordersMock = [
    { id: 101, customerName: 'Alex', totalAmount: 120.5, status: 'PENDING', orderDate: '2024-06-12T12:30:00', orderItems: [] },
    { id: 102, customerName: 'Liz', totalAmount: 40, status: 'SHIPPED', orderDate: '2024-06-13T08:15:00', orderItems: [] }
  ];

  beforeEach(() => {
    api.fetchOrders.mockResolvedValue(ordersMock);
  });

  test('renders orders and View Details button', async () => {
    render(<OrderList onViewOrder={() => {}} />);
    await screen.findByText('Alex');
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByText('Liz')).toBeInTheDocument();
    expect(screen.getByTestId('view-button-101')).toBeInTheDocument();
  });

  test('pagination shows Page X of Y and buttons work', async () => {
    const many = Array.from({ length: 13 }, (_, i) => ({ id: i + 1, customerName: 'Cust' + (i + 1), totalAmount: 42, status: 'PENDING', orderDate: '2024-06-09T00:00:00', orderItems: [] }));
    api.fetchOrders.mockResolvedValue(many);
    render(<OrderList onViewOrder={() => {}} />);
    await screen.findByText('Cust1');
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('page-next'));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Cust11')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('page-prev'));
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('error case if API fails', async () => {
    api.fetchOrders.mockRejectedValue({ message: 'Order API Error' });
    render(<OrderList onViewOrder={() => {}} />);
    await screen.findByText('Order API Error');
    expect(screen.getByText('Order API Error')).toBeInTheDocument();
  });
});