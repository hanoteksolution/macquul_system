import { motion } from 'framer-motion';
import { Activity, Server, Database, Wifi } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';

const SERVICES = [
  { name: 'Web server', status: 'online', icon: Server },
  { name: 'Database', status: 'online', icon: Database },
  { name: 'API services', status: 'online', icon: Wifi },
];

export default function SystemHealth() {
  return (
    <Card className="p-6" hover>
      <CardHeader className="flex flex-row items-start justify-between">
        <span>
          <CardTitle>System health</CardTitle>
          <CardDescription>Infrastructure status</CardDescription>
        </span>
        <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Operational
        </span>
      </CardHeader>
      <ul className="space-y-3">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-white/5"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{s.name}</span>
              </span>
              <span className="text-xs font-semibold capitalize text-emerald-600 dark:text-emerald-400">{s.status}</span>
            </motion.li>
          );
        })}
      </ul>
      <span className="mt-4 block">
        <span className="mb-2 flex justify-between text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" />
            Uptime
          </span>
          <span>99.9%</span>
        </span>
        <span className="block h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: '99.9%' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500"
          />
        </span>
      </span>
    </Card>
  );
}
