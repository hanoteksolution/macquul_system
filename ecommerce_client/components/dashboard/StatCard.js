import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export default function StatCard({ label, value, icon: Icon, trend, trendUp = true, accent = 'emerald', delay = 0 }) {
  const accents = {
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-600 dark:text-amber-400 ring-amber-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-600 dark:text-blue-400 ring-blue-500/20',
    violet: 'from-violet-500/20 to-violet-600/5 text-violet-600 dark:text-violet-400 ring-violet-500/20',
    navy: 'from-navy-500/20 to-navy-600/5 text-navy-600 dark:text-navy-300 ring-navy-500/20',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-600 dark:text-rose-400 ring-rose-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-gradient-border group"
    >
      <div className="dashboard-card h-full p-5 group-hover:shadow-glow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
              {value}
            </p>
            {trend != null && (
              <div className={clsx(
                'mt-2 inline-flex items-center gap-1 text-xs font-medium',
                trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
              )}>
                {trendUp ? (
                  <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                ) : (
                  <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
                )}
                {trend}
              </div>
            )}
          </div>
          <div className={clsx(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 backdrop-blur-sm',
            accents[accent] || accents.emerald
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

