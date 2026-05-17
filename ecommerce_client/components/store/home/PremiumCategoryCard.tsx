'use client';

import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

export interface CategoryTheme {
  gradient: string;
  glow: string;
  accent: string;
  mesh: string;
}

export const CATEGORY_THEMES: CategoryTheme[] = [
  {
    gradient: 'from-indigo-500 via-violet-600 to-slate-950',
    glow: 'shadow-[0_0_60px_-12px_rgba(99,102,241,0.55)]',
    accent: 'from-indigo-400/40 to-violet-600/20',
    mesh: 'bg-[radial-gradient(circle_at_30%_20%,rgba(129,140,248,0.45),transparent_50%)]',
  },
  {
    gradient: 'from-rose-500 via-fuchsia-600 to-slate-950',
    glow: 'shadow-[0_0_60px_-12px_rgba(244,63,94,0.5)]',
    accent: 'from-rose-400/40 to-fuchsia-600/20',
    mesh: 'bg-[radial-gradient(circle_at_70%_30%,rgba(251,113,133,0.4),transparent_55%)]',
  },
  {
    gradient: 'from-cyan-400 via-blue-600 to-slate-950',
    glow: 'shadow-[0_0_60px_-12px_rgba(6,182,212,0.45)]',
    accent: 'from-cyan-400/35 to-blue-600/20',
    mesh: 'bg-[radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.35),transparent_50%)]',
  },
  {
    gradient: 'from-amber-400 via-orange-600 to-slate-950',
    glow: 'shadow-[0_0_60px_-12px_rgba(245,158,11,0.45)]',
    accent: 'from-amber-400/35 to-orange-600/20',
    mesh: 'bg-[radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.35),transparent_50%)]',
  },
];

interface PremiumCategoryCardProps {
  category: Category;
  theme: CategoryTheme;
  variant?: 'hero' | 'tall' | 'wide' | 'compact';
  index?: number;
}

export default function PremiumCategoryCard({
  category,
  theme,
  variant = 'compact',
  index = 0,
}: PremiumCategoryCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 30 });
  const sy = useSpring(my, { stiffness: 300, damping: 30 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, rgba(255,255,255,0.14), transparent 55%)`;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const heights = {
    hero: 'min-h-[520px] lg:min-h-[580px]',
    tall: 'min-h-[300px] sm:min-h-[340px]',
    wide: 'min-h-[220px] sm:min-h-[260px]',
    compact: 'min-h-[280px] sm:aspect-[4/5] sm:min-h-0',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        ref={ref}
        href={`/shop?category=${category.id}`}
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className={cn(
          'group relative flex w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950 ring-1 ring-white/10 transition-all duration-500',
          heights[variant],
          'hover:-translate-y-2 hover:ring-white/25',
          theme.glow
        )}
      >
        {category.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image_url}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.08]"
          />
        ) : (
          <div className={cn('absolute inset-0 bg-gradient-to-br', theme.gradient)} />
        )}

        <motion.div className={cn('absolute inset-0 opacity-80 mix-blend-soft-light', theme.mesh)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60', theme.accent)} />

        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlight }}
        />

        {/* floating particles */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/40"
            style={{ left: `${20 + i * 25}%`, top: `${15 + i * 20}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        <div className="relative z-10 mt-auto flex w-full flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-200" />
              {category.product_count ?? 0} pieces
            </span>
            <motion.span
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md"
              whileHover={{ scale: 1.08, rotate: 45 }}
            >
              <ArrowUpRight className="h-5 w-5" />
            </motion.span>
          </div>

          <h3
            className={cn(
              'mt-5 font-display font-bold tracking-tight text-white',
              variant === 'hero' ? 'text-4xl sm:text-5xl' : variant === 'wide' ? 'text-2xl sm:text-3xl' : 'text-2xl sm:text-[1.75rem]'
            )}
          >
            {category.name}
          </h3>
          {(variant === 'hero' || variant === 'wide') && category.description && (
            <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              {category.description}
            </p>
          )}
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
            Explore
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
