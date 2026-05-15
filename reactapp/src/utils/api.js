// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// ── Product APIs ──────────────────────────────────────────────────────────────

export const createProduct = async (product) => {
  const response = await axios.post(`${API_BASE_URL}/products`, product);
  return response.data;
};

export const fetchProducts = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/products`, { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await axios.put(`${API_BASE_URL}/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  await axios.delete(`${API_BASE_URL}/products/${id}`);
};

// ── Order APIs ────────────────────────────────────────────────────────────────

export const createOrder = async (order) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, order);
  return response.data;
};

export const fetchOrders = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/orders`, { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/cancel`);
  return response.data;
};
