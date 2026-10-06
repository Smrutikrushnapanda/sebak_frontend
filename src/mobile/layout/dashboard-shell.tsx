'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { MobileSidebarProvider } from '../context/sidebar-context';
import { MobileSidebar } from './sidebar';
import { MobileTopbar } from './topbar';

export function MobileDashboardShell({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/mobile/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#faf8ff]">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-[#f97316] rounded-full animate-spin" />
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Korei Sevaka...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
        <MobileSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <MobileTopbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
