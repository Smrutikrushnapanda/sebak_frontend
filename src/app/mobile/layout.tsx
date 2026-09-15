'use client';

import React from 'react';
import { MobileDashboardShell } from '@/mobile/layout/dashboard-shell';

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileDashboardShell>{children}</MobileDashboardShell>;
}
