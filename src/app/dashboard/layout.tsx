'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell dashboardContext="organization">{children}</DashboardShell>;
}
