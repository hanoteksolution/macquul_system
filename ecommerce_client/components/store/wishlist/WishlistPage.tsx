'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import StoreLayout from '../StoreLayout';
import ProductCard from '../product/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts, useCategories } from '@/hooks/use-catalog';
import { getWishlist, removeFromWishlist } from '../../../services/wishlist';
import type { Product } from '@/lib/types';

export default function WishlistPage() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const [items, setItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setItems(getWishlist() as Product[]);
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
    const onStorage = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener('wishlist-updated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wishlist-updated', onStorage);
    };
  }, [refresh]);

  const resolved = items.map((item) => {
    const live = products.find((p) => p.id === item.id);
    return live ? { ...item, ...live } : item;
  });

  const clearOne = (id: number) => {
    removeFromWishlist(id);
    refresh();
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  return (
    <StoreLayout categories={categories} products={products}>
      <div className="container-store py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-400">
              <Heart className="h-6 w-6 fill-current" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">My wishlist</h1>
              <p className="mt-1 text-slate-600 dark:text-zinc-400">
                {mounted ? `${resolved.length} saved item${resolved.length === 1 ? '' : 's'}` : 'Your saved favorites'}
              </p>
            </div>
          </div>
        </motion.div>

        {!mounted ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : resolved.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card mx-auto max-w-lg py-16 text-center"
          >
            <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40">
              <Heart className="h-10 w-10 text-rose-400" />
            </span>
            <h2 className="font-display text-xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
              Tap the heart on any product to save it here for later.
            </p>
            <Button asChild className="mt-8 bg-gradient-brand">
              <Link href="/shop">
                <Sparkles className="h-4 w-4" />
                Explore shop
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {resolved.map((product, i) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} index={i} />
                <button
                  type="button"
                  onClick={() => clearOne(product.id)}
                  className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-600 shadow-sm backdrop-blur-sm transition hover:bg-white dark:bg-zinc-900/90"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {mounted && resolved.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/shop">
                <ShoppingBag className="h-4 w-4" />
                Continue shopping
              </Link>
            </Button>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
