'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Heart, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import StoreLayout from '../StoreLayout';
import ProductCard from './ProductCard';
import { useProduct, useProducts } from '@/hooks/use-catalog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCardSkeleton, Skeleton } from '@/components/ui/skeleton';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { toggleWishlist, isInWishlist } from '../../../services/wishlist';

export default function ProductDetailPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const related = allProducts.filter((p) => p.category?.id === product?.category?.id && p.id !== product?.id).slice(0, 4);

  if (isLoading || !product) {
    return (
      <StoreLayout>
        <div className="container-store py-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const inStock = product.stock > 0;
  const price = Number(product.price);

  return (
    <StoreLayout categories={[]} products={allProducts}>
      <div className="container-store py-8 lg:py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card relative aspect-square overflow-hidden rounded-[2rem]"
          >
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-zinc-800">
                <ShoppingBag className="h-20 w-20 text-slate-300" />
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Badge>{product.category?.name}</Badge>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="text-sm text-slate-500">(128 reviews)</span>
            </div>
            <p className="mt-6 text-3xl font-bold">{formatPrice(price)}</p>
            <p className="mt-4 text-slate-600 dark:text-zinc-400">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 dark:border-zinc-700">
                <button type="button" className="p-2" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  className="p-2"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={!inStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1"
                disabled={!inStock}
                onClick={() => {
                  add(product, qty);
                  setCartOpen(true);
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to bag
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleWishlist(product);
                  setWishlisted(!wishlisted);
                }}
              >
                <Heart className={cn('h-5 w-5', wishlisted && 'fill-rose-500 text-rose-500')} />
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="glass-card flex gap-3 p-4">
                <Truck className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="text-sm font-semibold">Free delivery</p>
                  <p className="text-xs text-slate-500">On orders over $75</p>
                </div>
              </div>
              <div className="glass-card flex gap-3 p-4">
                <Shield className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold">Secure checkout</p>
                  <p className="text-xs text-slate-500">256-bit encryption</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-display text-2xl font-bold">You may also like</h2>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
}
