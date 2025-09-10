// src/utils/api.js

// Simulate API requests with dummy data and promises

export const fetchProducts = async ({ category, minPrice, maxPrice, page }) => {
  // Dummy data
  const items = [
    { id: 1, name: 'Phone', price: 299, category: 'Electronics', stockQuantity: 10 },
    { id: 2, name: 'Shirt', price: 25, category: 'Clothing', stockQuantity: 50 },
  ];
  return {
    items,
    totalPages: 1,
  };
};

export const createProduct = async (product) => {
  return { id: Math.floor(Math.random() * 1000), ...product };
};

export const fetchOrders = async ({ page }) => {
  const items = [
    { id: 1, customerName: 'John Doe', totalAmount: 100, status: 'PENDING', orderDate: new Date().toISOString(), orderItems: [] },
    { id: 2, customerName: 'Jane Doe', totalAmount: 150, status: 'SHIPPED', orderDate: new Date().toISOString(), orderItems: [] },
  ];
  return {
    items,
    totalPages: 1,
  };
};

export const getOrderById = async (orderId) => {
  return {
    id: orderId,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    shippingAddress: '123 Main St',
    orderDate: new Date().toISOString(),
    status: 'PENDING',
    totalAmount: 150,
    orderItems: [
      { id: 1, productId: 1, product: { name: 'Phone' }, quantity: 1, priceAtPurchase: 299 },
      { id: 2, productId: 2, product: { name: 'Shirt' }, quantity: 2, priceAtPurchase: 25 },
    ],
  };
};

export const updateOrderStatus = async (orderId, status) => {
  return {
    id: orderId,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    shippingAddress: '123 Main St',
    orderDate: new Date().toISOString(),
    status,
    totalAmount: 150,
    orderItems: [],
  };
};
