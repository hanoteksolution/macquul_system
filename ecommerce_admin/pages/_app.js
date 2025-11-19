import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { PermissionProvider } from '../contexts/PermissionContext';

function AuthGate({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isLogin = router.pathname === '/login';
    const token = localStorage.getItem('access');
    if (!token && !isLogin) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router.pathname]);

  if (!ready && router.pathname !== '/login') return null;
  return children;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <PermissionProvider>
        <AuthGate>
          <Component {...pageProps} />
        </AuthGate>
      </PermissionProvider>
    </ThemeProvider>
  );
}
