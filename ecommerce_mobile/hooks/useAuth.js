import { useState, useEffect } from 'react';
import { getStoredTokens, isTokenExpired, clearTokens } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { accessToken, refreshToken, user: storedUser } = await getStoredTokens();
      
      if (accessToken && !isTokenExpired(accessToken)) {
        // Token is valid
        setUser(storedUser);
        setIsAuthenticated(true);
      } else if (refreshToken) {
        // Access token expired but refresh token exists
        // The API interceptor will handle token refresh automatically
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        // No valid tokens
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await clearTokens();
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
