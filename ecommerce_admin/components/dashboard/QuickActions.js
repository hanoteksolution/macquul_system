import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, BarChart3, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';

const ACTIONS = [
  { href: '/orders', label: 'New order', desc: 'Process sale', icon: ShoppingBag, color: 'from-brand-500 to-brand-600' },
  { href: '/products', label: 'Add product', desc: 'Catalog item', icon: Package, color: 'from-emerald-500 to-emerald-600' },
  { href: '/finance', label: 'Reports', desc: 'Analytics', icon: BarChart3, color: 'from-violet-500 to-violet-600' },
  { href: '/settings', label: 'Team', desc: 'Manage users', icon: Users, color: 'from-amber-500 to-orange-500' },
];

export default function QuickActions() {
  return (
    <Card className="p-6" hover>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Frequently used operations</CardDescription>
      </CardHeader>
      <span className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.span key={action.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link
                href={action.href}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/50 p-4 transition hover:border-brand-500/20 dark:border-white/10 dark:bg-white/5"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white transition`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">{action.label}</span>
                  <span className="block text-xs text-slate-500">{action.desc}</span>
                </span>
              </Link>
            </motion.span>
          );
        })}
      </span>
    </Card>
  );
}
