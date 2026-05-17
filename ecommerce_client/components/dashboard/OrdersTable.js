import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EllipsisVerticalIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { getStatusStyle, formatStatus, getStatusIcon } from '../../lib/dashboardUtils';

function ProductThumb({ name }) {
  const letter = (name || 'P').charAt(0).toUpperCase();
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-100 to-emerald-50 text-sm font-bold text-navy-700 ring-1 ring-gray-200/80 dark:from-navy-800 dark:to-emerald-900/40 dark:text-emerald-200 dark:ring-white/10">
      {letter}
    </span>
  );
}

function OrderRow({ order, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstItem = order.items?.[0];
  const productName = firstItem?.product_name || 'Digital product';
  const StatusIcon = getStatusIcon(order.status);
  const canDownload = order.status === 'delivered';

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group border-b border-gray-100/80 dark:border-white/5 transition-colors hover:bg-emerald-500/[0.03]"
    >
      <td className="px-4 py-4 sm:px-6">
        <span className="font-semibold text-navy-900 dark:text-white">#{order.id}</span>
      </td>
      <td className="hidden md:table-cell px-4 py-4">
        <span className="flex items-center gap-3">
          <ProductThumb name={productName} />
          <span>
            <span className="block font-medium text-navy-900 dark:text-white line-clamp-1">{productName}</span>
            {order.items?.length > 1 && (
              <span className="text-xs text-gray-500">+{order.items.length - 1} more</span>
            )}
          </span>
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${getStatusStyle(order.status)}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {formatStatus(order.status)}
        </span>
      </td>
      <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
        {new Date(order.created_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </td>
      <td className="px-4 py-4 font-semibold text-navy-900 dark:text-white">
        ${Number(order.total_price || 0).toFixed(2)}
      </td>
      <td className="px-4 py-4 sm:px-6">
        <span className="flex items-center justify-end gap-2">
          {canDownload && (
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300"
              title="Download"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download
            </button>
          )}
          <span className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
              aria-label="Actions"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                  />
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200/80 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-navy-900"
                  >
                    <li>
                      <button
                        type="button"
                        onClick={() => { onView?.(order); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View details
                      </button>
                    </li>
                    {canDownload && (
                      <li>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Download
                        </button>
                      </li>
                    )}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </span>
        </span>
      </td>
    </motion.tr>
  );
}

export default function OrdersTable({ orders = [], title = 'Recent orders', emptyMessage, onViewOrder, compact }) {
  const list = compact ? orders.slice(0, 5) : orders;

  return (
    <section className="dashboard-card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100/80 px-6 py-5 dark:border-white/5">
        <span>
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{list.length} order{list.length !== 1 ? 's' : ''}</p>
        </span>
      </header>

      {list.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
            <CubeIcon className="h-8 w-8 text-gray-400" />
          </span>
          <p className="mt-4 font-medium text-navy-900 dark:text-white">{emptyMessage || 'No orders yet'}</p>
          <p className="mt-1 text-sm text-gray-500">Start shopping to see your order history here.</p>
        </motion.div>
      ) : (
        <motion.div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100/80 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-gray-400">
                <th className="px-4 py-3 sm:px-6">Order</th>
                <th className="hidden md:table-cell px-4 py-3">Product</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden sm:table-cell px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((order) => (
                <OrderRow key={order.id} order={order} onView={onViewOrder} />
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </section>
  );
}
