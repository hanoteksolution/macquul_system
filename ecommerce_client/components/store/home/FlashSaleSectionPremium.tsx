'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedCountdown from './AnimatedCountdown';
import FlashSaleCarousel from './FlashSaleCarousel';
import ProductQuickView from '../shop/ProductQuickView';
import type { Product } from '@/lib/types';
import { useStorefrontData } from '@/contexts/StorefrontContext';
import { useHomeSection } from '@/hooks/use-storefront';

export default function FlashSaleSectionPremium({ products }: { products: Product[] }) {
  const storefront = useStorefrontData();
  const section = useHomeSection(storefront, 'flash_sale', {
    title: 'Limited time offers',
    badge_text: 'Flash sale',
  });
  const endAt = (section.config as { end_at?: string } | undefined)?.end_at;
  const [quickView, setQuickView] = useState<Product | null>(null);

  if (!section.active) return null;

  const saleProducts = products.filter((p) => p.stock > 0).slice(0, 4);
  if (!saleProducts.length) return null;

  return (
    <section className="relative py-10 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_50%,rgba(244,63,94,0.06),transparent)]" />

      <div className="container-store relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-950 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.55)] ring-1 ring-white/10 dark:border-white/10"
        >
          {/* animated mesh background */}
          <div className="pointer-events-none absolute inset-0 bg-mesh-dark opacity-90" />
          <motion.div
            className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/25 blur-[120px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-rose-500/30 blur-[100px]"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-[80px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative grid lg:grid-cols-[minmax(0,34%)_1fr]">
            {/* Sale banner */}
            <div className="relative flex flex-col justify-center border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200 shadow-[0_0_20px_-4px_rgba(244,63,94,0.5)]"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="h-4 w-4 fill-current" />
                </motion.span>
                {section.badge_text || 'Flash sale'}
                <Flame className="h-3.5 w-3.5 text-orange-300" />
              </motion.span>

              <h2 className="relative mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                {section.title}
              </h2>
              <p className="relative mt-2 max-w-xs text-sm leading-snug text-white/55">
                Exclusive prices on bestsellers. When the clock stops, deals disappear.
              </p>

              <motion.div
                className="relative mt-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <AnimatedCountdown endAt={endAt} showProgress compact />
              </motion.div>

              <motion.div
                className="relative mt-5 flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  asChild
                  className="group h-9 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 px-5 text-sm text-white shadow-[0_0_24px_-4px_rgba(244,63,94,0.45)] hover:brightness-110"
                >
                  <Link href="/shop">
                    Shop now
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-9 rounded-full border-white/25 bg-white/5 px-4 text-sm text-white backdrop-blur hover:bg-white/10"
                >
                  <Link href="/shop">View all deals</Link>
                </Button>
              </motion.div>
            </div>

            {/* Products panel */}
            <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100/90 p-4 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 sm:p-5 lg:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_50%)]" />
              <div className="relative mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
                    Today&apos;s picks
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                    Up to 25% off select items
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  See entire sale →
                </Link>
              </div>

              <FlashSaleCarousel products={saleProducts} onQuickView={setQuickView} compact />
            </div>
          </div>
        </motion.div>
      </div>

      <ProductQuickView
        product={quickView}
        open={!!quickView}
        onOpenChange={(open) => !open && setQuickView(null)}
      />
    </section>
  );
}
