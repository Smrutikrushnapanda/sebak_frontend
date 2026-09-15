import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-2xl mb-4 shadow-sm border border-primary-100">
        404
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Page Not Found</h2>
      <p className="text-xs text-slate-500 mb-6 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-xs font-semibold">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
