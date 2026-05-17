'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ModalIcon, { inferModalVariant, type ModalIconVariant } from '@/components/ui/modal-icon';
import { cn } from '@/lib/utils';

export interface PremiumConfirmState {
  message: string;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
  variant?: ModalIconVariant;
  subtitle?: string;
}

interface PremiumConfirmDialogProps {
  state: PremiumConfirmState | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DEFAULT_SUBTITLES: Partial<Record<ModalIconVariant, string>> = {
  logout: 'You will be signed out of this session. Sign in again anytime to continue.',
  danger: 'This action cannot be undone. Please confirm you want to proceed.',
  warning: 'Review the details below before continuing.',
};

export default function PremiumConfirmDialog({ state, onConfirm, onCancel }: PremiumConfirmDialogProps) {
  const open = !!state;
  const variant = state
    ? inferModalVariant({
        variant: state.variant,
        destructive: state.destructive,
        title: state.title,
        confirmLabel: state.confirmLabel,
      })
    : 'default';

  const subtitle =
    state?.subtitle ||
    DEFAULT_SUBTITLES[variant] ||
    (state?.destructive ? DEFAULT_SUBTITLES.warning : undefined);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      {state && (
        <AlertDialogContent className="overflow-hidden p-0" onEscapeKeyDown={onCancel}>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 12, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              <AlertDialogHeader className="items-center pb-2">
                <ModalIcon variant={variant} />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  <AlertDialogTitle>{state.title}</AlertDialogTitle>
                  {subtitle && (
                    <AlertDialogDescription className="mx-auto max-w-sm text-base">
                      {subtitle}
                    </AlertDialogDescription>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-zinc-500">
                    {state.message}
                  </p>
                </motion.div>
              </AlertDialogHeader>

              <AlertDialogFooter className="max-sm:flex-col">
                <AlertDialogCancel
                  onClick={onCancel}
                  className={cn(
                    'mt-0 h-12 w-full rounded-2xl border border-slate-200/90 bg-white/80 px-6 text-sm font-semibold text-slate-700',
                    'backdrop-blur-md transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm',
                    'focus-visible:ring-2 focus-visible:ring-brand-500/40',
                    'dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10',
                    'sm:w-auto sm:min-w-[7.5rem]'
                  )}
                >
                  {state.cancelLabel}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onConfirm}
                  className={cn(
                    'h-12 w-full rounded-2xl px-6 text-sm font-semibold text-white shadow-lg transition-all',
                    'hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0',
                    'focus-visible:ring-2 focus-visible:ring-offset-2',
                    'sm:w-auto sm:min-w-[7.5rem]',
                    state.destructive || variant === 'logout' || variant === 'danger'
                      ? cn(
                          'bg-gradient-to-r from-rose-600 via-red-600 to-rose-500',
                          'shadow-[0_8px_28px_-6px_rgba(244,63,94,0.55)] hover:brightness-110',
                          'focus-visible:ring-rose-500/50',
                          variant === 'logout' && 'animate-pulse hover:animate-none'
                        )
                      : cn(
                          'bg-gradient-to-r from-brand-600 via-violet-600 to-brand-500',
                          'shadow-[0_8px_28px_-6px_rgba(99,102,241,0.45)] hover:brightness-110',
                          'focus-visible:ring-brand-500/50'
                        )
                  )}
                >
                  {state.confirmLabel}
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
