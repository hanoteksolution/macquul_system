'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, List, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import type { ShopSort, ShopView } from './types';

interface ShopToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: ShopSort;
  onSortChange: (v: ShopSort) => void;
  view: ShopView;
  onViewChange: (v: ShopView) => void;
  resultCount: number;
  suggestions?: string[];
  onOpenFilters?: () => void;
  sticky?: boolean;
}

export default function ShopToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
  suggestions = [],
  onOpenFilters,
  sticky = true,
}: ShopToolbarProps) {
  const showSuggestions = search.trim().length > 1 && suggestions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'z-30 mb-8 rounded-2xl border border-white/50 bg-white/75 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75',
        sticky && 'lg:sticky lg:top-24'
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands..."
            className="h-12 rounded-2xl border-slate-200/80 bg-white/90 pl-11 shadow-sm transition focus:shadow-glow-sm dark:border-zinc-700 dark:bg-zinc-950/90"
          />
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-glass-lg dark:border-zinc-700 dark:bg-zinc-900"
            >
              {suggestions.slice(0, 5).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSearchChange(s)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold lg:hidden dark:border-zinc-700 dark:bg-zinc-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ShopSort)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>

          <div className="flex rounded-2xl border border-slate-200 p-1 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              className={cn(
                'rounded-xl p-2.5 transition',
                view === 'grid' && 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              className={cn(
                'rounded-xl p-2.5 transition',
                view === 'list' && 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-slate-200/60 pt-3 text-sm dark:border-zinc-700/60">
        <Sparkles className="h-4 w-4 text-brand-500" />
        <span className="text-slate-600 dark:text-zinc-400">
          <span className="font-semibold text-slate-900 dark:text-white">{resultCount}</span> products found
        </span>
      </div>
    </motion.div>
  );
}
