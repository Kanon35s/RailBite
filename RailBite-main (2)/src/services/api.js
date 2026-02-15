<<<<<<< HEAD
=======
// src/services/api.js
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
<<<<<<< HEAD
    'Content-Type': 'application/json'
  }
=======
    'Content-Type': 'application/json',
  },
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('railbiteToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
<<<<<<< HEAD
  (error) => {
    return Promise.reject(error);
  }
=======
  (error) => Promise.reject(error)
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('railbiteToken');
      localStorage.removeItem('railbiteUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
<<<<<<< HEAD
  logout: () => api.post('/auth/logout')
=======
  logout: () => api.post('/auth/logout'),
>>>>>>> parent of 4e40cd62 (latest update on backend completion)
};

export default api;
