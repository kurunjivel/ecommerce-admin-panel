// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE_URL });

// ── Attach JWT token to every request ────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Handle 401 → redirect to login ───────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// ── Auth APIs ─────────────────────────────────────────────────────────────────

export const loginApi = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data.data; // unwrap ApiResponse
};

export const registerApi = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data.data;
};

// ── Dashboard API ─────────────────────────────────────────────────────────────

export const fetchDashboard = async () => {
  const res = await api.get('/dashboard');
  return res.data.data;
};

// ── Product APIs ──────────────────────────────────────────────────────────────

export const createProduct = async (product) => {
  const res = await api.post('/products', product);
  return res.data;
};

export const fetchProducts = async (params = {}) => {
  const res = await api.get('/products', { params });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id, product) => {
  const res = await api.put(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

// ── Order APIs ────────────────────────────────────────────────────────────────

export const createOrder = async (order) => {
  const res = await api.post('/orders', order);
  return res.data;
};

export const fetchOrders = async (params = {}) => {
  const res = await api.get('/orders', { params });
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.patch(`/orders/${orderId}/status`, { status });
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await api.patch(`/orders/${orderId}/cancel`);
  return res.data;
};
