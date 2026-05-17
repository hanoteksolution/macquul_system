'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import ProductSlider from './ProductSlider';
import { Button } from '@/components/ui/button';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { useStorefrontData } from '@/contexts/StorefrontContext';
import { useHomeSection } from '@/hooks/use-storefront';

function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-slate-600 dark:text-zinc-400">{subtitle}</p>}
      </div>
      {href && (
        <Button variant="outline" asChild>
          <Link href={href}>
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export function FeaturedSection({ products, loading }: { products: Product[]; loading?: boolean }) {
  const storefront = useStorefrontData();
  const section = useHomeSection(storefront, 'featured', {
    title: 'Featured products',
    subtitle: 'Handpicked bestsellers for you',
    view_all_href: '/shop',
  });
  if (!section.active) return null;
  return (
    <section className="py-16 lg:py-24">
      <div className="container-store">
        <SectionHeader title={section.title} subtitle={section.subtitle} href={section.view_all_href} />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}


export { default as CategoriesSection } from './CategoriesSectionPremium';
export { default as FlashSaleSection } from './FlashSaleSectionPremium';

export function TrendingSection({ products }: { products: Product[] }) {
  const storefront = useStorefrontData();
  const section = useHomeSection(storefront, 'trending', {
    title: 'Trending now',
    subtitle: 'What everyone is buying this week',
    view_all_href: '/shop',
  });
  if (!section.active) return null;
  const trending = products.slice(0, 8);
  return (
    <section className="py-16 lg:py-24">
      <div className="container-store">
        <SectionHeader title={section.title} subtitle={section.subtitle} href={section.view_all_href} />
        <ProductSlider products={trending} autoPlay />
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const storefront = useStorefrontData();
  const section = useHomeSection(storefront, 'testimonials', {
    title: 'Loved by customers',
    subtitle: 'Real reviews from our community',
  });
  const testimonials = storefront?.testimonials?.length ? storefront.testimonials : [];
  if (!section.active || !testimonials.length) return null;
  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-900/50 lg:py-24">
      <div className="container-store">
        <SectionHeader title={section.title} subtitle={section.subtitle} />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8"
            >
              <Quote className="h-8 w-8 text-brand-400/50" />
              <p className="mt-4 text-slate-600 dark:text-zinc-300">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                {t.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
