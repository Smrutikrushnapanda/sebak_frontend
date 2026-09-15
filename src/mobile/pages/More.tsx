'use client';

import React from 'react';
import Link from 'next/link';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


const gridFeatures = [
  { label: 'Dashboard', icon: 'home', path: '/mobile/dashboard', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
  { label: 'Issues', icon: 'warning', path: '/mobile/issues', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
  { label: 'Work Orders', icon: 'build', path: '/mobile/work-orders', bg: 'bg-[#ffede4]', color: 'text-[#ff7722]' },
  { label: 'Funds', icon: 'database', path: '/mobile/funds', bg: 'bg-[#ffede4]', color: 'text-[#ff7722]' },
  { label: 'Appointments', icon: 'calendar_month', path: '/mobile/appointments', bg: 'bg-[#ffede4]', color: 'text-[#ff7722]' },
  { label: 'Reminders', icon: 'alarm', path: '/mobile/reminders', bg: 'bg-[#ffede4]', color: 'text-[#ff7722]' },
  { label: 'Notifications', icon: 'notifications', path: '/mobile/notifications', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
  { label: 'Opinions', icon: 'chat_bubble', path: '/mobile/opinions', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
  { label: 'Important Links', icon: 'link', path: '/mobile/important-links', bg: 'bg-[#ffede4]', color: 'text-[#ff7722]' },
  { label: 'Escalation', icon: 'trending_up', path: '/mobile/escalation', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
  { label: 'Reports', icon: 'bar_chart', path: '/mobile/reports', bg: 'bg-[#ffede4]', color: 'text-[#ff7722]' },
  { label: 'Hierarchy', icon: 'account_tree', path: '/mobile/hierarchy', bg: 'bg-[#ffede4]', color: 'text-[#ff7722]' },
  { label: 'Organization', icon: 'groups', path: '/mobile/people', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
  { label: 'Area Directory', icon: 'location_on', path: '/mobile/hierarchy', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
];

export default function MorePage() {
  const { t } = useLanguage();
  return (
    <>
      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8 space-y-4">
          {/* Header Banner Section matching image 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fff5f0] via-[#fff9f5] to-[#ffece2] p-4 border border-[#ff7722]/15 shadow-xs flex items-center justify-between mt-3">
            <div className="flex flex-col gap-0.5 z-10">
              <h1 className="text-2xl font-extrabold text-[#131b2e] tracking-tight">{t('more.title')}</h1>
              <p className="text-xs font-medium text-[#584237]">{t('more.subtitle')}</p>
            </div>
            {/* Saffron Graphic Pill overlay */}
            <div className="relative z-10 px-3 py-2 rounded-xl bg-gradient-to-br from-[#ff7722] to-[#ea580c] text-white shadow-sm flex flex-col items-end text-right border border-white/20">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-100">Korei AC-53</span>
              <span className="text-xs font-bold font-serif italic text-white drop-shadow-xs">Stronger Korei</span>
              <span className="text-[10px] font-bold text-orange-100">Brighter Tomorrow</span>
            </div>
            {/* Background art blur circles */}
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#ff7722]/10 blur-xl pointer-events-none" />
          </div>

          {/* 3-Column Feature Cards Grid */}
          <div className="grid grid-cols-3 gap-3">
            {gridFeatures.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center gap-2 hover:shadow-md hover:border-[#ff7722]/30 transition-all group"
              >
                <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <span className={`material-symbols-outlined text-2xl ${item.color}`}>{item.icon}</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] leading-snug group-hover:text-[#ff7722] transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Logout Button matching image 1 */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/login';
                }
              }}
              className="w-full py-3.5 px-4 bg-[#ffede4] hover:bg-[#ffd9cb] active:scale-[0.99] text-[#ff7722] rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all border border-[#ff7722]/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {/* DESKTOP VIEW (719px and above) */}
      <div className="max-[718px]:hidden space-y-6 pb-12">
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">All Features &amp; Modules</h1>
            <p className="text-sm text-slate-500 mt-1">Quick access to all constituency governance tools</p>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
            }}
            className="px-5 py-2.5 bg-[#ffede4] hover:bg-[#ffd9cb] text-[#ff7722] rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gridFeatures.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#ff7722]/40 flex flex-col items-center text-center gap-3 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <span className={`material-symbols-outlined text-3xl ${item.color}`}>{item.icon}</span>
              </div>
              <span className="text-sm font-bold text-slate-800 group-hover:text-[#ff7722] transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
