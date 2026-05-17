import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';

const accents = {
  indigo: {
    icon: 'from-brand-500/20 to-brand-600/5 text-brand-600 ring-brand-500/20 dark:text-brand-400',
    bar: 'from-brand-500 via-violet-500 to-indigo-400',
    glow: 'from-brand-500/8 via-violet-500/5 to-transparent',
  },
  emerald: {
    icon: 'from-emerald-500/20 to-emerald-600/5 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
    bar: 'from-emerald-400 via-teal-400 to-emerald-500',
    glow: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  },
  violet: {
    icon: 'from-violet-500/20 to-violet-600/5 text-violet-600 ring-violet-500/20 dark:text-violet-400',
    bar: 'from-violet-500 via-purple-500 to-fuchsia-400',
    glow: 'from-violet-500/10 via-purple-500/5 to-transparent',
  },
  cyan: {
    icon: 'from-cyan-500/20 to-cyan-600/5 text-cyan-600 ring-cyan-500/20 dark:text-cyan-400',
    bar: 'from-cyan-400 via-sky-400 to-blue-400',
    glow: 'from-cyan-500/10 via-sky-500/5 to-transparent',
  },
  amber: {
    icon: 'from-amber-500/20 to-amber-600/5 text-amber-600 ring-amber-500/20 dark:text-amber-400',
    bar: 'from-amber-400 via-orange-400 to-amber-500',
    glow: 'from-amber-500/10 via-orange-500/5 to-transparent',
  },
  rose: {
    icon: 'from-rose-500/20 to-rose-600/5 text-rose-600 ring-rose-500/20 dark:text-rose-400',
    bar: 'from-rose-400 via-pink-400 to-rose-500',
    glow: 'from-rose-500/10 via-pink-500/5 to-transparent',
  },
};

function AnimatedValue({ numericValue, formatValue, value, animate = true }) {
  const animated = useAnimatedNumber(numericValue, { enabled: animate && numericValue != null });
  const display =
    numericValue != null
      ? (formatValue ? formatValue(animated) : String(Math.round(animated)))
      : value;

  return (
    <motion.p
      key={numericValue != null ? String(numericValue) : value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white"
    >
      {display}
    </motion.p>
  );
}

export default function MetricCard({
  label,
  value,
  numericValue,
  formatValue,
  subtitle,
  trend,
  trendUp = true,
  icon: Icon,
  accent = 'indigo',
  delay = 0,
  animate = true,
}) {
  const theme = accents[accent] || accents.indigo;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.94 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 320, damping: 26, delay },
        },
      }}
      whileHover={{ y: -6 }}
      className="metric-card group relative overflow-hidden"
    >
      <motion.span
        className={cn('absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r', theme.bar)}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      <span
        className={cn(
          'pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100',
          theme.glow
        )}
        aria-hidden
      />

      <div className="metric-card-inner relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: delay + 0.05 }}
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              {label}
            </motion.p>
            <AnimatedValue
              numericValue={numericValue}
              formatValue={formatValue}
              value={value}
              animate={animate}
            />
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: delay + 0.25 }}
                className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 18,
              delay: delay + 0.12,
            }}
            whileHover={{ scale: 1.1, rotate: 6 }}
            className={cn(
              'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1',
              theme.icon
            )}
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay * 0.5,
              }}
              className="flex items-center justify-center"
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </motion.span>
          </motion.div>
        </div>

        {trend && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3 }}
            className={cn(
              'mt-4 inline-flex items-center gap-1 text-xs font-semibold',
              trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
            )}
          >
            {trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trend}
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}
