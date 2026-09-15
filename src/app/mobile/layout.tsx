'use client';

import React from 'react';
import { MobileDashboardShell } from '@/mobile/layout/dashboard-shell';
import { LanguageProvider } from '@/context/language-context';

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <MobileDashboardShell>{children}</MobileDashboardShell>
    </LanguageProvider>
  );
}
