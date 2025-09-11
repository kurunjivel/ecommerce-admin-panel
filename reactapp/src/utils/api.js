// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'https://8080-cddefbcdddbcbbfdfebebacdbf.premiumproject.examly.io/api';

// ---------- Product APIs ----------

/**
 * Create a new product
 * @param {Object} product
 * @returns {Promise<Object>}
 */
export const createProduct = async (product) => {
  const response = await axios.post(`${API_BASE_URL}/products`, product);
  return response.data;
};

/**
 * Fetch products with optional filters
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export const fetchProducts = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/products`, {
    params: params
  });
  return response.data;
};

// ---------- Order APIs ----------

/**
 * Create a new order
 * @param {Object} order
 * @returns {Promise<Object>}
 */
export const createOrder = async (order) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, order);
  return response.data;
};

/**
 * Fetch orders with pagination or filters
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export const fetchOrders = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/orders`, {
    params: params
  });
  return response.data;
};

/**
 * Get order details by ID
 * @param {number|string} orderId
 * @returns {Promise<Object>}
 */
export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
  return response.data;
};

/**
 * Update the status of an order
 * @param {number|string} orderId
 * @param {string} status
 * @returns {Promise<Object>}
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
  return response.data;
};
