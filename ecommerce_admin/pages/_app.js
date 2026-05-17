import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppProviders from '../components/AppProviders';

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
    <AppProviders>
      <AuthGate>
        <Component {...pageProps} />
      </AuthGate>
    </AppProviders>
  );
}
