import { NotifyProvider } from '../contexts/NotifyContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { PermissionProvider } from '../contexts/PermissionContext';

export default function AppProviders({ children }) {
  return (
    <NotifyProvider>
      <ThemeProvider>
        <PermissionProvider>{children}</PermissionProvider>
      </ThemeProvider>
    </NotifyProvider>
  );
}
