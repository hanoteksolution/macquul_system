import { useEffect } from 'react';
import { NotifyProvider } from '../contexts/NotifyContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import StoreProviders from './store/StoreProviders';
import { ensureValidAccessToken } from '../services/api';

function TokenRefreshOnLoad({ children }) {
  useEffect(() => {
    ensureValidAccessToken();
    const onFocus = () => ensureValidAccessToken();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);
  return children;
}

export default function AppProviders({ children }) {
  return (
    <NotifyProvider>
      <StoreProviders>
        <TokenRefreshOnLoad>
          <SettingsProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </SettingsProvider>
        </TokenRefreshOnLoad>
      </StoreProviders>
    </NotifyProvider>
  );
}
