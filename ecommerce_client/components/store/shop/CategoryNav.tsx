'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

interface CategoryNavProps {
  categories: Category[];
  activeId?: string;
}

export default function CategoryNav({ categories, activeId }: CategoryNavProps) {
  return (
    <section className="border-b border-slate-200/80 bg-white/60 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="container-store flex gap-2 overflow-x-auto py-4 scrollbar-hide">
        <Link
          href="/shop"
          className={cn(
            'shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition',
            !activeId
              ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300'
          )}
        >
          All
        </Link>
        {categories.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Link
              href={`/shop?category=${c.id}`}
              className={cn(
                'block shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition',
                String(activeId) === String(c.id)
                  ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300'
              )}
            >
              {c.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
