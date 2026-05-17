'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  LogOut,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModalIconVariant = 'default' | 'danger' | 'warning' | 'success' | 'info' | 'logout';

const VARIANT_CONFIG: Record<
  ModalIconVariant,
  { icon: LucideIcon; ring: string; glow: string; iconClass: string }
> = {
  default: {
    icon: Info,
    ring: 'from-brand-500/30 via-violet-500/20 to-cyan-500/30',
    glow: 'shadow-[0_0_40px_-8px_rgba(99,102,241,0.55)]',
    iconClass: 'text-brand-600 dark:text-brand-400',
  },
  info: {
    icon: Info,
    ring: 'from-brand-500/30 via-violet-500/20 to-cyan-500/30',
    glow: 'shadow-[0_0_40px_-8px_rgba(99,102,241,0.55)]',
    iconClass: 'text-brand-600 dark:text-brand-400',
  },
  warning: {
    icon: AlertTriangle,
    ring: 'from-amber-500/35 via-orange-500/20 to-yellow-500/25',
    glow: 'shadow-[0_0_40px_-8px_rgba(245,158,11,0.5)]',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    icon: Trash2,
    ring: 'from-rose-500/35 via-red-500/25 to-orange-500/20',
    glow: 'shadow-[0_0_44px_-8px_rgba(244,63,94,0.55)]',
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
  success: {
    icon: CheckCircle2,
    ring: 'from-emerald-500/35 via-teal-500/20 to-cyan-500/25',
    glow: 'shadow-[0_0_40px_-8px_rgba(16,185,129,0.5)]',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  logout: {
    icon: LogOut,
    ring: 'from-rose-500/35 via-fuchsia-500/20 to-violet-500/25',
    glow: 'shadow-[0_0_44px_-8px_rgba(244,63,94,0.5)]',
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
};

interface ModalIconProps {
  variant?: ModalIconVariant;
  className?: string;
}

export default function ModalIcon({ variant = 'default', className }: ModalIconProps) {
  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.default;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26, delay: 0.05 }}
      className={cn('relative mx-auto mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center', className)}
    >
      <motion.span
        className={cn('absolute inset-0 rounded-[1.35rem] bg-gradient-to-br opacity-80', config.ring)}
        animate={{ scale: [1, 1.06, 1], opacity: [0.65, 0.9, 0.65] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
      <span
        className={cn(
          'relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] border border-white/60 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90',
          config.glow
        )}
      >
        <motion.span
          animate={variant === 'logout' ? { x: [0, 2, 0] } : undefined}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Icon className={cn('h-8 w-8', config.iconClass)} strokeWidth={1.75} aria-hidden />
        </motion.span>
      </span>
    </motion.div>
  );
}

export function inferModalVariant(options: {
  destructive?: boolean;
  title?: string;
  confirmLabel?: string;
  variant?: ModalIconVariant;
}): ModalIconVariant {
  if (options.variant) return options.variant;
  const text = `${options.title || ''} ${options.confirmLabel || ''}`.toLowerCase();
  if (options.destructive && /sign out|log out|logout/.test(text)) return 'logout';
  if (options.destructive && /delete|remove/.test(text)) return 'danger';
  if (options.destructive) return 'warning';
  if (/success|saved|complete/.test(text)) return 'success';
  return 'default';
}
