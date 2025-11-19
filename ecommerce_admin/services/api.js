import axios from 'axios';
import Router from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: `${API_URL}/api` });

// Logout function
const logout = () => {
  if (typeof window !== 'undefined') {
    // Clear all stored tokens and user data
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    
    console.log('Admin logged out automatically due to token expiration');
    
    // Redirect to login page silently
    Router.push('/login');
  }
};

// Token management utilities
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode JWT token (basic decode, not verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired (with 5 minute buffer)
    return payload.exp < (currentTime + 300);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
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
    console.log('Admin tokens cleared successfully');
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
      console.log(`Making Admin API request to: ${config.baseURL}${config.url}`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`Admin API Response: ${response.status} - ${response.config.url}`);
    
    // Handle pagination
    const data = response?.data;
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      response.pagination = { count: data.count, next: data.next, previous: data.previous };
      response.data = data.results;
    }
    return response;
  },
  async (error) => {
    console.log(`Admin API Error: ${error.message} - ${error.config?.url}`);
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const originalRequest = error.config;
      
      // Check if this is not already a retry and not a login/register request
      if (!originalRequest._retry && 
          !originalRequest.url.includes('/auth/login/') && 
          !originalRequest.url.includes('/auth/register/')) {
        
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem('refresh');
          
          if (refreshToken) {
            console.log('Attempting to refresh admin token...');
            const refreshResponse = await axios.post(`${API_URL}/api/auth/refresh/`, {
              refresh: refreshToken
            });
            
            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem('access', newAccessToken);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } else {
            // No refresh token available, logout
            console.log('No refresh token available, logging out admin...');
            logout();
          }
        } catch (refreshError) {
          console.log('Admin token refresh failed, logging out...', refreshError.message);
          // Refresh failed, logout user
          logout();
        }
      } else if (originalRequest.url.includes('/auth/login/') || 
                 originalRequest.url.includes('/auth/register/')) {
        // Login/register failed, don't auto-logout
        console.log('Admin login/register request failed');
      } else {
        // Already tried to refresh, logout
        console.log('Admin token refresh retry failed, logging out...');
        logout();
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
