import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Pagination controls for DataTable.
 */
export default function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}) {
  if (totalPages <= 0) return null;

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800',
        className
      )}
    >
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Showing <span className="font-medium text-slate-900 dark:text-white">{start}</span>–
        <span className="font-medium text-slate-900 dark:text-white">{end}</span> of{' '}
        <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <div className="hidden items-center gap-1 sm:flex">
          {startPage > 1 && (
            <>
              <PageBtn n={1} active={page === 1} onClick={() => onPageChange(1)} />
              {startPage > 2 && <span className="px-1 text-slate-400">…</span>}
            </>
          )}
          {pages.map((n) => (
            <PageBtn key={n} n={n} active={page === n} onClick={() => onPageChange(n)} />
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
              <PageBtn n={totalPages} active={page === totalPages} onClick={() => onPageChange(totalPages)} />
            </>
          )}
        </div>
        <span className="text-sm text-slate-500 sm:hidden">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PageBtn({ n, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-w-[2rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition',
        active
          ? 'bg-brand-600 text-white'
          : 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
      )}
    >
      {n}
    </button>
  );
}
