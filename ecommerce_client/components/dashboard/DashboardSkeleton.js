export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 animate-pulse">
      <div className="h-16 bg-white/50 dark:bg-navy-900/50 border-b border-gray-200/50 dark:border-white/5" />
      <div className="flex">
        <div className="hidden lg:block w-72 min-h-[calc(100vh-4rem)] bg-white/30 dark:bg-navy-900/30 border-r border-gray-200/50 dark:border-white/5 p-6 space-y-4">
          <div className="h-20 rounded-2xl bg-gray-200/80 dark:bg-white/5" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-11 rounded-xl bg-gray-200/60 dark:bg-white/5" />
          ))}
        </div>
        <div className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl">
          <div className="h-40 rounded-3xl bg-gray-200/70 dark:bg-white/5" />
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-200/60 dark:bg-white/5" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 rounded-2xl bg-gray-200/60 dark:bg-white/5" />
            <div className="h-80 rounded-2xl bg-gray-200/60 dark:bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
