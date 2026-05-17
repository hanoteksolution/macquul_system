import { cn } from '../../lib/cn';

export function Skeleton({ className }) {
  return (
    <span
      className={cn(
        'block rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer dark:from-slate-800 dark:via-slate-700 dark:to-slate-800',
        className
      )}
    />
  );
}

export function DashboardPageSkeleton() {
  return (
    <span className="block space-y-6 animate-pulse">
      <Skeleton className="h-44 w-full rounded-3xl" />
      <span className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[156px] rounded-2xl" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </span>
      <span className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </span>
    </span>
  );
}
