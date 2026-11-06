import { LuSparkles } from 'react-icons/lu';

export function PortalLoading({ message = 'Loading Portal' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50">
      <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
        <div className="relative h-14 w-14" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border-[3px] border-orange-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-orange-500" />
          <div className="absolute inset-2 rounded-full bg-orange-50 flex items-center justify-center">
            <LuSparkles className="h-4 w-4 text-orange-500" />
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{message}</p>
      </div>
    </div>
  );
}
