'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MobileSidebarProvider } from '../context/sidebar-context';
import { MobileSidebar } from './sidebar';
import { MobileTopbar } from './topbar';

export function MobileDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullMobilePage = pathname === '/mobile/dashboard' || pathname === '/mobile/issues' || pathname === '/mobile/work-orders' || pathname === '/mobile/appointments' || pathname === '/mobile/funds' || pathname === '/mobile/reminders' || pathname === '/mobile/important-links' || pathname === '/mobile/notifications' || pathname === '/mobile/opinions' || pathname === '/mobile/escalation' || pathname === '/mobile/people' || pathname === '/mobile/hierarchy' || pathname === '/mobile/reports' || pathname === '/mobile/more';

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
        <div className={isFullMobilePage ? 'max-[718px]:hidden contents' : 'contents'}>
          <MobileSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <div className={isFullMobilePage ? 'max-[718px]:hidden contents' : 'contents'}>
            <MobileTopbar />
          </div>
          <main className={`flex-1 overflow-y-auto overflow-x-hidden ${isFullMobilePage ? 'max-[718px]:p-0 p-5 sm:p-7' : 'p-5 sm:p-7'}`}>
            <div className="max-w-7xl w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
