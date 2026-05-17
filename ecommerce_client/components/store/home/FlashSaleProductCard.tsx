'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { toggleWishlist, isInWishlist } from '@/services/wishlist';

interface FlashSaleProductCardProps {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
}

export default function FlashSaleProductCard({ product, index = 0, onQuickView }: FlashSaleProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const price = Number(product.price);
  const compareAt = Math.round(price * 1.25 * 100) / 100;
  const inStock = product.stock > 0;
  const onSale = index % 2 === 0;

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
  }, [product.id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group h-full min-w-[200px] max-w-[280px] shrink-0 snap-start sm:min-w-[220px] lg:min-w-0 lg:max-w-none"
    >
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-premium backdrop-blur-sm transition-all duration-500 dark:border-white/10 dark:bg-zinc-900/90',
          hovered && '-translate-y-1.5 shadow-float ring-1 ring-rose-500/20'
        )}
      >
        <Link href={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-zinc-800">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className={cn('object-cover transition duration-700', hovered && 'scale-110')}
              sizes="220px"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-rose-100 to-violet-100 dark:from-rose-950 dark:to-violet-950">
              <ShoppingBag className="h-10 w-10 text-rose-300/50" />
            </div>
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            animate={{ opacity: hovered ? 1 : 0.6 }}
          />
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {onSale && <Badge variant="sale">-25%</Badge>}
            {!inStock && <Badge variant="outline">Sold out</Badge>}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
              setWishlisted(isInWishlist(product.id));
            }}
            className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur dark:bg-zinc-900/95"
          >
            <Heart className={cn('h-4 w-4', wishlisted && 'fill-rose-500 text-rose-500')} />
          </button>
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            className="absolute bottom-2.5 left-2.5 right-2.5 flex gap-2"
          >
            <Button
              size="sm"
              className="h-9 flex-1 rounded-xl bg-white text-slate-900 hover:bg-zinc-100"
              disabled={!inStock}
              onClick={(e) => {
                e.preventDefault();
                add(product);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 shrink-0 rounded-xl"
              onClick={(e) => {
                e.preventDefault();
                onQuickView?.(product);
              }}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </Link>
        <motion.div className="flex flex-1 flex-col p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
            {product.category?.name}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn('h-3 w-3', i < 4 ? 'fill-current' : 'opacity-25')} />
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(price)}</span>
              {onSale && (
                <span className="ml-1.5 text-xs text-slate-400 line-through">{formatPrice(compareAt)}</span>
              )}
            </div>
            {inStock && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                <Zap className="h-3 w-3" />
                Fast
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
