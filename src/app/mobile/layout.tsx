'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MobileDashboardShell } from '@/mobile/layout/dashboard-shell';
import { LanguageProvider } from '@/context/language-context';

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPlainPage = pathname === '/mobile/login' || pathname === '/mobile';

  return (
    <LanguageProvider>
      {isPlainPage ? children : <MobileDashboardShell>{children}</MobileDashboardShell>}
    </LanguageProvider>
  );
}
