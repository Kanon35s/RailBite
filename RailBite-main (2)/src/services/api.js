import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const authAPI = {
  login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  getMe: (token) =>
    axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  forgotPassword: (email) =>
    axios.post(`${API_BASE_URL}/auth/forgot-password`, { email }),
  resetPassword: (token, newPassword) =>
    axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword })
};


export const dashboardAPI = {
  getStats: (token) =>
    axios.get(`${API_BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const orderAPI = {
  getAll: (token) =>
    axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getRecent: (token, limit = 5) =>
    axios.get(`${API_BASE_URL}/orders/recent?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getMyOrders: (token) =>
    axios.get(`${API_BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  getById: (id, token) =>
    axios.get(`${API_BASE_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  create: (data, token) =>
    axios.post(`${API_BASE_URL}/orders`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateStatus: (id, payload, token) =>
    axios.patch(`${API_BASE_URL}/orders/${id}/status`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  cancel: (id, token) =>
    axios.patch(`${API_BASE_URL}/orders/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
};


// 👉 add this:
export const menuAPI = {
  getAll: () =>
    axios.get(`${API_BASE_URL}/menu`),

  getByCategory: (category) =>
    axios.get(`${API_BASE_URL}/menu/category/${category}`),

  create: (data, token) =>
    axios.post(`${API_BASE_URL}/menu`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  update: (id, data, token) =>
    axios.put(`${API_BASE_URL}/menu/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  delete: (id, token) =>
    axios.delete(`${API_BASE_URL}/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  toggleAvailability: (id, available, token) =>
    axios.put(`${API_BASE_URL}/menu/${id}`, { available }, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const userAPI = {
  getAll: (token) =>
    axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  create: (data, token) =>
    axios.post(`${API_BASE_URL}/users`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateProfile: (data, token) =>
    axios.put(`${API_BASE_URL}/users/profile`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  update: (id, data, token) =>
    axios.put(`${API_BASE_URL}/users/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  toggleStatus: (id, token) =>
    axios.patch(`${API_BASE_URL}/users/${id}/toggle-status`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  delete: (id, token) =>
    axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};


export const deliveryStaffAPI = {
  getAll: (token) =>
    axios.get(`${API_BASE_URL}/delivery-staff`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  create: (data, token) =>
    axios.post(`${API_BASE_URL}/delivery-staff`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  update: (id, data, token) =>
    axios.put(`${API_BASE_URL}/delivery-staff/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  delete: (id, token) =>
    axios.delete(`${API_BASE_URL}/delivery-staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const reportAPI = {
  get: (range, token) =>
    axios.get(`${API_BASE_URL}/reports?range=${range}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getPopularItems: (token) =>
    axios.get(`${API_BASE_URL}/reports/popular-items`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const notificationAPI = {
  getAll: (token) =>
    axios.get(`${API_BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getCustomer: (token) =>
    axios.get(`${API_BASE_URL}/notifications/customer`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  send: (data, token) =>
    axios.post(`${API_BASE_URL}/notifications`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  delete: (id, token) =>
    axios.delete(`${API_BASE_URL}/notifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const contactAPI = {
  send: (data) =>
    axios.post(`${API_BASE_URL}/contact`, data),

  getAll: (token) =>
    axios.get(`${API_BASE_URL}/contact`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateStatus: (id, status, token) =>
    axios.patch(`${API_BASE_URL}/contact/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  delete: (id, token) =>
    axios.delete(`${API_BASE_URL}/contact/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export default axios;
