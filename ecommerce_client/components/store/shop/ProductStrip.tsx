'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ShopProductCard from './ShopProductCard';
import type { Product } from '@/lib/types';

interface ProductStripProps {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
  onQuickView?: (p: Product) => void;
  onTrackView?: (p: Product) => void;
}

export default function ProductStrip({
  title,
  subtitle,
  products,
  href = '/shop',
  onQuickView,
  onTrackView,
}: ProductStripProps) {
  if (!products.length) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="container-store">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-slate-600 dark:text-zinc-400">{subtitle}</p>}
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {products.slice(0, 4).map((p, i) => (
            <div key={p.id} className="w-[260px] shrink-0 lg:w-auto">
              <ShopProductCard
                product={p}
                index={i}
                onQuickView={onQuickView}
                onTrackView={onTrackView}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
