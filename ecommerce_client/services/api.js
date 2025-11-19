import axios from 'axios';
import Router from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: `${API_URL}/api` });

// Manual logout function (for logout button) - No automatic logout
const logout = () => {
  if (typeof window !== 'undefined') {
    // Clear all stored tokens and user data
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    
    console.log('User logged out manually');
    Router.push('/login');
  }
};

export const getStoredTokens = () => {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null, user: null };
  
  try {
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');
    const user = localStorage.getItem('user');
    
    return {
      accessToken,
      refreshToken,
      user: user ? JSON.parse(user) : null
    };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return { accessToken: null, refreshToken: null, user: null };
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    console.log('Tokens cleared successfully');
  }
};

// Manual logout function (for logout button)
export const manualLogout = () => {
  clearTokens();
  Router.push('/login');
};

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Making API request to: ${config.baseURL}${config.url}`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} - ${response.config.url}`);
    
    // Handle pagination
    const data = response?.data;
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      response.pagination = { count: data.count, next: data.next, previous: data.previous };
      response.data = data.results;
    }
    return response;
  },
  async (error) => {
    console.log(`API Error: ${error.message} - ${error.config?.url}`);
    
    // Only handle login/register errors - no automatic logout for 401s
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const originalRequest = error.config;
      
      // Only handle login/register failures, don't auto-logout for other 401s
      if (originalRequest.url.includes('/auth/login/') || 
          originalRequest.url.includes('/auth/register/')) {
        console.log('Login/register request failed');
      } else {
        // For other 401s, just log but don't logout automatically
        console.log('API request unauthorized, but keeping user logged in');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
