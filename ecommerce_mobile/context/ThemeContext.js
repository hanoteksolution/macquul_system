import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  lightPremium,
  darkPremium,
  lightShimmer,
  darkShimmer,
} from '../constants/premiumThemes';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const legacyLight = {
  primary: lightPremium.emerald,
  secondary: lightPremium.indigo,
  accent: lightPremium.violet,
  background: lightPremium.background,
  surface: lightPremium.surface,
  text: lightPremium.text,
  textSecondary: lightPremium.textSecondary,
  border: lightPremium.border,
  error: '#ef4444',
  success: lightPremium.emerald,
  warning: '#f59e0b',
  info: '#3b82f6',
};

const legacyDark = {
  primary: darkPremium.emeraldLight,
  secondary: darkPremium.cyan,
  accent: darkPremium.violet,
  background: darkPremium.background,
  surface: darkPremium.surface,
  text: darkPremium.text,
  textSecondary: darkPremium.textSecondary,
  border: darkPremium.border,
  error: '#ef4444',
  success: darkPremium.emerald,
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const premium = isDarkMode ? darkPremium : lightPremium;
  const shimmer = isDarkMode ? darkShimmer : lightShimmer;
  const theme = isDarkMode ? legacyDark : legacyLight;

  const value = useMemo(
    () => ({
      isDarkMode,
      theme,
      premium,
      shimmer,
      toggleTheme,
      loading,
    }),
    [isDarkMode, theme, premium, shimmer, loading]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
