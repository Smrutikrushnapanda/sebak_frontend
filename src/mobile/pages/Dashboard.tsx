'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useConstituencySettings } from '@/context/settings-context';

export default function Dashboard() {
  const { settings } = useConstituencySettings();

  const representativeName = settings?.representativeName || 'Shri Akash Dasnayak';
  const constituencyName = settings?.constituencyName || 'Korei Assembly Constituency';

  const [lang, setLang] = useState<'EN' | 'OD'>('EN');

  return (
    <>
      {/* ── MOBILE VIEW (Screen width < 719px) ── */}
      <div className="min-[719px]:hidden flex flex-col w-full min-h-screen bg-white relative pb-24">
        {/* BEGIN: TopAppBar */}
        <nav className="w-full px-4 py-2 flex items-center justify-end bg-white border-b border-gray-100 sticky top-0 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          {/* Actions: Language Selector, Notification, Avatar */}
          <div className="flex items-center space-x-2.5">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#F4F4F5] p-0.5 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2.5 py-1 rounded-full text-[11px] leading-tight transition-all cursor-pointer ${
                  lang === 'EN'
                    ? 'bg-[#EA580C] text-white font-medium shadow-sm'
                    : 'text-gray-600 font-normal'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('OD')}
                className={`px-2 py-1 text-[11px] leading-tight transition-all cursor-pointer ${
                  lang === 'OD'
                    ? 'bg-[#EA580C] text-white rounded-full font-medium shadow-sm'
                    : 'text-gray-600 font-normal'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>

            {/* Notification Bell with Alert Dot */}
            <Link href="/mobile/notifications" className="relative cursor-pointer p-1">
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
            </Link>

            {/* MLA Avatar with Active Status */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-200 bg-amber-100 flex items-center justify-center">
                <img
                  alt={representativeName}
                  className="w-full h-full object-cover object-[75%_10%]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5q650-66TJvRCqbsHKk05sD-7hgKphMdk-X9vQBk6swLPP_8l0F2EHlYSZfr1mdfn8DsgvrXjpl8JSsl8ONLZykGQEIabDE2U1xpoS_uk6b0-EHQFUduDoI3845QuyFAC9uNFhgXCxr7uQPy_rkxQlJ49wvxa_1djnN1Y1z__FQCMGwZYV_yrD3XLcDXrE_bpwWiSBuwGMUFpTSSiDin3Px5l8-PcaHT62iDn6e6dYNn8xAdfOupg7gRgYtJv7FuhuQ"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
            </div>
          </div>
        </nav>
        {/* END: TopAppBar */}

        {/* BEGIN: MainContent */}
        <main className="flex-1 w-full px-3.5 pt-3 pb-6 flex flex-col space-y-4">
          {/* Hero Leadership Banner */}
          <section className="w-full rounded-2xl overflow-hidden shadow-sm border border-orange-200/80 bg-gradient-to-r from-orange-50 to-amber-50">
            <img
              src="/images/webapp-banner.png"
              alt="Korei Sevaka Banner - Your Voice Our Commitment"
              className="w-full h-auto object-cover rounded-2xl shadow-xs"
            />
          </section>

          {/* GreetingAndLocation */}
          <section className="flex justify-between items-start pt-1">
            <div>
              <span className="text-gray-500 text-xs block font-medium">Good Morning,</span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{representativeName}</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">MLA, {constituencyName}</p>
            </div>
            <div className="flex flex-col items-end text-xs text-slate-600 font-medium space-y-1">
              <div className="flex items-center space-x-1">
                <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-slate-700">Friday, 12 September 2025</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3.5 h-3.5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-slate-700">Korei, Odisha</span>
              </div>
            </div>
          </section>

          {/* SloganBanner */}
          <section className="w-full bg-[#FFF5EF] border border-[#FEE1D2] hover:border-orange-300 rounded-xl px-3 py-2.5 flex items-center justify-between shadow-2xs transition-all cursor-pointer">
            <div className="flex items-center space-x-2.5">
              <div className="text-orange-500 flex-shrink-0">
                <svg className="w-5 h-5 fill-current text-orange-500" viewBox="0 0 24 24">
                  <path d="M21.707 4.293a1 1 0 00-1.077-.209l-7.999 3.2A1 1 0 0012 8.162V10H7a3 3 0 00-3 3v2a3 3 0 003 3h1v2a2 2 0 002 2h2a2 2 0 002-2v-2.162l5.369 2.148A1 1 0 0021 19.162V5a1 1 0 00-.293-.707zM12 18h-2v-2h2v2zm7-2.483l-5-2V9.483l5-2v8.034z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800">“Together for a Better Korei.”</span>
            </div>
            <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </section>

          {/* TodayScheduleSection */}
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">Today’s Schedule</h3>
              </div>
              <Link href="/mobile/appointments" className="text-xs font-semibold text-orange-600 flex items-center hover:underline">
                View All <span className="ml-0.5 font-bold">&gt;</span>
              </Link>
            </div>
            {/* 3 Metric Cards with Hover Borders */}
            <div className="grid grid-cols-3 gap-2">
              {/* Card 1: Meetings */}
              <div className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col items-center text-center justify-center space-y-1 shadow-2xs hover:border-orange-500 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="text-base font-extrabold text-slate-900 leading-none">3</span>
                <span className="text-[10px] text-slate-500 font-semibold leading-tight whitespace-nowrap">Meetings</span>
              </div>

              {/* Card 2: Field Visit */}
              <div className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col items-center text-center justify-center space-y-1 shadow-2xs hover:border-orange-500 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-base font-extrabold text-slate-900 leading-none">1</span>
                <span className="text-[10px] text-slate-500 font-semibold leading-tight whitespace-nowrap">Field Visit</span>
              </div>

              {/* Card 3: Public Events */}
              <div className="bg-white rounded-xl border border-gray-200 p-2.5 flex flex-col items-center text-center justify-center space-y-1 shadow-2xs hover:border-orange-500 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="text-base font-extrabold text-slate-900 leading-none">0</span>
                <span className="text-[10px] text-slate-500 font-semibold leading-tight whitespace-nowrap">Public Events</span>
              </div>
            </div>
          </section>

          {/* ConstituencyOverviewSection */}
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">Constituency Overview</h3>
              </div>
              <div className="flex items-center space-x-1 bg-white border border-gray-200 hover:border-orange-300 rounded-lg px-2 py-1 text-xs text-gray-700 font-medium shadow-2xs transition-colors cursor-pointer">
                <span>GP / Municipality</span>
                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </div>
            </div>
            {/* 4-Column Grid with hover borders */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {/* Metric 1: Open Issues */}
              <div className="bg-[#FDF1F1] rounded-xl p-2 flex flex-col items-center justify-center text-center space-y-1 border border-rose-200/90 min-h-[90px] shadow-2xs hover:border-rose-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="text-[#EF4444]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-base font-black text-slate-900 leading-none">48</span>
                <span className="text-[9.5px] text-gray-600 font-semibold leading-tight text-center">Open Issues</span>
              </div>

              {/* Metric 2: Active Works */}
              <div className="bg-[#EFF6FF] rounded-xl p-2 flex flex-col items-center justify-center text-center space-y-1 border border-blue-200/90 min-h-[90px] shadow-2xs hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="text-[#2563EB]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-base font-black text-slate-900 leading-none">21</span>
                <span className="text-[9.5px] text-gray-600 font-semibold leading-tight text-center">Active Works</span>
              </div>

              {/* Metric 3: Completed */}
              <div className="bg-[#F0FDF4] rounded-xl p-2 flex flex-col items-center justify-center text-center space-y-1 border border-emerald-200/90 min-h-[90px] shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="text-[#16A34A]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-base font-black text-slate-900 leading-none">12</span>
                <span className="text-[9.5px] text-gray-600 font-semibold leading-tight text-center">Completed</span>
              </div>

              {/* Metric 4: Available Funds */}
              <div className="bg-[#FFF8EE] rounded-xl p-2 flex flex-col items-center justify-center text-center space-y-1 border border-amber-200/90 min-h-[90px] shadow-2xs hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="text-[#EA580C]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      clipRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 leading-none tracking-tight whitespace-nowrap">₹ 1.8 Cr</span>
                <span className="text-[9.5px] text-gray-600 font-semibold leading-tight text-center whitespace-nowrap">Available Funds</span>
              </div>
            </div>
          </section>

          {/* RecentActivitySection */}
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              </div>
              <Link href="/mobile/issues" className="text-xs font-semibold text-orange-600 flex items-center">
                View All <span className="ml-0.5 font-bold">&gt;</span>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 shadow-xs">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      New road issue reported in Ward 12
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">Area: Balipatna GP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-400 text-xs pl-2">
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">2 hours ago</span>
                  <span className="text-orange-500 text-xs">&gt;</span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      Water supply issue marked as resolved
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">Area: Nuagaon</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-400 text-xs pl-2">
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">5 hours ago</span>
                  <span className="text-orange-500 text-xs">&gt;</span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">Work order updated</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Drainage development at Korei Market</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-400 text-xs pl-2">
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">1 day ago</span>
                  <span className="text-orange-500 text-xs">&gt;</span>
                </div>
              </div>
            </div>
          </section>

          {/* IssueOverviewSection */}
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    fillRule="evenodd"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">Issue Overview</h3>
              </div>
              <Link href="/mobile/issues" className="text-xs font-semibold text-orange-600 flex items-center">
                View All <span className="ml-0.5 font-bold">&gt;</span>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-xs grid grid-cols-4 divide-x divide-gray-100 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className="text-base font-bold text-slate-900">5</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">In Review</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-base font-bold text-slate-900">12</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">Due Soon</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-base font-bold text-slate-900">8</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">Overdue</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                  <span className="text-base font-bold text-slate-900">23</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">Closed</span>
              </div>
            </div>
          </section>

          {/* WorkOrdersSection */}
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    fillRule="evenodd"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">Work Orders</h3>
              </div>
              <Link href="/mobile/work-orders" className="text-xs font-semibold text-orange-600 flex items-center">
                View All <span className="ml-0.5 font-bold">&gt;</span>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-xs grid grid-cols-3 divide-x divide-gray-100 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-base font-bold text-slate-900">4</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">In Planning</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-base font-bold text-slate-900">7</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">In Progress</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-base font-bold text-slate-900">9</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">Completed</span>
              </div>
            </div>
          </section>
        </main>

        {/* FixedBottomNavigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200/80 px-2 pt-2 pb-5 z-40 shadow-lg">
          <div className="grid grid-cols-5 items-center">
            <Link className="flex flex-col items-center group" href="/mobile/dashboard">
              <div className="bg-[#FEECE3] text-orange-600 px-5 py-1 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-orange-600 mt-0.5">Home</span>
            </Link>
            <Link className="flex flex-col items-center text-slate-600 group" href="/mobile/issues">
              <div className="px-3 py-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-slate-600 mt-0.5">Issues</span>
            </Link>
            <Link className="flex flex-col items-center text-slate-600 group" href="/mobile/work-orders">
              <div className="px-3 py-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-slate-600 mt-0.5">Works</span>
            </Link>
            <Link className="flex flex-col items-center text-slate-600 group" href="/mobile/appointments">
              <div className="px-3 py-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-slate-600 mt-0.5">Appointments</span>
            </Link>
            <Link className="flex flex-col items-center text-slate-600 group" href="/mobile/more">
              <div className="px-3 py-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-slate-600 mt-0.5">More</span>
            </Link>
          </div>
          <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto mt-2.5" />
        </nav>
      </div>

      {/* ── DESKTOP / LARGE SCREEN VIEW (Screen width >= 719px) ── */}
      <div className="max-[718px]:hidden flex flex-col space-y-6 pb-12 w-full max-w-7xl mx-auto px-4">
        {/* Hero Leadership Banner */}
        <section className="w-full rounded-2xl overflow-hidden shadow-md border border-orange-200/80 bg-gradient-to-r from-orange-50 to-amber-50">
          <img
            src="/images/webapp-banner.png"
            alt="Korei Sevaka Banner - Your Voice Our Commitment"
            className="w-full h-auto max-h-[420px] object-cover rounded-2xl shadow-xs"
          />
        </section>

        {/* Slogan Banner */}
        <section className="w-full bg-[#FFF5EF] border border-[#FEE1D2] rounded-xl px-5 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="text-orange-500 flex-shrink-0">
              <svg className="w-6 h-6 fill-current text-orange-500" viewBox="0 0 24 24">
                <path d="M21.707 4.293a1 1 0 00-1.077-.209l-7.999 3.2A1 1 0 0012 8.162V10H7a3 3 0 00-3 3v2a3 3 0 003 3h1v2a2 2 0 002 2h2a2 2 0 002-2v-2.162l5.369 2.148A1 1 0 0021 19.162V5a1 1 0 00-.293-.707zM12 18h-2v-2h2v2zm7-2.483l-5-2V9.483l5-2v8.034z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800">“Together for a Better Korei.”</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">Friday, 12 September 2025 • Korei, Odisha</span>
        </section>

        {/* Today's Schedule Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <h3 className="text-base font-bold text-slate-900">Today’s Schedule</h3>
            </div>
            <Link href="/mobile/appointments" className="text-xs font-semibold text-orange-600 flex items-center hover:underline">
              View All <span className="ml-0.5 font-bold">&gt;</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200/80 p-4 flex items-center space-x-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-none">3</span>
                <span className="text-xs text-gray-500 font-medium">Meetings</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/80 p-4 flex items-center space-x-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-none">1</span>
                <span className="text-xs text-gray-500 font-medium">Field Visit</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/80 p-4 flex items-center space-x-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-none">0</span>
                <span className="text-xs text-gray-500 font-medium">Public Events</span>
              </div>
            </div>
          </div>
        </section>

        {/* Constituency Overview Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <h3 className="text-base font-bold text-slate-900">Constituency Overview</h3>
            </div>
            <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium shadow-2xs cursor-pointer">
              <span>GP / Municipality Filter</span>
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#FDF1F1] rounded-2xl p-4 flex flex-col items-center text-center justify-between h-28 border border-rose-100 shadow-2xs">
              <div className="text-[#EF4444] mt-0.5">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-tight">48</span>
                <span className="text-xs text-gray-600 font-medium">Open Issues</span>
              </div>
            </div>

            <div className="bg-[#EFF6FF] rounded-2xl p-4 flex flex-col items-center text-center justify-between h-28 border border-blue-100 shadow-2xs">
              <div className="text-[#2563EB] mt-0.5">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-tight">21</span>
                <span className="text-xs text-gray-600 font-medium">Active Works</span>
              </div>
            </div>

            <div className="bg-[#F0FDF4] rounded-2xl p-4 flex flex-col items-center text-center justify-between h-28 border border-emerald-100 shadow-2xs">
              <div className="text-[#16A34A] mt-0.5">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-tight">12</span>
                <span className="text-xs text-gray-600 font-medium">Completed</span>
              </div>
            </div>

            <div className="bg-[#FFF8EE] rounded-2xl p-4 flex flex-col items-center text-center justify-between h-28 border border-amber-100 shadow-2xs">
              <div className="text-[#EA580C] mt-0.5">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    clipRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block leading-tight whitespace-nowrap">
                  ₹ 1.8 Cr
                </span>
                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">Available Funds</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Split: Recent Activity & Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
              </div>
              <Link href="/mobile/issues" className="text-xs font-semibold text-orange-600 flex items-center hover:underline">
                View All <span className="ml-0.5 font-bold">&gt;</span>
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200/80 divide-y divide-gray-100 shadow-xs">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">
                      New road issue reported in Ward 12
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">Area: Balipatna GP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <span className="text-xs text-gray-400 whitespace-nowrap">2 hours ago</span>
                  <span className="text-orange-500 font-bold text-sm">&gt;</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">
                      Water supply issue marked as resolved
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">Area: Nuagaon</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <span className="text-xs text-gray-400 whitespace-nowrap">5 hours ago</span>
                  <span className="text-orange-500 font-bold text-sm">&gt;</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">Work order updated</h4>
                    <p className="text-xs text-gray-500 font-medium">Drainage development at Korei Market</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <span className="text-xs text-gray-400 whitespace-nowrap">1 day ago</span>
                  <span className="text-orange-500 font-bold text-sm">&gt;</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Issue Overview & Work Orders */}
          <div className="space-y-6">
            {/* Issue Overview */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-base font-bold text-slate-900">Issue Overview</h3>
                </div>
                <Link href="/mobile/issues" className="text-xs font-semibold text-orange-600 flex items-center hover:underline">
                  View All <span className="ml-0.5 font-bold">&gt;</span>
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs grid grid-cols-4 divide-x divide-gray-100 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    <span className="text-xl font-bold text-slate-900">5</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">In Review</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xl font-bold text-slate-900">12</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">Due Soon</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-xl font-bold text-slate-900">8</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">Overdue</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                    <span className="text-xl font-bold text-slate-900">23</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">Closed</span>
                </div>
              </div>
            </section>

            {/* Work Orders */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 019.47-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-base font-bold text-slate-900">Work Orders</h3>
                </div>
                <Link href="/mobile/work-orders" className="text-xs font-semibold text-orange-600 flex items-center hover:underline">
                  View All <span className="ml-0.5 font-bold">&gt;</span>
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs grid grid-cols-3 divide-x divide-gray-100 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-xl font-bold text-slate-900">4</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">In Planning</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xl font-bold text-slate-900">7</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">In Progress</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xl font-bold text-slate-900">9</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-1">Completed</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
