'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RotateCcw, SlidersHorizontal, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';
import type { ShopFilterState } from './types';
import { Button } from '@/components/ui/button';

interface ShopFiltersProps {
  categories: Category[];
  categoryId?: string;
  filters: ShopFilterState;
  priceBounds: { min: number; max: number };
  activeTags: { key: string; label: string }[];
  onCategory: (id: string | null) => void;
  onChange: (patch: Partial<ShopFilterState>) => void;
  onReset: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200/80 py-4 last:border-0 dark:border-zinc-700/80">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-900 dark:text-white"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPanelContent({
  categories,
  categoryId,
  filters,
  priceBounds,
  activeTags,
  onCategory,
  onChange,
  onReset,
}: Omit<ShopFiltersProps, 'mobileOpen' | 'onMobileClose' | 'className'>) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold">
          <SlidersHorizontal className="h-5 w-5 text-brand-500" />
          Filters
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onReset} className="text-slate-500">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {activeTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2">
        <FilterGroup title="Category">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onCategory(null)}
              className={cn(
                'rounded-xl px-3 py-2.5 text-left text-sm transition',
                !categoryId
                  ? 'bg-gradient-to-r from-brand-600 to-violet-600 font-semibold text-white shadow-glow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
              )}
            >
              All products
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onCategory(String(c.id))}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-left text-sm transition',
                  String(categoryId) === String(c.id)
                    ? 'bg-gradient-to-r from-brand-600 to-violet-600 font-semibold text-white shadow-glow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
                )}
              >
                {c.name}
                <span className="ml-2 text-xs opacity-70">({c.product_count ?? 0})</span>
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Price range">
          <div className="space-y-4">
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={1}
              value={filters.priceMax}
              onChange={(e) => onChange({ priceMax: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600 dark:bg-zinc-700"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>${priceBounds.min}</span>
              <span className="font-semibold text-brand-600">Up to ${filters.priceMax}</span>
              <span>${priceBounds.max}</span>
            </div>
          </div>
        </FilterGroup>

        <FilterGroup title="Rating">
          <div className="flex flex-col gap-2">
            {[4, 3, 0].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onChange({ minRating: r })}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                  filters.minRating === r && 'bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-800'
                )}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < (r || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-zinc-600'
                    )}
                  />
                ))}
                <span className="text-slate-600 dark:text-zinc-400">{r ? `${r}+ stars` : 'Any rating'}</span>
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Availability">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 p-3 transition hover:border-brand-300 dark:border-zinc-700">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onChange({ inStockOnly: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium">In stock only</span>
          </label>
        </FilterGroup>
      </div>
    </>
  );
}

export default function ShopFilters(props: ShopFiltersProps) {
  const { mobileOpen, onMobileClose, className, ...content } = props;

  const panel = (
    <div
      className={cn(
        'rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glass-lg backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/80',
        className
      )}
    >
      <FilterPanelContent {...content} />
    </div>
  );

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 lg:block">
        <div className="sticky top-28">{panel}</div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
              aria-label="Close filters"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-[min(100%,320px)] overflow-y-auto border-r border-slate-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 lg:hidden"
            >
              <button
                type="button"
                onClick={onMobileClose}
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
              <FilterPanelContent {...content} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
