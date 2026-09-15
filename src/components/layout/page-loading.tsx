export function PageLoading({ message = 'Loading page...' }: { message?: string }) {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      {/* Header placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded-lg bg-slate-200/80" />
          <div className="h-3 w-72 rounded bg-slate-100" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 rounded-xl bg-slate-100" />
          <div className="h-9 w-28 rounded-xl bg-orange-100" />
        </div>
      </div>

      {/* Stat cards placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-2.5 w-20 rounded bg-slate-100" />
              <div className="h-5 w-12 rounded bg-slate-200/80" />
              <div className="h-2.5 w-24 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Table placeholder */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-slate-200/80" />
            <div className="h-2.5 w-60 rounded bg-slate-100" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 overflow-hidden">
          <div className="h-11 bg-slate-50" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
              <div className="h-3 flex-1 max-w-[180px] rounded bg-slate-100" />
              <div className="h-3 w-28 rounded bg-slate-100 hidden sm:block" />
              <div className="h-3 w-24 rounded bg-slate-100 hidden md:block" />
              <div className="h-5 w-16 rounded-full bg-slate-100 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
        <span className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}
