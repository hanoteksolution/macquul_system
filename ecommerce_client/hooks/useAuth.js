import { useState, useEffect } from 'react';
import { getStoredTokens, isTokenExpired, clearTokens, ensureValidAccessToken } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { refreshToken, user: storedUser } = getStoredTokens();

      if (refreshToken && !isTokenExpired(refreshToken, 0)) {
        await ensureValidAccessToken();
        setUser(storedUser);
        setIsAuthenticated(true);
        return;
      }

      const { accessToken } = getStoredTokens();
      if (accessToken && !isTokenExpired(accessToken)) {
        setUser(storedUser);
        setIsAuthenticated(true);
        return;
      }

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = (userData, tokens) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };
};
