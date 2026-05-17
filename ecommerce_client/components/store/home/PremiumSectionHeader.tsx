'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PremiumSectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  href?: string;
  ctaLabel?: string;
  className?: string;
  dark?: boolean;
}

export default function PremiumSectionHeader({
  badge = 'Collections',
  title,
  subtitle,
  href,
  ctaLabel = 'Browse all',
  className,
  dark = false,
}: PremiumSectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn('relative mb-14 lg:mb-16', className)}
    >
      <motion.span
        className="absolute -left-4 top-8 hidden h-px w-24 bg-gradient-to-r from-brand-500 to-transparent lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      />

      <motion.div
        className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md',
              dark
                ? 'border-white/20 bg-white/10 text-white/90'
                : 'border-brand-200/80 bg-brand-50/80 text-brand-700 dark:border-brand-500/40 dark:bg-brand-950/40 dark:text-brand-300'
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </motion.span>
          <h2
            className={cn(
              'mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]',
              dark ? 'text-white' : 'text-slate-900 dark:text-white'
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                'mt-4 text-base leading-relaxed sm:text-lg',
                dark ? 'text-white/60' : 'text-slate-600 dark:text-zinc-400'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {href && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Button
              asChild
              size="lg"
              className={cn(
                'group h-12 shrink-0 rounded-full px-8 shadow-glow-sm transition-all hover:shadow-glow',
                dark
                  ? 'bg-white text-slate-900 hover:bg-zinc-100'
                  : 'bg-gradient-to-r from-brand-600 via-violet-600 to-brand-500 text-white border-0'
              )}
            >
              <Link href={href}>
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.header>
  );
}
