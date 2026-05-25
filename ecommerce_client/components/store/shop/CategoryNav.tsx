'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildCategoryTree } from '@/lib/category-utils';
import type { Category } from '@/lib/types';

interface CategoryNavProps {
  categories: Category[];
  activeId?: string;
}

export default function CategoryNav({ categories, activeId }: CategoryNavProps) {
  const tree = buildCategoryTree(categories);
  const activeParentId = activeId
    ? categories.find((c) => String(c.id) === String(activeId))?.parent_id
    : null;

  const activeParent = activeParentId
    ? tree.find((p) => String(p.id) === String(activeParentId))
    : activeId
      ? tree.find((p) => String(p.id) === String(activeId))
      : null;

  const subcategoriesToShow =
    activeParent?.children?.length
      ? activeParent.children
      : tree.flatMap((p) => p.children || []);

  return (
    <section className="border-b border-slate-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-store space-y-3 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          <Link
            href="/shop"
            className={cn(
              'shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition',
              !activeId
                ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300'
            )}
          >
            All
          </Link>
          {tree.map((parent, i) => {
            const isParentActive =
              String(activeId) === String(parent.id) ||
              String(activeParentId) === String(parent.id);
            return (
              <motion.div
                key={parent.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/shop?category=${parent.id}`}
                  className={cn(
                    'block shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition',
                    isParentActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300'
                  )}
                >
                  {parent.icon && <span className="mr-1.5">{parent.icon}</span>}
                  {parent.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {subcategoriesToShow.length > 0 && (
          <div className="border-t border-slate-100 pt-3 dark:border-zinc-800">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              {activeParent ? `${activeParent.name} subcategories` : 'Subcategories'}
            </p>
            <motion.div className="flex flex-wrap gap-2">
              {subcategoriesToShow.map((sub) => {
                const parent =
                  activeParent ||
                  tree.find((p) => p.children?.some((c) => c.id === sub.id));
                const isActive = String(activeId) === String(sub.id);
                return (
                  <Link
                    key={sub.id}
                    href={`/shop?category=${sub.id}`}
                    className={cn(
                      'group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition',
                      isActive
                        ? 'border-brand-500 bg-brand-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-brand-700 dark:hover:bg-brand-950/50'
                    )}
                  >
                    {sub.icon && <span className="text-base leading-none">{sub.icon}</span>}
                    <span>
                      {!activeParent && parent && (
                        <span className={cn('mr-1', isActive ? 'text-white/70' : 'text-slate-400')}>
                          {parent.name} ·
                        </span>
                      )}
                      {sub.name}
                    </span>
                    <ChevronRight
                      className={cn(
                        'h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100',
                        isActive ? 'text-white/80 opacity-100' : 'text-brand-500'
                      )}
                    />
                  </Link>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
