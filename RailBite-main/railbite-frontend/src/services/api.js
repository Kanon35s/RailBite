// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Base axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Attach auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('railbiteToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
};

// ---------- MENU ----------
export const menuAPI = {
  getAll: (params = {}) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  getCategories: () => api.get('/menu/categories/list'),
  getByCategory: (category, params = {}) =>
    api.get(`/menu/category/${category}`, { params }),

  // Admin (needs user.role === 'admin')
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  remove: (id) => api.delete(`/menu/${id}`),
};

// ---------- ORDERS ----------
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  listMy: (params = {}) => api.get('/orders', { params }),
  getByOrderId: (orderId) => api.get(`/orders/${orderId}`),
  cancel: (orderId) => api.put(`/orders/${orderId}/cancel`),
  statsMe: () => api.get('/orders/stats/me'),

  // Admin
  adminUpdateStatus: (orderId, status) =>
    api.put(`/orders/admin/${orderId}/status`, { status }),
  adminStats: () => api.get('/orders/admin/stats'),
  adminRecent: (limit = 5) =>
    api.get('/orders/admin/recent', { params: { limit } }),
  adminList: (params = {}) => api.get('/orders/admin', { params }),
};

// ---------- NOTIFICATIONS ----------
export const notificationsAPI = {
  // User endpoints
  listMy: (filter) =>
    api.get('/notifications', {
      params: filter ? { filter } : {},
    }),
  unreadCount: () => api.get('/notifications/unread/count'),
  markAllRead: () => api.put('/notifications/read-all'),
  markOneRead: (id) => api.put(`/notifications/${id}/read`),
  deleteOne: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications/clear-all'),

  // Admin endpoints
  adminListAll: () => api.get('/notifications/admin/all'),
  adminMarkRead: (id) => api.put(`/notifications/admin/${id}/read`),
  adminDelete: (id) => api.delete(`/notifications/admin/${id}`),
  adminCreate: (data) => api.post('/notifications/admin', data),
};

export default api;
