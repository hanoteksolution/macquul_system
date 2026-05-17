import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '../../lib/cn';

/**
 * @typedef {Object} DataTableColumn
 * @property {string} key
 * @property {string} header
 * @property {string} [className]
 * @property {(row: object) => React.ReactNode} [render]
 */

/**
 * Premium data table for admin portals.
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data yet',
  getRowKey = (row, i) => row.id ?? i,
  onRowClick,
  compact = false,
  className,
  footer = null,
}) {
  const cellPad = compact ? 'px-4 py-2.5' : 'px-5 py-3.5';

  if (loading) {
    return (
      <div className={cn('overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10', className)}>
        <div className="animate-pulse space-y-0">
          <div className="h-11 bg-slate-100 dark:bg-white/5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 border-t border-slate-100 bg-white/50 dark:border-white/5 dark:bg-white/[0.02]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          'flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center dark:border-white/10 dark:bg-white/[0.02]',
          className
        )}
      >
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/90 dark:border-white/10 dark:bg-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    cellPad,
                    'text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <motion.tr
                key={getRowKey(row, i)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-slate-100/80 transition last:border-0 dark:border-white/5',
                  onRowClick && 'cursor-pointer hover:bg-brand-50/50 dark:hover:bg-brand-500/5'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(cellPad, 'text-slate-700 dark:text-slate-200', col.className)}
                  >
                    {col.render ? col.render(row, i) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}

export function DataTableLink({ href, children }) {
  return (
    <Link href={href} className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
      {children}
    </Link>
  );
}
