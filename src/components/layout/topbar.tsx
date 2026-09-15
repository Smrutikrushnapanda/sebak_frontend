'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useConstituencySettings } from '@/context/settings-context';
import { useSidebar } from '@/context/sidebar-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LuMenu,
  LuLogOut,
  LuUser,
  LuShield,
  LuPhone,
  LuSettings,
  LuSparkles,
  LuChevronDown,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from 'react-icons/lu';

export function Topbar() {
  const { user, logout } = useAuth();
  const { settings, representativeType } = useConstituencySettings();
  const { isCollapsed, toggleCollapsed, toggleOpen } = useSidebar();

  const getInitials = (name?: string) => {
    if (!name) return 'SP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const representativeName = settings?.representativeName || 'Shri Akash Dasnayak';
  const constituencyName = settings?.constituencyName || 'Korei Assembly';
  const phoneDisplay = settings?.representativeMobileDisplay || '+91 94370 12345';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2 flex items-center justify-between sticky top-0 z-30 shadow-2xs min-h-[58px]">
      {/* Left Section: Sidebar Toggle & Representative Identity Badge */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 border border-orange-200/90 bg-[#fff5ee] text-[#f97316] hover:bg-orange-100/70 rounded-xl p-0 transition-colors"
          onClick={toggleOpen}
          aria-label="Toggle Navigation Menu"
        >
          <LuMenu className="w-5 h-5" />
        </Button>

        {/* Desktop Collapse button */}
        <button
          type="button"
          className="hidden lg:flex h-9 w-9 border border-orange-200/90 bg-[#fff5ee] text-[#f97316] hover:bg-orange-100/70 rounded-xl items-center justify-center transition-colors shadow-2xs cursor-pointer"
          onClick={toggleCollapsed}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <LuPanelLeftOpen className="w-5 h-5 text-[#f97316]" />
          ) : (
            <LuPanelLeftClose className="w-5 h-5 text-[#f97316]" />
          )}
        </button>

        {/* Representative Header Badge Container */}
        <div className="flex items-center gap-2.5 bg-[#fff8f3] border border-orange-200/80 px-4 py-1.5 rounded-full shadow-2xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              {representativeName}
            </span>

            <span className="bg-[#f97316] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
              {representativeType || 'MLA'}
            </span>

            <span className="hidden sm:inline text-xs font-semibold text-slate-500">
              {constituencyName}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Office Helpline & User Profile */}
      <div className="flex items-center gap-3">
        {/* Office Contact Number */}
        <a
          href={`tel:${phoneDisplay}`}
          className="hidden md:flex items-center gap-2 bg-[#fff8f3] hover:bg-orange-100/50 border border-orange-200/80 px-3.5 py-1.5 rounded-2xl text-xs font-extrabold text-slate-900 transition-colors shadow-2xs"
        >
          <LuPhone className="w-3.5 h-3.5 text-[#f97316] fill-current" />
          <span>{phoneDisplay}</span>
        </a>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 transition-all select-none shadow-2xs cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 shadow-2xs">
                <img
                  src="/images/akash_profile.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-extrabold text-slate-900 leading-tight">
                  {user?.fullName || 'Smrutikrushna Panda'}
                </span>
                <span className="text-[10px] font-bold text-[#f97316] leading-none mt-0.5">
                  {user?.role?.name || 'Admin'}
                </span>
              </div>
              <LuChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
            <DropdownMenuLabel className="p-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src="/images/akash_profile.jpeg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-900">{user?.fullName || 'Shri Akash Dasnayak'}</p>
                  <p className="text-[10px] text-slate-500">{user?.mobile || '+91 94370 12345'}</p>
                  <Badge variant="default" className="w-fit text-[10px] mt-1 font-semibold">
                    {user?.role?.name || 'MLA'}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center space-x-2.5 px-2.5 py-2 text-sm text-slate-700 hover:text-primary-700 hover:bg-primary-50/70 rounded-lg cursor-pointer"
              >
                <LuSettings className="w-4 h-4 text-primary-600" />
                <span className="font-medium">Constituency Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={logout}
              className="flex items-center space-x-2.5 px-2.5 py-2 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg cursor-pointer font-semibold"
            >
              <LuLogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
