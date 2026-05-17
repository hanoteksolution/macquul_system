import { cn } from '../../lib/cn';

const variants = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200/80 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10',
  success: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300',
  warning: 'bg-amber-500/15 text-amber-700 ring-amber-500/25 dark:text-amber-300',
  error: 'bg-red-500/15 text-red-700 ring-red-500/25 dark:text-red-300',
  info: 'bg-brand-500/15 text-brand-700 ring-brand-500/25 dark:text-brand-300',
  processing: 'bg-cyan-500/15 text-cyan-700 ring-cyan-500/25 dark:text-cyan-300',
};

export function Badge({ className, variant = 'default', children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}
