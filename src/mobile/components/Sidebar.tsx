'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  LuHouse,
  LuCircleAlert,
  LuWrench,
  LuDatabase,
  LuCalendar,
  LuClock,
  LuBell,
  LuMessageSquare,
  LuLink,
  LuTrendingUp,
  LuChartBar,
  LuNetwork,
  LuUsers,
  LuUser,
  LuLogOut,
  LuChevronRight,
  LuX,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/mobile/dashboard', icon: LuHouse },
    { label: 'Issues', path: '/mobile/issues', icon: LuCircleAlert },
    { label: 'Work Orders', path: '/mobile/work-orders', icon: LuWrench },
    { label: 'Funds', path: '/mobile/funds', icon: LuDatabase },
    { label: 'Appointments', path: '/mobile/appointments', icon: LuCalendar },
    { label: 'Reminders', path: '/mobile/reminders', icon: LuClock },
    { label: 'Notifications', path: '/mobile/notifications', icon: LuBell },
    { label: 'Opinions', path: '/mobile/opinions', icon: LuMessageSquare },
    { label: 'Important Links', path: '/mobile/important-links', icon: LuLink },
    { label: 'Escalation', path: '/mobile/escalation', icon: LuTrendingUp },
    { label: 'Reports', path: '/mobile/reports', icon: LuChartBar },
    { label: 'Hierarchy', path: '/mobile/hierarchy', icon: LuNetwork },
    { label: 'People', path: '/mobile/people', icon: LuUsers },
  ];

  const isActive = (path: string) => {
    if (path === '/mobile/dashboard') return pathname === '/mobile/dashboard' || pathname === '/mobile';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Admin Sidebar Container */}
      <aside
        className={cn(
          'bg-white border-r border-slate-200/90 flex flex-col shrink-0 h-screen sticky top-0 shadow-md z-50 select-none overflow-hidden transition-all duration-300',
          // Desktop Width: Collapsible
          isCollapsed ? 'lg:w-20' : 'lg:w-72',
          // Mobile Width & Drawer
          'w-72',
          isOpen
            ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0'
            : 'fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0 lg:static',
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            'p-4 border-b border-slate-100 flex items-center justify-between bg-white min-h-[60px]',
            isCollapsed && 'lg:justify-center lg:p-2.5',
          )}
        >
          {isCollapsed ? (
            <Link
              href="/mobile/dashboard"
              className="hidden lg:flex w-11 h-11 rounded-2xl bg-[#fff5ee] border border-orange-200/80 items-center justify-center p-1 shadow-2xs hover:scale-105 transition-transform"
              title="Korei Sevaka"
            >
              <img
                src="/images/lotus-img.png"
                alt="Lotus Logo"
                className="h-full w-auto object-contain"
              />
            </Link>
          ) : (
            <Link
              href="/mobile/dashboard"
              className="flex items-center space-x-2.5 overflow-hidden"
              onClick={onClose}
            >
              <div className="w-9 h-9 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/lotus-img.png"
                  alt="Lotus Logo"
                  className="h-full w-auto object-contain object-left max-w-none"
                />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="text-base font-black text-[#ea580c] tracking-tight leading-tight uppercase">
                  KOREI SEVAKA
                </span>
                <span className="text-[9px] font-extrabold text-[#2563eb] tracking-wide mt-0.5 whitespace-nowrap uppercase">
                  SERVICE • DEDICATION • DEVELOPMENT
                </span>
              </div>
            </Link>
          )}

          {/* Close button on mobile */}
          <button
            type="button"
            className="lg:hidden h-8 w-8 text-slate-400 hover:text-orange-600 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={onClose}
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-2.5 sm:px-3 py-3 space-y-1.5 scrollbar-thin">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const IconComponent = item.icon;

            if (isCollapsed) {
              return (
                <div key={item.path} className="hidden lg:flex flex-col items-center py-0.5">
                  <Link
                    href={item.path}
                    className={cn(
                      'w-11 h-11 rounded-2xl flex items-center justify-center transition-all',
                      active
                        ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/25'
                        : 'bg-transparent text-[#2a3c66] hover:bg-[#fff5ee] hover:text-[#f97316]',
                    )}
                    title={item.label}
                  >
                    <IconComponent className={cn('w-5 h-5', active ? 'text-white' : 'text-[#f97316]')} />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all select-none',
                  active
                    ? 'bg-[#fff5ee] text-[#f97316] font-extrabold shadow-2xs border border-orange-100/80'
                    : 'text-[#2a3c66] font-semibold hover:bg-slate-50',
                )}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-4 h-4 shrink-0 text-[#f97316]" />
                  <span>{item.label}</span>
                </div>
                <LuChevronRight
                  className={cn(
                    'w-3.5 h-3.5 transition-transform',
                    active ? 'text-[#f97316]' : 'text-slate-300',
                  )}
                />
              </Link>
            );
          })}

          <div className="pt-2 pb-1">
            <div className="border-t border-slate-100 my-1" />
          </div>

          {/* My Profile */}
          {isCollapsed ? (
            <div className="hidden lg:flex flex-col items-center py-0.5">
              <Link
                href="/settings"
                className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center transition-all',
                  isActive('/settings')
                    ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/25'
                    : 'bg-transparent text-[#2a3c66] hover:bg-[#fff5ee] hover:text-[#f97316]',
                )}
                title="My Profile"
              >
                <LuUser className="w-5 h-5 text-[#f97316]" />
              </Link>
            </div>
          ) : (
            <Link
              href="/settings"
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all select-none',
                isActive('/settings')
                  ? 'bg-[#fff5ee] text-[#f97316] font-extrabold shadow-2xs'
                  : 'text-[#2a3c66] font-semibold hover:bg-slate-50',
              )}
            >
              <div className="flex items-center space-x-3">
                <LuUser className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>My Profile</span>
              </div>
              <LuChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </Link>
          )}

          {/* Logout */}
          {isCollapsed ? (
            <div className="hidden lg:flex flex-col items-center py-0.5">
              <button
                type="button"
                onClick={logout}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                title="Logout"
              >
                <LuLogOut className="w-5 h-5 text-rose-500" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                logout();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#2a3c66] hover:bg-rose-50 hover:text-rose-600 transition-all select-none cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <LuLogOut className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>Logout</span>
              </div>
            </button>
          )}
        </div>

        {/* Bottom Collapse Toggle & Temple Footer */}
        <div className="border-t border-slate-100 bg-[#fffdfa] select-none">
          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <div className="p-2 border-b border-slate-100/80 hidden lg:flex items-center justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-full flex items-center justify-center space-x-2 py-1.5 px-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-orange-50 hover:text-[#f97316] transition-colors cursor-pointer"
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isCollapsed ? (
                  <LuPanelLeftOpen className="w-5 h-5 text-[#f97316]" />
                ) : (
                  <>
                    <LuPanelLeftClose className="w-4 h-4 text-[#f97316]" />
                    <span>Collapse Sidebar</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Temple Graphic Footer (shown only when expanded) */}
          {!isCollapsed && (
            <div className="p-3 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="flex items-end justify-center space-x-4 pt-1">
                <svg
                  viewBox="0 0 200 70"
                  className="h-14 w-auto text-orange-200 stroke-current fill-none stroke-[1.2]"
                >
                  <path d="M100 10 L115 35 L115 65 L85 65 L85 35 Z" />
                  <path d="M100 10 L100 65" />
                  <path d="M90 25 L110 25" />
                  <path d="M92 40 L108 40" />
                  <path d="M94 55 L106 55" />
                  <path d="M100 5 L100 10" />
                  <path d="M70 25 L82 45 L82 65 L58 65 L58 45 Z" />
                  <path d="M70 25 L70 65" />
                  <path d="M130 25 L142 45 L142 65 L118 65 L118 45 Z" />
                  <path d="M130 25 L130 65" />
                  <path d="M30 65 L170 65" />
                </svg>

                <div className="flex flex-col text-left">
                  <span className="font-serif italic text-xs font-bold text-[#ea580c] leading-tight tracking-tight">
                    Service
                  </span>
                  <span className="font-serif italic text-xs font-bold text-[#ea580c] leading-tight tracking-tight pl-1">
                    Dedication
                  </span>
                  <span className="font-serif italic text-xs font-bold text-[#ea580c] leading-tight tracking-tight pl-2">
                    Development
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
