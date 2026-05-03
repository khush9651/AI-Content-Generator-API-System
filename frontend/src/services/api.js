import axios from 'axios';

// Dynamic base URL:
// - In development → uses Vite proxy (/api → localhost backend)
// - In production → uses deployed backend URL from env
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
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
      (error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : null) ||
      (error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Please check backend deployment.'
        : null) ||
      error.message ||
      'An unexpected error occurred.';

    return Promise.reject(new Error(message));
  }
);

export const contentApi = {
  generate: (topic, tone = 'professional') =>
    api.post('/content/generate', { topic, tone }),

  getHistory: () => api.get('/content/history'),

  deleteHistoryItem: (id) =>
    api.delete(`/content/history/${id}`),
};
