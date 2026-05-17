'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { toggleWishlist, isInWishlist } from '../../../services/wishlist';

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export default function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const inStock = product.stock > 0;
  const price = Number(product.price);
  const compareAt = price * 1.2;
  const onSale = index % 3 === 0;

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
  }, [product.id]);

  const onWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    setWishlisted(isInWishlist(product.id));
  };

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    add(product);
    setCartOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn('group relative', className)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div
          className={cn(
            'glass-card relative overflow-hidden transition-all duration-500',
            hovered && '-translate-y-2 shadow-float'
          )}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-zinc-800">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className={cn('object-cover transition duration-700', hovered && 'scale-110')}
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-950 dark:to-violet-950">
                <ShoppingBag className="h-12 w-12 text-brand-400/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {onSale && <Badge variant="sale">-{20}%</Badge>}
              {!inStock && <Badge variant="outline">Sold out</Badge>}
              {inStock && product.stock < 10 && <Badge variant="success">Low stock</Badge>}
            </div>
            <button
              type="button"
              onClick={onWishlist}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition hover:scale-110 dark:bg-zinc-900/90"
            >
              <Heart className={cn('h-4 w-4', wishlisted && 'fill-rose-500 text-rose-500')} />
            </button>
            <motion.div
              initial={false}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
              className="absolute bottom-3 left-3 right-3 flex gap-2"
            >
              <Button size="sm" className="flex-1" onClick={onAdd} disabled={!inStock}>
                <ShoppingBag className="h-4 w-4" />
                Add
              </Button>
              <Button size="icon" variant="glass" className="shrink-0 bg-white/90 text-slate-900">
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {product.category?.name || 'Collection'}
            </p>
            <h3 className="mt-1 line-clamp-1 font-semibold text-slate-900 dark:text-white">{product.name}</h3>
            <div className="mt-2 flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-3.5 w-3.5', i < 4 ? 'fill-current' : 'opacity-30')} />
              ))}
              <span className="ml-1 text-xs text-slate-500">(128)</span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(price)}</span>
                {onSale && (
                  <span className="ml-2 text-sm text-slate-400 line-through">{formatPrice(compareAt)}</span>
                )}
              </div>
              {inStock && (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <Zap className="h-3 w-3" />
                  Fast ship
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
