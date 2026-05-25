import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import premiumAlert from '../utils/premiumAlert';

/**
 * API base URL (no /api suffix).
 * Set EXPO_PUBLIC_API_URL in ecommerce_mobile/.env before `npx expo start`.
 */
const DEFAULT_API_URL = 'https://ecommerce.safaritechno.com';

const alternativeUrls = [
  process.env.EXPO_PUBLIC_API_URL,
  DEFAULT_API_URL,
  'http://10.0.2.2:8020', // Android emulator → host Docker port
  'http://127.0.0.1:8020',
  'http://localhost:8020',
].filter(Boolean);

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

let navigationRef = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['access', 'refresh', 'user']);
    premiumAlert('Session expired', 'Your session has ended. Please sign in again.', [
      {
        text: 'Sign In',
        onPress: () => {
          if (navigationRef) {
            navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        },
      },
    ], { variant: 'login' });
  } catch (error) {
    console.error('Error during automatic logout:', error);
  }
};

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (__DEV__) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        await logout();
      }
    }
    return Promise.reject(error);
  }
);

export const checkApiHealth = async (retryAlternatives = true) => {
  try {
    const response = await api.get('/products/', { timeout: 8000 });
    return { success: true, data: response.data, workingUrl: API_URL };
  } catch (error) {
    if (!retryAlternatives) {
      return { success: false, error: error.message };
    }
    for (const altUrl of alternativeUrls) {
      if (altUrl === API_URL) continue;
      try {
        const altApi = axios.create({
          baseURL: `${altUrl}/api`,
          timeout: 8000,
          headers: { 'Content-Type': 'application/json' },
        });
        const response = await altApi.get('/products/');
        return { success: true, data: response.data, workingUrl: altUrl };
      } catch {
        continue;
      }
    }
    return { success: false, error: error.message };
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000 + 300;
  } catch {
    return true;
  }
};

export const getStoredTokens = async () => {
  try {
    const [access, refresh, user] = await AsyncStorage.multiGet(['access', 'refresh', 'user']);
    return {
      accessToken: access[1],
      refreshToken: refresh[1],
      user: user[1] ? JSON.parse(user[1]) : null,
    };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove(['access', 'refresh', 'user']);
};

export const manualLogout = async () => {
  await clearTokens();
  if (navigationRef) {
    navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
  }
};

export default api;
