import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AuthButton({
  children,
  loading,
  variant = 'primary',
  className,
  type = 'button',
  ...props
}) {
  const variants = {
    primary:
      'bg-gradient-brand text-white shadow-glow-sm hover:shadow-glow hover:brightness-110 border-0',
    outline:
      'bg-white/60 dark:bg-gray-900/40 backdrop-blur border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: loading ? 1 : 1.01 }}
      whileTap={{ scale: loading ? 1 : 0.99 }}
      disabled={loading || props.disabled}
      className={cn(
        'relative w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5',
        'text-sm font-semibold tracking-tight transition-all duration-300',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </motion.button>
  );
}
