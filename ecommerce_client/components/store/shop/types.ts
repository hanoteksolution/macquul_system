import type { Product } from '@/lib/types';

export type ShopSort = 'featured' | 'price-asc' | 'price-desc' | 'name' | 'newest';
export type ShopView = 'grid' | 'list';

export interface ShopFilterState {
  search: string;
  sort: ShopSort;
  view: ShopView;
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  minRating: number;
}

export interface ShopProductCardProps {
  product: Product;
  index?: number;
  view?: ShopView;
  onQuickView?: (product: Product) => void;
  onTrackView?: (product: Product) => void;
  className?: string;
}
