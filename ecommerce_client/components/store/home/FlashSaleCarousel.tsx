'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FlashSaleProductCard from './FlashSaleProductCard';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlashSaleCarouselProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  className?: string;
  compact?: boolean;
}

export default function FlashSaleCarousel({ products, onQuickView, className, compact }: FlashSaleCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const scroll = (dir: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update, products.length]);

  return (
    <div className={cn('relative', className)}>
      <div className="mb-4 flex items-center justify-end gap-2 lg:absolute lg:-top-14 lg:right-0 lg:mb-0">
        <button
          type="button"
          onClick={() => scroll('prev')}
          disabled={!canPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 shadow-sm transition hover:bg-white disabled:opacity-30 dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll('next')}
          disabled={!canNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 shadow-sm transition hover:bg-white disabled:opacity-30 dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={trackRef}
        className={cn(
          'flex snap-x snap-mandatory overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0',
          compact ? 'gap-3 lg:gap-3' : 'gap-4 lg:gap-5'
        )}
      >
        {products.map((p, i) => (
          <FlashSaleProductCard key={p.id} product={p} index={i} onQuickView={onQuickView} compact={compact} />
        ))}
      </div>
      </div>
  );
}
