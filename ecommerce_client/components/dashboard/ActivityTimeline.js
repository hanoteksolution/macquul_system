import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const TYPE_CONFIG = {
  purchase: { icon: ShoppingBagIcon, color: 'bg-blue-500/15 text-blue-600 ring-blue-500/25' },
  download: { icon: ArrowDownTrayIcon, color: 'bg-emerald-500/15 text-emerald-600 ring-emerald-500/25' },
  wishlist: { icon: HeartIcon, color: 'bg-rose-500/15 text-rose-600 ring-rose-500/25' },
  payment: { icon: CreditCardIcon, color: 'bg-violet-500/15 text-violet-600 ring-violet-500/25' },
};

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <section className="dashboard-card p-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity yet.</p>
        <p className="mt-1 text-xs text-gray-400">Your purchases and updates will appear here.</p>
      </section>
    );
  }

  return (
    <section className="dashboard-card p-6">
      <header className="mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Activity</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Recent account events</p>
      </header>
      <ol className="relative space-y-0">
        {activities.map((item, i) => {
          const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.purchase;
          const Icon = config.icon;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {i < activities.length - 1 && (
                <span className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-emerald-500/40 to-transparent" />
              )}
              <span
                className={clsx(
                  'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1',
                  config.color
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <p className="font-medium text-navy-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                <p className="mt-1 text-xs text-gray-400">{formatTime(item.time)}</p>
              </span>
              {item.amount != null && (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ${Number(item.amount).toFixed(2)}
                </span>
              )}
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
