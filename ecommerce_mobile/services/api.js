import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import { Platform } from 'react-native';

// Get the correct API URL based on platform
const getApiUrl = () => {
  // Use your actual computer's IP address for all platforms
  // This works for both Android emulator and physical devices
  return 'http://10.161.1.4:8000';
};

// Alternative URLs to try if the primary fails
const alternativeUrls = [
  'http://10.0.2.2:8000',      // Android emulator localhost
  'http://192.168.137.1:8000', // Your mobile hotspot IP
  'http://localhost:8000',     // iOS simulator
  'http://127.0.0.1:8000',     // Localhost fallback
];

export const API_URL = process.env.EXPO_PUBLIC_API_URL || getApiUrl();

// Navigation reference for automatic logout
let navigationRef = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

// Logout function
const logout = async () => {
  try {
    // Clear all stored tokens and user data
    await AsyncStorage.multiRemove(['access', 'refresh', 'user']);
    console.log('User logged out automatically due to token expiration');
    
    // Show alert to user
    Alert.alert(
      'Session Expired',
      'Your session has expired. Please login again.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to login screen
            if (navigationRef) {
              navigationRef.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        }
      ]
    );
  } catch (error) {
    console.error('Error during automatic logout:', error);
  }
};

const api = axios.create({ 
  baseURL: `${API_URL}/api`,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(`Making API request to: ${config.baseURL}${config.url}`);
  return config;
});

// COMPLETELY DISABLED - Response interceptor to isolate the includes error
// api.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

// Health check function with retry logic
export const checkApiHealth = async (retryAlternatives = false) => {
  try {
    const response = await api.get('/products/', { timeout: 5000 });
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`API health check failed for ${API_URL}: ${error.message}`);
    
    if (retryAlternatives) {
      // Try alternative URLs
      for (const altUrl of alternativeUrls) {
        try {
          console.log(`Trying alternative URL: ${altUrl}`);
          const altApi = axios.create({ 
            baseURL: `${altUrl}/api`,
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
          });
          
          const response = await altApi.get('/products/');
          console.log(`✅ Alternative URL working: ${altUrl}`);
          return { success: true, data: response.data, workingUrl: altUrl };
        } catch (altError) {
          console.log(`❌ Alternative URL failed: ${altUrl}`);
          continue;
        }
      }
    }
    
    return { success: false, error: error.message };
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

export const getStoredTokens = async () => {
  try {
    const [access, refresh, user] = await AsyncStorage.multiGet(['access', 'refresh', 'user']);
    return {
      accessToken: access[1],
      refreshToken: refresh[1],
      user: user[1] ? JSON.parse(user[1]) : null
    };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return { accessToken: null, refreshToken: null, user: null };
  }
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove(['access', 'refresh', 'user']);
    console.log('Tokens cleared successfully');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Manual logout function (for logout button)
export const manualLogout = async () => {
  await clearTokens();
  if (navigationRef) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }
};

export default api;
