'use client';

import StoreHeader from './layout/StoreHeader';
import StoreFooter from './layout/StoreFooter';
import MobileBottomNav from './layout/MobileBottomNav';
import CartDrawer from './cart/CartDrawer';
import type { Category, Product } from '@/lib/types';

interface StoreLayoutProps {
  children: React.ReactNode;
  categories?: Category[];
  products?: Product[];
  hideNav?: boolean;
}

export default function StoreLayout({ children, categories = [], products = [], hideNav }: StoreLayoutProps) {
  return (
    <div className="store-mesh flex min-h-screen flex-col pb-20 lg:pb-0">
      {!hideNav && <StoreHeader categories={categories} products={products} />}
      <main className="flex-1">{children}</main>
      {!hideNav && <StoreFooter />}
      {!hideNav && <MobileBottomNav />}
      <CartDrawer />
    </div>
  );
}
