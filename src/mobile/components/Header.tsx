'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useConstituencySettings } from '@/context/settings-context';
import {
  LuMenu,
  LuBell,
  LuChevronDown,
  LuUser,
  LuLogOut,
  LuSettings,
} from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleSidebar?: () => void;
  pageTitle?: string;
}

export function Header({ onToggleSidebar, pageTitle }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings } = useConstituencySettings();
  const [lang, setLang] = useState<'EN' | 'OR'>('EN');

  // Infer title if not passed explicitly
  const getTitle = () => {
    if (pageTitle) return pageTitle;
    if (pathname.includes('/issues')) return 'Issues';
    if (pathname.includes('/work-orders')) return 'Work Orders';
    if (pathname.includes('/appointments')) return 'Appointments';
    if (pathname.includes('/funds')) return 'Funds';
    if (pathname.includes('/reminders')) return 'Reminders';
    if (pathname.includes('/notifications')) return 'Notifications';
    if (pathname.includes('/opinions')) return 'Opinions';
    if (pathname.includes('/important-links')) return 'Important Links';
    if (pathname.includes('/escalation')) return 'Escalation';
    if (pathname.includes('/reports')) return 'Reports';
    if (pathname.includes('/hierarchy')) return 'Hierarchy';
    if (pathname.includes('/people')) return 'People';
    return 'Dashboard';
  };

  const displayName = settings?.representativeName || user?.fullName || 'Shri Akash Dasnayak';

  return (
    <header className="w-full bg-white border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs min-h-[60px]">
      {/* Left: Sidebar Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/60 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <LuMenu className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {getTitle()}
        </h1>
      </div>

      {/* Right: Language Pill, Notification Bell, User Avatar Pill */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Language Selector Pill */}
        <div className="bg-[#fff5ee] border border-orange-200/70 rounded-full p-0.5 flex items-center space-x-0.5">
          <button
            type="button"
            onClick={() => setLang('EN')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
              lang === 'EN'
                ? 'bg-[#f97316] text-white shadow-2xs'
                : 'text-slate-600 hover:text-orange-600'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('OR')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
              lang === 'OR'
                ? 'bg-[#f97316] text-white shadow-2xs'
                : 'text-slate-600 hover:text-orange-600'
            }`}
          >
            ଓଡ଼ିଆ
          </button>
        </div>

        {/* Notification Bell with Red Badge */}
        <Link
          href="/mobile/notifications"
          className="relative p-1.5 text-slate-600 hover:text-[#f97316] transition-colors"
          title="Notifications"
        >
          <LuBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f97316] border border-white" />
        </Link>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center space-x-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors select-none cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full border-2 border-[#f97316] overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-black text-[#f97316]">AD</span>
                </div>
                {/* Green Online Dot */}
                <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
              </div>

              <span className="hidden sm:inline text-xs font-extrabold text-slate-900 truncate max-w-[140px]">
                {displayName}
              </span>
              <LuChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
            <DropdownMenuLabel className="p-2">
              <p className="text-sm font-bold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">MLA, Korei Assembly</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center space-x-2 p-2 text-xs font-semibold cursor-pointer">
                <LuSettings className="w-4 h-4 text-slate-500" />
                <span>Organization Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center space-x-2 p-2 text-xs font-semibold text-rose-600 focus:text-rose-600 cursor-pointer"
            >
              <LuLogOut className="w-4 h-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
