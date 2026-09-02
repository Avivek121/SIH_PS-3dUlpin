import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if explicitly unauthorized and not already on /login
    if (error.response && error.response.status === 401 && !window.location.pathname.includes('/login')) {
      // Allow demo / guest fallback without jarring redirect
      console.warn('API 401 Unauthorized - using authenticated session fallback');
    }
    return Promise.reject(error);
  }
);
