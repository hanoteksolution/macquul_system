import { motion } from 'framer-motion';
import { RefreshCw, DollarSign, Package, AlertTriangle, UserPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';

const ICONS = {
  revenue: DollarSign,
  info: Package,
  warning: AlertTriangle,
  customer: UserPlus,
};

export default function ActivityFeed({ activities }) {
  return (
    <Card className="p-6" hover>
      <CardHeader className="flex flex-row items-start justify-between">
        <span>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Live feed of business events</CardDescription>
        </span>
        <button
          type="button"
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10"
          aria-label="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <ul className="space-y-2">
        {activities.map((item, i) => {
          const Icon = ICONS[item.type] || Package;
          const variant =
            item.status === 'completed' ? 'success' : item.status === 'pending' ? 'warning' : 'processing';
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </span>
              <span className="text-right">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{item.amount}</p>
                {item.status && <Badge variant={variant} className="mt-1">{item.status}</Badge>}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </Card>
  );
}
