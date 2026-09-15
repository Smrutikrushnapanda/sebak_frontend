'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function ResponsiveLayout({ children, pageTitle }: ResponsiveLayoutProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileDrawerOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      {/* Admin Sidebar (Collapsible on Desktop, Drawer on Mobile) */}
      <Sidebar
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          pageTitle={pageTitle}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 space-y-6">
          <div className="max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
