'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  LogOut,
  Trash2,
} from 'lucide-react';

const VARIANTS = {
  default: { Icon: Info, ring: 'from-brand-500/30 via-violet-500/20 to-cyan-500/30', icon: 'text-brand-600 dark:text-brand-400' },
  info: { Icon: Info, ring: 'from-brand-500/30 via-violet-500/20 to-cyan-500/30', icon: 'text-brand-600 dark:text-brand-400' },
  warning: { Icon: AlertTriangle, ring: 'from-amber-500/35 via-orange-500/20 to-yellow-500/25', icon: 'text-amber-600 dark:text-amber-400' },
  danger: { Icon: Trash2, ring: 'from-rose-500/35 via-red-500/25 to-orange-500/20', icon: 'text-rose-600 dark:text-rose-400' },
  success: { Icon: CheckCircle2, ring: 'from-emerald-500/35 via-teal-500/20 to-cyan-500/25', icon: 'text-emerald-600 dark:text-emerald-400' },
  logout: { Icon: LogOut, ring: 'from-rose-500/35 via-fuchsia-500/20 to-violet-500/25', icon: 'text-rose-600 dark:text-rose-400' },
};

const SUBTITLES = {
  logout: 'You will be signed out of this session. Sign in again anytime to continue.',
  danger: 'This action cannot be undone. Please confirm you want to proceed.',
  warning: 'Review the details below before continuing.',
};

function inferVariant(state) {
  if (state.variant) return state.variant;
  const text = `${state.title || ''} ${state.confirmLabel || ''}`.toLowerCase();
  if (state.destructive && /sign out|log out|logout/.test(text)) return 'logout';
  if (state.destructive && /delete|remove/.test(text)) return 'danger';
  if (state.destructive) return 'warning';
  return 'default';
}

function ModalIconDisplay({ variant }) {
  const config = VARIANTS[variant] || VARIANTS.default;
  const Icon = config.Icon;

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className="relative mx-auto mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center"
    >
      <motion.span
        className={clsx('absolute inset-0 rounded-[1.35rem] bg-gradient-to-br opacity-80', config.ring)}
        animate={{ scale: [1, 1.06, 1], opacity: [0.65, 0.9, 0.65] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        aria-hidden
      />
      <span className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] border border-white/60 bg-white/90 shadow-[0_0_40px_-8px_rgba(99,102,241,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90">
        <Icon className={clsx('h-8 w-8', config.icon)} strokeWidth={1.75} />
      </span>
    </motion.div>
  );
}

export default function PremiumConfirmDialog({ state, onConfirm, onCancel }) {
  useEffect(() => {
    if (!state) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [state, onCancel]);

  if (typeof document === 'undefined') return null;

  const variant = state ? inferVariant(state) : 'default';
  const subtitle = state?.subtitle || SUBTITLES[variant] || (state?.destructive ? SUBTITLES.warning : null);
  const isDanger = state?.destructive || variant === 'logout' || variant === 'danger';

  return createPortal(
    <AnimatePresence>
      {state && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
            aria-label="Close dialog"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="premium-confirm-title"
            aria-describedby="premium-confirm-desc"
            initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={clsx(
              'relative z-10 w-full max-w-md overflow-hidden',
              'rounded-t-[2rem] border border-white/25 bg-white/95 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.35)]',
              'backdrop-blur-2xl ring-1 ring-white/20 dark:border-white/10 dark:bg-zinc-950/95 dark:ring-white/5',
              'sm:rounded-[1.75rem]'
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_55%)]" aria-hidden />

            <div className="relative px-8 pb-2 pt-10 text-center sm:px-10 sm:pt-10">
              <ModalIconDisplay variant={variant} />
              <h2 id="premium-confirm-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {state.title}
              </h2>
              {subtitle && (
                <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-zinc-400">{subtitle}</p>
              )}
              <p id="premium-confirm-desc" className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-zinc-500">
                {state.message}
              </p>
            </div>

            <div className="relative mt-6 flex flex-col-reverse gap-3 border-t border-slate-200/80 bg-slate-50/50 px-6 py-5 dark:border-white/5 dark:bg-white/[0.02] sm:flex-row sm:justify-end sm:px-8 sm:py-6">
              <button
                type="button"
                onClick={onCancel}
                className="h-12 w-full rounded-2xl border border-slate-200/90 bg-white/80 px-6 text-sm font-semibold text-slate-700 backdrop-blur-md transition hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:w-auto sm:min-w-[7.5rem]"
              >
                {state.cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={clsx(
                  'h-12 w-full rounded-2xl px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:w-auto sm:min-w-[7.5rem]',
                  isDanger
                    ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-500 shadow-[0_8px_28px_-6px_rgba(244,63,94,0.55)] hover:brightness-110'
                    : 'bg-gradient-to-r from-brand-600 via-violet-600 to-brand-500 shadow-[0_8px_28px_-6px_rgba(99,102,241,0.45)] hover:brightness-110'
                )}
              >
                {state.confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
