'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Category, Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface ShopHeroProps {
  categories: Category[];
  products: Product[];
  activeCategory?: string;
}

export default function ShopHero({ categories, products, activeCategory }: ShopHeroProps) {
  const spotlight = products.find((p) => p.image_url) || products[0];
  const categoryName =
    categories.find((c) => String(c.id) === String(activeCategory))?.name || 'Electronics & Stationery';

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950" />
      <div className="absolute inset-0 bg-mesh-dark opacity-80" />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-500/30 blur-[100px]" />
      <div
        className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-[100px]"
        aria-hidden
      />

      <div className="container-store relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Premium collection
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Best in{' '}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                {categoryName}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              Curated essentials with fast delivery, secure checkout, and a shopping experience built for modern
              professionals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-white px-8 text-slate-900 hover:bg-zinc-100">
                <Link href="#shop-grid">
                  Shop now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="glass"
                size="lg"
                className="rounded-full border-white/25 bg-white/10 px-8 text-white"
              >
                <Link href="/shop">View all</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                { label: 'Products', value: String(products.length) },
                { label: 'Categories', value: String(categories.length) },
                { label: 'Fast ship', value: '24h' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider text-white/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {spotlight && (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-float backdrop-blur-xl"
              >
                {spotlight.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={spotlight.image_url}
                    alt={spotlight.name}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/30 to-violet-600/30">
                    <ShoppingBag className="h-16 w-16 text-white/40" />
                  </div>
                )}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-md">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/70">Featured</p>
                  <p className="mt-1 font-semibold text-white">{spotlight.name}</p>
                  <p className="text-lg font-bold text-white">{formatPrice(spotlight.price)}</p>
                </div>
              </motion.div>
            )}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -left-4 top-8 z-0 hidden rounded-2xl border border-white/15 bg-white/10 p-4 shadow-glass backdrop-blur-xl sm:block"
            >
              <p className="text-xs text-white/60">Member perks</p>
              <p className="text-sm font-semibold text-white">15% off first order</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-2 bottom-12 z-20 hidden rounded-2xl border border-emerald-400/30 bg-emerald-500/20 px-4 py-3 backdrop-blur-md sm:block"
            >
              <p className="text-xs font-semibold text-emerald-200">In stock · Ships today</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
