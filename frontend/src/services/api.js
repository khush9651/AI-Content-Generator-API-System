import axios from 'axios';

// Get API URL safely
const API_URL = import.meta.env.VITE_API_URL;

// Decide base URL
const BASE_URL = import.meta.env.DEV
  ? '/api' // local dev (Vite proxy)
  : API_URL
    ? `${API_URL}/api`
    : null;

// 🔴 Debug log (remove later)
console.log("API URL:", API_URL);
console.log("BASE URL:", BASE_URL);

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is missing in production!");
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API ERROR:", error);

    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : null) ||
      (error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Backend may be unreachable.'
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
