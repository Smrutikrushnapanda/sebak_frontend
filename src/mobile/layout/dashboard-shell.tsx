'use client';

import React from 'react';
import { MobileSidebarProvider } from '../context/sidebar-context';
import { MobileSidebar } from './sidebar';
import { MobileTopbar } from './topbar';

export function MobileDashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <MobileSidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
        <MobileSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <MobileTopbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7">
            <div className="max-w-7xl w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
