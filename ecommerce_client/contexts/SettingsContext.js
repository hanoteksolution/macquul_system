import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Default settings
    siteName: 'Safari Ecommerce',
    siteDescription:
      'Premium curated commerce — exceptional products, trusted delivery, and a world-class shopping experience.',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#F59E0B',
    logo: '',
    favicon: '',
    contactEmail: 'support@estore.com',
    contactPhone: '+000 000 0000',
    address: '123 Business Street, City, Country',
    currency: 'USD',
    taxRate: 10,
    shippingFee: 5.99,
    freeShippingThreshold: 50,
    enableRegistration: true,
    enableGuestCheckout: true,
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    stockAlerts: true
  });
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load settings from API
  useEffect(() => {
    if (mounted) {
      loadSettings();
      
      // Set up polling to check for settings updates every 30 seconds
      const interval = setInterval(() => {
        loadSettings();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [mounted]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      console.log('Loading settings from Django backend...');
      
      // Use Django backend API for settings
      const response = await api.get('/settings/public/');
      console.log('Settings loaded:', response.data);
      
      if (response.data) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...response.data
        }));
        
        // Apply CSS custom properties for colors
        applyColorSettings(response.data);
        console.log('Settings applied successfully');
      }
    } catch (error) {
      console.error('Failed to load settings from backend:', error);
      // Use default settings if API fails
      applyColorSettings(settings);
    } finally {
      setLoading(false);
    }
  };

  const applyColorSettings = (settingsData) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      console.log('Applying color settings:', {
        primary: settingsData.primaryColor,
        secondary: settingsData.secondaryColor,
        accent: settingsData.accentColor
      });
      
      // Apply CSS custom properties
      const primaryColor = settingsData.primaryColor || settings.primaryColor;
      const secondaryColor = settingsData.secondaryColor || settings.secondaryColor;
      const accentColor = settingsData.accentColor || settings.accentColor;
      
      root.style.setProperty('--primary-color', primaryColor);
      root.style.setProperty('--secondary-color', secondaryColor);
      root.style.setProperty('--accent-color', accentColor);
      
      console.log('CSS variables set:', {
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
        '--accent-color': accentColor
      });
      
      // Update document title & favicon
      if (settingsData.siteName) {
        document.title = settingsData.siteName;
      }

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && settingsData.siteDescription) {
        metaDescription.setAttribute('content', settingsData.siteDescription);
      }

      let favicon =
        document.querySelector("link[rel='icon']") ||
        document.querySelector("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      const faviconHref = settingsData.favicon || '/favicon.svg';
      favicon.href = faviconHref;
      favicon.type = faviconHref.endsWith('.svg') ? 'image/svg+xml' : 'image/png';

      console.log('Color settings applied to CSS variables');
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.post('/settings/', newSettings);
      
      setSettings(prevSettings => ({
        ...prevSettings,
        ...newSettings
      }));
      
      // Apply the new settings immediately
      applyColorSettings(newSettings);
      
      return response.data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const refreshSettings = () => {
    console.log('Manually refreshing settings...');
    loadSettings();
  };

  // Add a function to force refresh settings (useful for testing)
  const forceRefresh = () => {
    console.log('Force refreshing settings...');
    setMounted(false);
    setTimeout(() => setMounted(true), 100);
  };

  const value = {
    settings,
    loading,
    updateSettings,
    refreshSettings,
    forceRefresh,
    applyColorSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
