import { motion } from 'framer-motion';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const styles = {
  info: {
    wrap: 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-200/60 dark:border-primary-800/50 text-primary-900 dark:text-primary-100',
    icon: Info,
  },
  error: {
    wrap: 'bg-red-50/80 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/50 text-red-800 dark:text-red-200',
    icon: AlertCircle,
  },
  success: {
    wrap: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-100',
    icon: CheckCircle2,
  },
};

export default function AuthAlert({ variant = 'info', children, className }) {
  const config = styles[variant] || styles.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3 text-sm backdrop-blur-sm',
        config.wrap,
        className
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
      <div className="leading-relaxed">{children}</div>
    </motion.div>
  );
}
