import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCartIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const ACTIONS = [
  { href: '/', label: 'Continue shopping', desc: 'Browse latest products', icon: ShoppingCartIcon, accent: 'emerald' },
  { href: '#', label: 'Download invoices', desc: 'PDF receipts & bills', icon: DocumentArrowDownIcon, accent: 'blue', onClick: true },
  { href: 'mailto:support@estore.com', label: 'Contact support', desc: 'We respond within 24h', icon: ChatBubbleLeftRightIcon, accent: 'violet' },
  { href: '/', label: 'Upgrade plan', desc: 'Unlock premium perks', icon: SparklesIcon, accent: 'amber' },
  { href: '/?category=all', label: 'Browse products', desc: 'Explore marketplace', icon: Squares2X2Icon, accent: 'navy' },
];

const accentMap = {
  emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10 group-hover:text-emerald-600',
  blue: 'hover:border-blue-500/40 hover:shadow-blue-500/10 group-hover:text-blue-600',
  violet: 'hover:border-violet-500/40 hover:shadow-violet-500/10 group-hover:text-violet-600',
  amber: 'hover:border-amber-500/40 hover:shadow-amber-500/10 group-hover:text-amber-600',
  navy: 'hover:border-navy-500/40 hover:shadow-navy-500/10 group-hover:text-navy-600',
};

export default function QuickActions({ onDownloadInvoices }) {
  return (
    <section className="dashboard-card p-6">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Quick actions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Shortcuts to common tasks</p>
      </header>
      <motion.ul className="grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          const className = `group flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${accentMap[action.accent]}`;
          const inner = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-white/10 ring-1 ring-gray-200/80 dark:ring-white/10 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10">
                <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors" />
              </span>
              <span>
                <span className="block font-semibold text-navy-900 dark:text-white">{action.label}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{action.desc}</span>
              </span>
            </>
          );

          if (action.onClick) {
            return (
              <motion.li key={action.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <button type="button" onClick={onDownloadInvoices} className={`w-full text-left ${className}`}>
                  {inner}
                </button>
              </motion.li>
            );
          }

          return (
            <motion.li key={action.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={action.href} className={className}>
                {inner}
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
