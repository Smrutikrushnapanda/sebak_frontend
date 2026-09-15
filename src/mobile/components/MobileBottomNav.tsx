'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import {
  LuHouse,
  LuTriangleAlert,
  LuWrench,
  LuCalendar,
  LuLayoutGrid,
} from 'react-icons/lu';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  translationKey: string;
  path: string;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    { icon: <LuHouse className="w-5 h-5" />, label: t('nav.home'), translationKey: 'nav.home', path: '/mobile/dashboard' },
    { icon: <LuTriangleAlert className="w-5 h-5" />, label: t('nav.issues'), translationKey: 'nav.issues', path: '/mobile/issues' },
    { icon: <LuWrench className="w-5 h-5" />, label: t('nav.works'), translationKey: 'nav.works', path: '/mobile/work-orders' },
    { icon: <LuCalendar className="w-5 h-5" />, label: t('nav.appts'), translationKey: 'nav.appts', path: '/mobile/appointments' },
    { icon: <LuLayoutGrid className="w-5 h-5" />, label: t('nav.more'), translationKey: 'nav.more', path: '/mobile/more' },
  ];

  const isActive = (path: string) => {
    if (path === '/mobile/dashboard') {
      return pathname === '/mobile/dashboard' || pathname === '/mobile';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200/80 px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="grid grid-cols-5 items-center max-w-[430px] mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.translationKey}
              href={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-1 transition-colors',
                active ? 'text-[#f97316]' : 'text-slate-500'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-8 rounded-full transition-colors',
                  active ? 'bg-[#fff5ee]' : ''
                )}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-bold leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
