import axios from 'axios';
import Router from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: `${API_URL}/api` });

/** GET routes that must work without a valid login (catalog, settings). */
const PUBLIC_GET_PATTERNS = [
  /^\/products\/?$/,
  /^\/products\/featured\/?$/,
  /^\/products\/\d+\/?$/,
  /^\/categories\/?$/,
  /^\/carousel\/slides\/active\/?$/,
  /^\/settings\//,
];

function isPublicCatalogGet(config) {
  const method = (config?.method || 'get').toLowerCase();
  if (method !== 'get') return false;
  const path = (config?.url || '').split('?')[0];
  return PUBLIC_GET_PATTERNS.some((re) => re.test(path));
}

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token, skewSeconds = 60) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= (payload.exp - skewSeconds) * 1000;
}

export function setTokens({ access, refresh }) {
  if (typeof window === 'undefined') return;
  if (access) localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (typeof window === 'undefined') {
    throw new Error('Cannot refresh outside browser');
  }

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh || isTokenExpired(refresh, 0)) {
      throw new Error('Refresh token missing or expired');
    }

    const { data } = await axios.post(`${API_URL}/api/auth/token/refresh/`, { refresh });
    setTokens({ access: data.access, refresh: data.refresh });
    return data.access;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

/** Proactively refresh access token when the app loads or tab regains focus. */
export async function ensureValidAccessToken() {
  if (typeof window === 'undefined') return null;

  const access = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');

  if (access && !isTokenExpired(access)) return access;
  if (!refresh || isTokenExpired(refresh, 0)) return null;

  try {
    return await refreshAccessToken();
  } catch {
    localStorage.removeItem('access');
    return null;
  }
}

export const getStoredTokens = () => {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null, user: null };

  try {
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');
    const user = localStorage.getItem('user');

    return {
      accessToken,
      refreshToken,
      user: user ? JSON.parse(user) : null,
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
  }
};

export const manualLogout = () => {
  clearTokens();
  Router.push('/login');
};

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config;

  let access = localStorage.getItem('access');

  if (access && isTokenExpired(access)) {
    const refresh = localStorage.getItem('refresh');
    if (refresh && !isTokenExpired(refresh, 0)) {
      try {
        access = await refreshAccessToken();
      } catch {
        localStorage.removeItem('access');
        access = null;
      }
    } else {
      localStorage.removeItem('access');
      access = null;
    }
  }

  if (access && !isTokenExpired(access)) {
    config.headers.Authorization = `Bearer ${access}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response?.data;
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      response.pagination = { count: data.count, next: data.next, previous: data.previous };
      response.data = data.results;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401 || typeof window === 'undefined') {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem('refresh');
    if (refresh && !isTokenExpired(refresh, 0)) {
      originalRequest._retry = true;
      try {
        const access = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('access');
      }
    }

    if (isPublicCatalogGet(originalRequest)) {
      originalRequest._retry = true;
      delete originalRequest.headers.Authorization;
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
