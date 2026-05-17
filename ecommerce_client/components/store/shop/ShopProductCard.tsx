'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { toggleWishlist, isInWishlist } from '@/services/wishlist';
import type { ShopProductCardProps } from './types';

export default function ShopProductCard({
  product,
  index = 0,
  view = 'grid',
  onQuickView,
  onTrackView,
  className,
}: ShopProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const inStock = product.stock > 0;
  const price = Number(product.price);
  const compareAt = Math.round(price * 1.22 * 100) / 100;
  const onSale = index % 3 === 0;
  const rating = 4 + (index % 2) * 0.5;

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
  }, [product.id]);

  const onWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setWishlisted(isInWishlist(product.id));
  };

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    add(product);
    setCartOpen(true);
  };

  const onPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const imageBlock = (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900',
        view === 'grid' ? 'aspect-[4/5]' : 'aspect-square w-full sm:w-48 shrink-0'
      )}
    >
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className={cn('object-cover transition duration-700', hovered && 'scale-110')}
          sizes={view === 'grid' ? '(max-width:768px) 50vw, 25vw' : '192px'}
          unoptimized
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-brand-400/40" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        {onSale && <Badge variant="sale">-{20}%</Badge>}
        {!inStock && <Badge variant="outline">Sold out</Badge>}
      </div>
      <button
        type="button"
        onClick={onWishlist}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur transition hover:scale-110 dark:bg-zinc-900/95"
      >
        <Heart className={cn('h-4 w-4 transition', wishlisted && 'scale-110 fill-rose-500 text-rose-500')} />
      </button>
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
        className="absolute bottom-3 left-3 right-3 flex gap-2"
      >
        <Button size="sm" className="flex-1 rounded-xl" onClick={onAdd} disabled={!inStock}>
          <ShoppingBag className="h-4 w-4" />
          Add to cart
        </Button>
        <Button size="icon" variant="secondary" className="shrink-0 rounded-xl" onClick={onPreview}>
          <Eye className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );

  const infoBlock = (
    <div className={cn('flex flex-col justify-center', view === 'list' && 'flex-1 p-5 sm:p-6')}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
        {product.category?.name || 'Collection'}
      </p>
      <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{product.name}</h3>
      <div className="mt-2 flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn('h-3.5 w-3.5', i < Math.floor(rating) ? 'fill-current' : 'opacity-30')} />
        ))}
        <span className="ml-1 text-xs text-slate-500">({120 + index * 17})</span>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(price)}</span>
          {onSale && <span className="ml-2 text-sm text-slate-400 line-through">{formatPrice(compareAt)}</span>}
        </div>
        {inStock && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <Zap className="h-3 w-3" />
            Fast ship
          </span>
        )}
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: (index % 8) * 0.04, duration: 0.45 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn('group', className)}
    >
      <Link
        href={`/product/${product.id}`}
        onClick={() => onTrackView?.(product)}
        className={cn(
          'block overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 shadow-premium transition-all duration-500 dark:border-zinc-800/80 dark:bg-zinc-900/90',
          hovered && '-translate-y-1.5 shadow-float ring-1 ring-brand-500/20',
          view === 'list' && 'flex flex-col sm:flex-row'
        )}
      >
        {imageBlock}
        {view === 'grid' ? <div className="p-5">{infoBlock}</div> : infoBlock}
      </Link>
    </motion.article>
  );
}
