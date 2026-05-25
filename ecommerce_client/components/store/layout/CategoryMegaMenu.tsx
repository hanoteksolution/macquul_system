'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, LayoutGrid, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/lib/types';
import { getCategoryMatchIds } from '@/lib/category-utils';

interface CategoryMegaMenuProps {
  category: Category;
  categories: Category[];
  products: Product[];
  onNavigate?: () => void;
}

function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  if (category.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={category.image_url} alt="" className={cn('rounded-xl object-cover', className)} />
    );
  }
  if (category.icon) {
    return (
      <span
        className={cn(
          'flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-violet-500/15 text-2xl',
          className
        )}
      >
        {category.icon}
      </span>
    );
  }
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-bold text-slate-600 dark:from-zinc-800 dark:to-zinc-700 dark:text-zinc-300',
        className
      )}
    >
      {category.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export default function CategoryMegaMenu({
  category,
  categories,
  products,
  onNavigate,
}: CategoryMegaMenuProps) {
  const matchIds = getCategoryMatchIds(category.id, categories);
  const featured = products
    .filter((p) => p.category?.id != null && matchIds?.has(String(p.category.id)))
    .slice(0, 3);

  const children = category.children || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 right-0 top-full z-50 border-t border-slate-200/80 bg-white shadow-[0_24px_64px_-12px_rgba(15,23,42,0.18)] dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="absolute inset-x-0 -top-3 h-3" aria-hidden />

      <div className="container-store py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-brand-50/30 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-brand-950/20">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl"
                aria-hidden
              />
              <div className="flex items-start gap-4">
                <CategoryIcon
                  category={category}
                  className="h-14 w-14 shrink-0 shadow-sm ring-2 ring-white dark:ring-zinc-800"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                    Department
                  </p>
                  <h3 className="mt-0.5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
              {category.description && (
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  {category.description}
                </p>
              )}
              <Link
                href={`/shop?category=${category.id}`}
                onClick={onNavigate}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:brightness-110 hover:shadow-xl"
              >
                <LayoutGrid className="h-4 w-4" />
                Shop all {category.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-4 xl:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Browse by type</h4>
              <span className="text-xs text-slate-500 dark:text-zinc-500">
                {children.length} subcategories
              </span>
            </div>
            {children.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {children.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/shop?category=${sub.id}`}
                      onClick={onNavigate}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5',
                        'transition-all duration-200 hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-md hover:shadow-brand-500/10',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                        'dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-brand-700/50 dark:hover:bg-brand-950/40'
                      )}
                    >
                      <CategoryIcon
                        category={sub}
                        className="h-11 w-11 shrink-0 text-lg transition group-hover:scale-105"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                          {sub.name}
                        </span>
                        {(sub.product_count ?? 0) > 0 && (
                          <span className="mt-0.5 block text-xs text-slate-500 dark:text-zinc-500">
                            {sub.product_count} product{sub.product_count === 1 ? '' : 's'}
                          </span>
                        )}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-zinc-600 dark:group-hover:text-brand-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
                No subcategories yet. Browse all {category.name} products.
              </p>
            )}
          </div>

          <div className="lg:col-span-4 xl:col-span-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Popular picks</h4>
            </div>
            {featured.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {featured.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.id}`}
                      onClick={onNavigate}
                      className="group block overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/50 transition hover:border-brand-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-brand-800/50"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-white dark:bg-zinc-900">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-300">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {p.name}
                        </p>
                        {p.category?.name && (
                          <p className="mt-0.5 text-xs text-brand-600 dark:text-brand-400">
                            {p.category.name}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-zinc-700">
                No products in this category yet.
              </p>
            )}
            <Link
              href={`/shop?category=${category.id}`}
              onClick={onNavigate}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View all in {category.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
