
import { motion } from 'framer-motion';
import { SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { getGreeting } from '../../lib/dashboardUtils';

export default function WelcomeHero({ user, stats }) {
  const name = user?.first_name || user?.username || 'there';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-navy-800 via-navy-900 to-emerald-900 p-6 sm:p-8 shadow-glass-lg"
    >
      <div className="absolute inset-0 bg-dashboard-mesh opacity-60" />
      <motion.div
        className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-primary-400/15 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <motion.div className="max-w-xl">
          <motion.span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            <SparklesIcon className="h-3.5 w-3.5" />
            Premium Member
          </motion.span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {getGreeting()}, {name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Your marketplace hub is ready. Track orders, downloads, and rewards in one elegant workspace.
          </p>
          <motion.div className="mt-5 flex flex-wrap gap-4 text-sm">
            <motion.span className="flex items-center gap-2 text-white/90">
              <ChartBarIcon className="h-4 w-4 text-emerald-300" />
              <strong className="font-semibold">{stats.totalOrders}</strong> orders lifetime
            </motion.span>
            <motion.span className="text-white/40">|</motion.span>
            <motion.span className="text-emerald-200">
              <strong className="font-semibold text-white">{stats.rewardPoints}</strong> reward points
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div className="hidden sm:flex items-center justify-center">
          <motion.div className="relative h-36 w-36 rounded-3xl border border-white/20 bg-white/5 p-4 backdrop-blur-xl">
            <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <rect x="15" y="25" width="90" height="70" rx="12" fill="url(#heroGrad)" opacity="0.9" />
              <rect x="25" y="40" width="50" height="6" rx="3" fill="white" opacity="0.9" />
              <rect x="25" y="52" width="70" height="4" rx="2" fill="white" opacity="0.5" />
              <rect x="25" y="62" width="55" height="4" rx="2" fill="white" opacity="0.5" />
              <circle cx="85" cy="75" r="18" fill="#0c1628" opacity="0.4" />
              <path d="M78 75 L83 80 L92 68" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
