'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell dashboardContext="internal">{children}</DashboardShell>;
}
