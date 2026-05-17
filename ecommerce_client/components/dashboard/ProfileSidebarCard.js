import { motion } from 'framer-motion';
import { PencilSquareIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function ProfileSidebarCard({ user, stats, onEditProfile }) {
  const initials = (user?.username || user?.email || 'U').slice(0, 2).toUpperCase();
  const progress = Math.min(100, Math.round((stats.rewardPoints / 500) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card overflow-hidden p-6"
    >
      <motion.div className="flex flex-col items-center text-center">
        <motion.span className="relative">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-glow-sm ring-4 ring-white dark:ring-navy-800">
            {initials}
          </span>
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-navy-800 text-emerald-300 ring-2 ring-white dark:ring-navy-900">
            <ShieldCheckIcon className="h-4 w-4" />
          </span>
        </motion.span>

        <h3 className="mt-4 text-lg font-bold text-navy-900 dark:text-white">{user?.username}</h3>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 truncate max-w-full">{user?.email}</p>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 to-navy-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/25">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Premium Member
        </span>

        <span className="mt-4 w-full">
          <span className="mb-2 flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span>Account progress</span>
            <span>{progress}%</span>
          </span>
          <span className="block h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="block h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
          </span>
          <span className="mt-1 block text-xs text-gray-400">Next tier at 500 points</span>
        </span>

        <button
          type="button"
          onClick={onEditProfile}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Edit profile
        </button>
      </motion.div>
    </motion.section>
  );
}
