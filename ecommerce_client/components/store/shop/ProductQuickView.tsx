'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  if (!product) return null;

  const price = Number(product.price);
  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!inStock) return;
    for (let i = 0; i < qty; i++) add(product);
    setCartOpen(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden border-0 p-0 sm:max-w-4xl" hideClose>
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2"
        >
          <div className="relative aspect-square bg-slate-100 dark:bg-zinc-800">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-slate-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {product.category?.name}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">{product.name}</h2>
            <div className="mt-2 flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-4 w-4', i < 4 && 'fill-current')} />
              ))}
            </div>
            <p className="mt-4 text-3xl font-bold">{formatPrice(price)}</p>
            <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-zinc-400">
              {product.description || 'Premium quality product with fast delivery.'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium">Qty</span>
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1 rounded-2xl" onClick={handleAdd} disabled={!inStock}>
                <ShoppingBag className="h-4 w-4" />
                Add to cart
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href={`/product/${product.id}`}>Full details</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
