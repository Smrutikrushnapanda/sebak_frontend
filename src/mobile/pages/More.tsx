'use client';

import React from 'react';
import Link from 'next/link';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';


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
  { label: 'Area Directory', icon: 'location_on', path: '/mobile/hierarchy', bg: 'bg-[#ffe5e0]', color: 'text-[#e03810]' },
];

export default function MorePage() {
  return (
    <>
      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Fixed Mobile Top Header */}
        <header className="fixed top-0 w-full z-50 pt-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 px-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#e2e7ff] p-0.5 rounded-full text-xs font-semibold">
                <button aria-label="Switch to English" className="px-2.5 py-1 rounded-full bg-[#ff7722] text-white leading-none">
                  EN
                </button>
                <button aria-label="Switch to Odia" className="px-2.5 py-1 rounded-full text-[#584237] leading-none">
                  ଓଡ଼ିଆ
                </button>
              </div>
              <button
                aria-label="Notifications"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#584237] hover:bg-[#e2e7ff] transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#faf8ff]"></span>
              </button>
              <div className="relative flex items-center justify-center">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ff7722]"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1U1Kx_eScSQYJs2VSC9t6JtflN0nRVU9CbFLUo5WVxp79LpXdakHZySIcm_hCLy4mbk1cgF3zhhQWpdF2YLA9lZFH_TPu7oo708acj_7yt16QXcphY6eIAhCo35rObsvjF8TJmwpfzZuFEUi_mnbcmsy-ZJodUSYYpCeURiZy7v9LtwRSZOBJQ9t3kE8liF3hHgGOuFTwK9-UmFvqNQQc9Ks8WwF1DFNtJTGD3XZk1tM1oIdVQUmHdSbi727uL6kaIyhmPzyc6DnQ"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#006c49] ring-2 ring-[#faf8ff]"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full pt-16 max-w-md mx-auto px-4 pb-8 space-y-4">
          {/* Header Banner Section matching image 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fff5f0] via-[#fff9f5] to-[#ffece2] p-4 border border-[#ff7722]/15 shadow-xs flex items-center justify-between mt-3">
            <div className="flex flex-col gap-0.5 z-10">
              <h1 className="text-2xl font-extrabold text-[#131b2e] tracking-tight">More</h1>
              <p className="text-xs font-medium text-[#584237]">All features at your fingertips</p>
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
