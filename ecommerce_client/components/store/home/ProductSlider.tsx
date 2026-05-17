'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProductSliderProps {
  products: Product[];
  title?: string;
  className?: string;
  autoPlay?: boolean;
  intervalMs?: number;
}

export default function ProductSlider({
  products,
  className,
  autoPlay = false,
  intervalMs = 6000,
}: ProductSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  const scroll = useCallback((dir: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(280, el.clientWidth * 0.75);
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [products.length, updateArrows]);

  useEffect(() => {
    if (!autoPlay || products.length < 2) return;
    const t = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
      else scroll('next');
    }, intervalMs);
    return () => clearInterval(t);
  }, [autoPlay, intervalMs, products.length, scroll]);

  if (!products.length) return null;

  return (
    <div className={cn('relative', className)}>
      {canPrev && (
        <button
          type="button"
          onClick={() => scroll('prev')}
          aria-label="Scroll previous"
          className="absolute -left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900 sm:flex lg:-left-5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => scroll('next')}
          aria-label="Scroll next"
          className="absolute -right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900 sm:flex lg:-right-5"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide sm:gap-6"
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
