import React from 'react';
import { ShimmerProductGrid } from './Shimmer';
import SkeletonScreen from './skeletons/shared/SkeletonScreen';

export default function PremiumProductSkeleton({ count = 6 }) {
  return (
    <SkeletonScreen>
      <ShimmerProductGrid count={count} />
    </SkeletonScreen>
  );
}
