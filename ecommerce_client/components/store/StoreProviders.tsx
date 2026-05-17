'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { StorefrontProvider } from '@/contexts/StorefrontContext';
import { ensureValidAccessToken } from '../../services/api';

function CartHydration() {
  const hydrate = useCartStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
    ensureValidAccessToken();
  }, [hydrate]);
  return null;
}

export default function StoreProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StorefrontProvider>
        <CartHydration />
        {children}
      </StorefrontProvider>
    </QueryClientProvider>
  );
}
