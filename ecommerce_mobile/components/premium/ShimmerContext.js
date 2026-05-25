import React, { createContext, useContext, useMemo } from 'react';
import usePremiumShimmer from '../../hooks/usePremiumShimmer';
import { useTheme } from '../../context/ThemeContext';

const ShimmerContext = createContext(null);

export function ShimmerProvider({ children }) {
  const anim = usePremiumShimmer();
  const { shimmer, premium } = useTheme();
  const value = useMemo(() => ({ ...anim, shimmer, premium }), [anim, shimmer, premium]);
  return <ShimmerContext.Provider value={value}>{children}</ShimmerContext.Provider>;
}

export function useShimmerContext() {
  const ctx = useContext(ShimmerContext);
  if (!ctx) {
    throw new Error('Shimmer components must be used within ShimmerProvider');
  }
  return ctx;
}
