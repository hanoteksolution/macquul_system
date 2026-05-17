'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useStorefront } from '@/hooks/use-storefront';
import type { StorefrontPublic } from '@/lib/storefront-types';

const StorefrontContext = createContext<StorefrontPublic | undefined>(undefined);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const { data } = useStorefront();
  return <StorefrontContext.Provider value={data}>{children}</StorefrontContext.Provider>;
}

export function useStorefrontData() {
  return useContext(StorefrontContext);
}
