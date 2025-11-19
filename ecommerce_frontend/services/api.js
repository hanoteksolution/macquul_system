import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap DRF paginated responses: { count, next, previous, results: [...] }
api.interceptors.response.use((response) => {
  const data = response?.data;
  if (data && typeof data === 'object' && Array.isArray(data.results)) {
    // Attach pagination meta (optional) and return array for convenience
    response.pagination = { count: data.count, next: data.next, previous: data.previous };
    response.data = data.results;
  }
  return response;
});

export default api;
