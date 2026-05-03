import axios from 'axios';

// Use Vite's dev proxy (/api → http://localhost:5000/api)
// This avoids CORS issues and direct connection errors in development.
const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      (error.code === 'ERR_NETWORK' ? 'Cannot connect to server. Make sure the backend is running on port 5000.' : null) ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export const contentApi = {
  generate: (topic, tone = 'professional') =>
    api.post('/content/generate', { topic, tone }),

  getHistory: () => api.get('/content/history'),

  deleteHistoryItem: (id) => api.delete(`/content/history/${id}`),
};
