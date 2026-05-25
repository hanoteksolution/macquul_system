import React from 'react';
import { ShimmerProvider } from '../../Shimmer';

/** Wraps page skeletons with a single shared shimmer animation loop */
export default function SkeletonScreen({ children }) {
  return <ShimmerProvider>{children}</ShimmerProvider>;
}
