export function DashboardSkeleton() {
  return (
    <div className="p-8 bg-base-200 min-h-[calc(100vh-64px)] animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-300 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-40 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="h-14 w-48 bg-slate-300 dark:bg-slate-700 rounded"></div>
      </div>

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded shadow-sm border-b-4 border-slate-300 dark:border-slate-700"></div>
        ))}
      </div>

      {/* Bottom Sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded shadow-sm border-2 border-slate-300 dark:border-slate-700"></div>
        <div className="space-y-6">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded shadow-sm border-b-4 border-slate-300 dark:border-slate-700"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded shadow-sm border-2 border-slate-300 dark:border-slate-700"></div>
        </div>
      </div>
    </div>
  );
}
