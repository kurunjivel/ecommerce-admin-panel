import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import * as api from '../utils/api';
import OrderDetails from './OrderDetails';

jest.mock('../utils/api');

describe('OrderDetails', () => {
  const orderObj = {
    id: 4,
    customerName: 'Steve',
    customerEmail: 's@t.com',
    shippingAddress: 'Z Plaza',
    orderDate: '2024-06-10T09:00:00',
    status: 'SHIPPED',
    totalAmount: 123.5,
    orderItems: [
      { id: 1, productId: 5, product: { name: 'X Phone' }, quantity: 2, priceAtPurchase: 50 },
      { id: 2, productId: 7, product: { name: 'Blender' }, quantity: 1, priceAtPurchase: 23.5 }
    ]
  };

  beforeEach(() => {
    api.getOrderById.mockResolvedValue(orderObj);
    api.updateOrderStatus.mockResolvedValue({ ...orderObj, status: 'DELIVERED' });
  });

  test('renders details, items table, and Edit controls', async () => {
    render(<OrderDetails orderId={4} onBack={()=>{}} />);
    await screen.findByText('Order Details');
    expect(screen.getByText('Steve')).toBeInTheDocument();
    expect(screen.getByText('s@t.com')).toBeInTheDocument();
    expect(screen.getByText('Blender')).toBeInTheDocument();
    expect(screen.getByText('X Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Order Status:')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('$123.50')).toBeInTheDocument();
  });

  test('status dropdown triggers update', async () => {
    render(<OrderDetails orderId={4} onBack={()=>{}} />);
    await screen.findByText('Order Details');
    fireEvent.change(screen.getByLabelText('Order Status:'), {
      target: { value: 'DELIVERED' }
    });
    fireEvent.click(screen.getByText('Save'));
    await screen.findByText('Status updated');
    expect(api.updateOrderStatus).toHaveBeenCalledWith(4, 'DELIVERED');
  });

  test('calls onBack', async () => {
    const onBack = jest.fn();
    render(<OrderDetails orderId={4} onBack={onBack} />);
    await screen.findByText('Order Details');
    fireEvent.click(screen.getByText('Back to Orders'));
    expect(onBack).toHaveBeenCalled();
  });

  test('shows error if not found', async () => {
    api.getOrderById.mockRejectedValue({ message: 'Order not found' });
    render(<OrderDetails orderId={999} onBack={()=>{}} />);
    await screen.findByText('Order not found');
    expect(screen.getByText('Order not found')).toBeInTheDocument();
  });
});