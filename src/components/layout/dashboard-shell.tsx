'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { SidebarProvider } from '@/context/sidebar-context';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardContext } from '@/lib/menu-cache';
import { Topbar } from '@/components/layout/topbar';

export function DashboardShell({ children, dashboardContext }: { children: React.ReactNode; dashboardContext: DashboardContext }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = 'http://localhost:5173/';
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="mt-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Loading Constituency Portal...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen min-w-0 overflow-hidden bg-slate-50 text-slate-900">
        <Sidebar key={dashboardContext} dashboardContext={dashboardContext} />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Topbar dashboardContext={dashboardContext} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7">
            <div className="max-w-7xl w-full min-w-0 mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
