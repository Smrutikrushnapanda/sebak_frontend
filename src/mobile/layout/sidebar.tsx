'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConstituencySettings } from '@/context/settings-context';
import { useAuth } from '@/context/auth-context';
import { useMobileSidebar } from '../context/sidebar-context';
import { resolveIcon } from './icon-resolver';
import {
  LuChevronDown,
  LuChevronRight,
  LuSparkles,
  LuLayers,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuX,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  orderIndex?: number;
}

export function MobileSidebar() {
  const pathname = usePathname();
  const { settings, label, representativeType, portalName } = useConstituencySettings();
  const { user } = useAuth();
  const { isOpen, isCollapsed, toggleCollapsed, setIsOpen } = useMobileSidebar();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    // Static menu for the new web app — 13 pages
    setMenus([
      { id: '1', label: 'Dashboard', icon: 'LuHouse', path: '/mobile/dashboard' },
      { id: '2', label: 'Issues', icon: 'LuCircleAlert', path: '/mobile/issues' },
      { id: '3', label: 'Work Orders', icon: 'LuWrench', path: '/mobile/work-orders' },
      { id: '4', label: 'Funds', icon: 'LuDatabase', path: '/mobile/funds' },
      { id: '5', label: 'Appointments', icon: 'LuCalendar', path: '/mobile/appointments' },
      { id: '6', label: 'Reminders', icon: 'LuClock', path: '/mobile/reminders' },
      { id: '7', label: 'Notifications', icon: 'LuBell', path: '/mobile/notifications' },
      { id: '8', label: 'Opinions', icon: 'LuMessageSquare', path: '/mobile/opinions' },
      { id: '9', label: 'Important Links', icon: 'LuLink', path: '/mobile/important-links' },
      { id: '10', label: 'Escalation', icon: 'LuTrendingUp', path: '/mobile/escalation' },
      { id: '11', label: 'Reports', icon: 'LuChartBar', path: '/mobile/reports' },
      { id: '12', label: 'Hierarchy', icon: 'LuNetwork', path: '/mobile/hierarchy' },
      { id: '13', label: 'People', icon: 'LuUsers', path: '/mobile/people' },
    ]);
  }, [user]);

  // Auto-expand group containing the current active pathname
  useEffect(() => {
    if (menus.length > 0) {
      const activeParent = menus.find((m) =>
        m.children?.some((c) => c.path && pathname.startsWith(c.path))
      );
      if (activeParent) {
        setOpenGroup(activeParent.label);
      }
    }
  }, [pathname, menus]);

  const toggleGroup = (groupLabel: string) => {
    setOpenGroup((prev) => (prev === groupLabel ? null : groupLabel));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/mobile/dashboard') return pathname === '/mobile/dashboard' || pathname === '/mobile';
    return pathname.startsWith(path);
  };

  const renderNavList = () => (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
      {menus.map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
          const isGroupOpen = openGroup === item.label;
          const isAnyChildActive = item.children?.some((c) => isActive(c.path));

          if (isCollapsed) {
            // Collapsed group icon view
            return (
              <div key={item.id} className="py-1 flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-all',
                    isAnyChildActive
                      ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/25'
                      : 'bg-[#fff5ee] text-[#f97316] hover:bg-orange-100',
                  )}
                  title={item.label}
                  onClick={() => toggleCollapsed()}
                >
                  {resolveIcon(item.icon, cn('w-5 h-5', isAnyChildActive ? 'text-white' : 'text-[#f97316]'))}
                </div>
              </div>
            );
          }

          return (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(item.label)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all select-none',
                  isAnyChildActive
                    ? 'bg-[#fff5ee] text-[#f97316] font-bold border border-orange-100/70 shadow-2xs'
                    : 'text-[#2a3c66] hover:bg-slate-50',
                )}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      isAnyChildActive
                        ? 'bg-[#f97316] text-white shadow-sm shadow-orange-500/20'
                        : 'bg-[#fff5ee] text-[#f97316]',
                    )}
                  >
                    {resolveIcon(
                      item.icon || 'LuNetwork',
                      cn('w-4 h-4', isAnyChildActive ? 'text-white' : 'text-[#f97316]'),
                    )}
                  </div>
                  <span className={cn('tracking-tight text-sm', isAnyChildActive ? 'font-extrabold text-[#f97316]' : 'font-semibold text-[#2a3c66]')}>
                    {item.label}
                  </span>
                </div>
                {isGroupOpen ? (
                  <LuChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-200 rotate-180',
                      isAnyChildActive ? 'text-[#f97316]' : 'text-[#2a3c66]',
                    )}
                  />
                ) : (
                  <LuChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isAnyChildActive ? 'text-[#f97316]' : 'text-[#2a3c66]',
                    )}
                  />
                )}
              </button>

              {isGroupOpen && (
                <div className="border-l border-slate-200/80 ml-6 pl-4 py-1 space-y-1">
                  {item.children?.map((child) => {
                    const active = isActive(child.path);

                    return (
                      <Link
                        key={child.id}
                        href={child.path || '#'}
                        prefetch
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs sm:text-sm transition-all select-none',
                          active
                            ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-extrabold shadow-md shadow-orange-500/25'
                            : 'text-[#2a3c66] font-semibold hover:bg-slate-100/80',
                        )}
                      >
                        {resolveIcon(
                          child.icon || 'LuUser',
                          cn('w-4 h-4 shrink-0', active ? 'text-white' : 'text-[#f97316]'),
                        )}
                        <span className="truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Single Top-Level Link
        const active = isActive(item.path);

        if (isCollapsed) {
          return (
            <div key={item.id} className="py-1 flex flex-col items-center">
              <Link
                href={item.path || '#'}
                prefetch
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center transition-all',
                  active
                    ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/25'
                    : 'bg-[#fff5ee] text-[#f97316] hover:bg-orange-100',
                )}
                title={item.label}
              >
                {resolveIcon(item.icon, cn('w-5 h-5', active ? 'text-white' : 'text-[#f97316]'))}
              </Link>
            </div>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.path || '#'}
            prefetch
            onClick={() => setIsOpen(false)}
            className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm transition-all select-none',
              active
                ? 'bg-[#f97316] text-white font-extrabold shadow-md shadow-orange-500/25'
                : 'text-[#2a3c66] font-semibold hover:bg-slate-50',
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  active ? 'bg-white/20 text-white' : 'bg-[#fff5ee] text-[#f97316]',
                )}
              >
                {resolveIcon(
                  item.icon || 'LuHouse',
                  cn('w-4 h-4', active ? 'text-white' : 'text-[#f97316]'),
                )}
              </div>
              <span className={cn('tracking-tight text-sm', active ? 'font-extrabold text-white' : 'font-semibold text-[#2a3c66]')}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'bg-white border-r border-slate-200/90 flex flex-col shrink-0 h-screen sticky top-0 shadow-sm z-50 select-none overflow-hidden transition-all duration-300',
          // Desktop collapsed vs expanded
          isCollapsed ? 'w-20' : 'w-72',
          // Mobile responsive slide-in
          isOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl translate-x-0'
            : 'fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0 lg:static',
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            'p-3.5 border-b border-orange-100/80 bg-white flex items-center justify-between min-h-[58px]',
            isCollapsed && 'justify-center p-2.5',
          )}
        >
          {isCollapsed ? (
            <div className="w-11 h-11 rounded-2xl bg-white border border-orange-200/80 flex items-center justify-center overflow-hidden p-1 shadow-2xs">
              <img
                src="/images/lotus-img.png"
                alt="Logo"
                className="h-full w-auto object-contain object-left max-w-none"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <Link href="/mobile/dashboard" className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-11 h-11 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/lotus-img.png"
                    alt="Lotus Symbol"
                    className="h-full w-auto object-contain object-left max-w-none"
                  />
                </div>
                <div className="flex flex-col justify-center leading-none select-none">
                  <span className="text-base font-black text-[#ea580c] tracking-tight leading-tight uppercase">
                    KOREI SEVAKA
                  </span>
                  <span className="text-[9px] font-extrabold text-[#2563eb] tracking-wide mt-0.5 whitespace-nowrap uppercase">
                    SERVICE • DEDICATION • DEVELOPMENT
                  </span>
                </div>
              </Link>

              {/* Close button on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50 shrink-0"
                onClick={() => setIsOpen(false)}
              >
                <LuX className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation List */}
        {renderNavList()}



        {/* Sidebar Footer / Collapse Toggle */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 text-xs text-[#2a3c66] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Online</span>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              'text-[#2a3c66] hover:text-[#f97316] text-xs font-bold flex items-center gap-1.5 transition-colors',
              isCollapsed && 'w-full justify-center p-2',
            )}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <LuPanelLeftOpen className="w-5 h-5 text-[#2a3c66]" />
            ) : (
              <>
                <LuPanelLeftClose className="w-4 h-4 text-[#2a3c66]" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
