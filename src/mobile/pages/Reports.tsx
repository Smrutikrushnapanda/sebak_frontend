'use client';

import React, { useState } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


export default function Reports() {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState<'fy' | '30days' | '6mos'>('fy');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportPdf = () => {
    triggerToast('Downloading Official PDF Report for Collectorate...');
  };

  const handleExportCsv = () => {
    triggerToast('Downloading Mo Sarkar Raw Citizen Redressal CSV...');
  };

  // Dynamic Metrics Data
  const stats = {
    fy: {
      efficiency: '84.2%',
      trend: '+6.4%',
      speed: '3.2 Days',
      workOrdersPct: '76%',
      executedAmount: '₹4.5 Cr',
      rating: '4.6',
      servedCount: '12,400+',
      totalGrievances: '478 Active',
      roadsPct: 38,
      roadsCount: 182,
      waterPct: 29,
      waterCount: 138,
      powerPct: 18,
      powerCount: 86,
      welfarePct: 15,
      welfareCount: 72,
    },
    '30days': {
      efficiency: '89.5%',
      trend: '+8.1%',
      speed: '2.1 Days',
      workOrdersPct: '82%',
      executedAmount: '₹85 L',
      rating: '4.8',
      servedCount: '1,850+',
      totalGrievances: '124 Active',
      roadsPct: 35,
      roadsCount: 43,
      waterPct: 32,
      waterCount: 40,
      powerPct: 20,
      powerCount: 25,
      welfarePct: 13,
      welfareCount: 16,
    },
    '6mos': {
      efficiency: '86.8%',
      trend: '+5.2%',
      speed: '2.8 Days',
      workOrdersPct: '79%',
      executedAmount: '₹2.8 Cr',
      rating: '4.7',
      servedCount: '7,200+',
      totalGrievances: '290 Active',
      roadsPct: 40,
      roadsCount: 116,
      waterPct: 27,
      waterCount: 78,
      powerPct: 17,
      powerCount: 49,
      welfarePct: 16,
      welfareCount: 47,
    },
  }[timeframe];

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#131b2e] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm text-[#00b57d]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MOBILE VIEW (BELOW 719px) - MATCHING PROVIDED HTML TEMPLATE & SCREENSHOT */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8 space-y-4">
          {/* Sub-Header & Timeframe Segmented Selector */}
          <section className="flex flex-col gap-3 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#131b2e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ff7722] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    analytics
                  </span>
                  Constituency Analytics
                </h2>
                <p className="text-xs text-[#584237]">Korei Assembly Constituency Governance Audit</p>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('Filter preset options active.')}
                aria-label="Filter Options"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#eaedff] text-[#584237] hover:text-[#9f4200] transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-xl">tune</span>
              </button>
            </div>

            {/* Timeframe Filter Pills */}
            <div className="flex items-center p-1 bg-[#eaedff] rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setTimeframe('fy')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                  timeframe === 'fy' ? 'bg-[#ff7722] text-white shadow-xs font-bold' : 'text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                FY 2025-26
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('30days')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                  timeframe === '30days' ? 'bg-[#ff7722] text-white shadow-xs font-bold' : 'text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('6mos')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                  timeframe === '6mos' ? 'bg-[#ff7722] text-white shadow-xs font-bold' : 'text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                Last 6 Mos
              </button>
            </div>
          </section>

          {/* Summary KPI Bento Grid */}
          <section className="grid grid-cols-1 gap-3">
            {/* Primary Grievance Resolution Hero Card */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-4 shadow-2xs border border-slate-100">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#6ffbbe]/30 pointer-events-none blur-xl"></div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#584237]">REDRESSAL EFFICIENCY</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#131b2e] tracking-tight">{stats.efficiency}</span>
                    <span className="inline-flex items-center text-[#006c49] text-[10px] font-bold bg-[#6ffbbe]/40 px-1.5 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-xs">trending_up</span> {stats.trend}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#6ffbbe]/30 flex items-center justify-center text-[#006c49] shadow-2xs">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified_user
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2 bg-[#f2f3ff]/70 rounded-xl px-3 py-1.5 flex items-center justify-between text-[#584237]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#ff7722]">schedule</span>
                  <span className="text-xs">Avg. Redressal Speed</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e]">{stats.speed}</span>
              </div>
            </div>

            {/* Secondary Metric Cards (2 Column Split) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Work Order Delivery */}
              <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-slate-100 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ffdbcb] flex items-center justify-center text-[#9f4200]">
                    <span className="material-symbols-outlined text-lg">engineering</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eaedff] text-[#9f4200] font-bold">Live</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#584237] block">Work Orders</span>
                  <span className="text-xl font-extrabold text-[#131b2e] block">{stats.workOrdersPct}</span>
                  <span className="text-[11px] text-[#006c49] font-bold">On Schedule</span>
                </div>
                <div className="mt-2 pt-2 bg-[#f2f3ff] -mx-3.5 -mb-3.5 px-3.5 py-1.5">
                  <span className="text-[10px] text-[#584237]">Executed: </span>
                  <span className="text-xs font-bold text-[#131b2e]">{stats.executedAmount}</span>
                </div>
              </div>

              {/* Citizen Engagement Index */}
              <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-slate-100 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ffddb8] flex items-center justify-center text-[#855300]">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <span className="text-[10px] text-[#584237]">Satisfaction</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#584237] block">Citizen Rating</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-[#131b2e]">{stats.rating}</span>
                    <span className="text-xs text-[#584237]">/5</span>
                  </div>
                  <div className="flex text-[#fea619] text-xs">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star_half
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 bg-[#f2f3ff] -mx-3.5 -mb-3.5 px-3.5 py-1.5 truncate">
                  <span className="text-xs font-bold text-[#131b2e]">{stats.servedCount}</span>
                  <span className="text-[10px] text-[#584237]"> Served</span>
                </div>
              </div>
            </div>
          </section>

          {/* Visual Grievance Distribution Section */}
          <section className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff7722]"></div>
                <h3 className="text-sm font-bold text-[#131b2e]">Grievances by Category</h3>
              </div>
              <span className="text-[10px] text-[#584237] bg-[#eaedff] px-2 py-0.5 rounded-full font-bold">
                {stats.totalGrievances}
              </span>
            </div>

            {/* Progress Distribution Bars */}
            <div className="flex flex-col gap-2.5">
              {/* Item 1: Roads */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[#131b2e]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#ff7722]">edit_road</span>
                    Roads &amp; Culverts
                  </span>
                  <span className="text-xs font-bold">
                    {stats.roadsPct}% <span className="text-[10px] text-[#584237] font-normal">({stats.roadsCount})</span>
                  </span>
                </div>
                <div className="w-full bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#ff7722] h-full rounded-full" style={{ width: `${stats.roadsPct}%` }}></div>
                </div>
              </div>

              {/* Item 2: Drinking Water (RWSS) */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[#131b2e]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#006c49]">water_drop</span>
                    Drinking Water (RWSS)
                  </span>
                  <span className="text-xs font-bold">
                    {stats.waterPct}% <span className="text-[10px] text-[#584237] font-normal">({stats.waterCount})</span>
                  </span>
                </div>
                <div className="w-full bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#006c49] h-full rounded-full" style={{ width: `${stats.waterPct}%` }}></div>
                </div>
              </div>

              {/* Item 3: Electricity */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[#131b2e]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#855300]">lightbulb</span>
                    Electricity &amp; Streetlighting
                  </span>
                  <span className="text-xs font-bold">
                    {stats.powerPct}% <span className="text-[10px] text-[#584237] font-normal">({stats.powerCount})</span>
                  </span>
                </div>
                <div className="w-full bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#fea619] h-full rounded-full" style={{ width: `${stats.powerPct}%` }}></div>
                </div>
              </div>

              {/* Item 4: Welfare & Pensions */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[#131b2e]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#8c7165]">diversity_1</span>
                    Welfare &amp; Pensions
                  </span>
                  <span className="text-xs font-bold">
                    {stats.welfarePct}% <span className="text-[10px] text-[#584237] font-normal">({stats.welfareCount})</span>
                  </span>
                </div>
                <div className="w-full bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#8c7165] h-full rounded-full" style={{ width: `${stats.welfarePct}%` }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Gram Panchayat Performance Matrix */}
          <section className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7722] text-lg">location_city</span>
                <h3 className="text-sm font-bold text-[#131b2e]">Panchayat Performance Matrix</h3>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('Opening full 28 Panchayat metrics view...')}
                className="text-[11px] font-bold text-[#ff7722] hover:underline"
              >
                View All (28)
              </button>
            </div>

            {/* Top Performing GPs */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[#006c49] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">workspace_premium</span> HIGH EFFICIENCY TIER
              </span>
              <div className="grid grid-cols-3 gap-2">
                {/* GP 1 */}
                <div className="bg-[#f2f3ff] rounded-xl p-2.5 flex flex-col items-center text-center">
                  <span className="text-lg font-extrabold text-[#006c49]">94%</span>
                  <span className="text-xs font-bold text-[#131b2e] truncate w-full mt-0.5">Balipatna</span>
                  <span className="text-[10px] text-[#584237]">62 Solved</span>
                </div>
                {/* GP 2 */}
                <div className="bg-[#f2f3ff] rounded-xl p-2.5 flex flex-col items-center text-center">
                  <span className="text-lg font-extrabold text-[#006c49]">91%</span>
                  <span className="text-xs font-bold text-[#131b2e] truncate w-full mt-0.5">Korei Town</span>
                  <span className="text-[10px] text-[#584237]">118 Solved</span>
                </div>
                {/* GP 3 */}
                <div className="bg-[#f2f3ff] rounded-xl p-2.5 flex flex-col items-center text-center">
                  <span className="text-lg font-extrabold text-[#006c49]">88%</span>
                  <span className="text-xs font-bold text-[#131b2e] truncate w-full mt-0.5">Nuagaon</span>
                  <span className="text-[10px] text-[#584237]">45 Solved</span>
                </div>
              </div>
            </div>

            {/* Needing Attention Area */}
            <div className="bg-[#ffdad6]/40 rounded-xl p-3 flex items-center justify-between border border-[#ba1a1a]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] shrink-0 font-bold">
                  <span className="material-symbols-outlined text-lg">priority_high</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#ba1a1a] uppercase tracking-wider font-bold block">
                    NEEDS IMMEDIATE REVIEW
                  </span>
                  <h4 className="text-xs font-bold text-[#131b2e]">Vyasanagar Border</h4>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-base font-extrabold text-[#ba1a1a]">64%</span>
                <span className="text-[10px] text-[#584237]">24 Overdue</span>
              </div>
            </div>
          </section>

          {/* Export & Compliance Hub */}
          <section className="flex flex-col gap-2">
            <span className="text-[10px] text-[#584237] uppercase tracking-wider px-1 font-bold">
              COMPLIANCE &amp; DEPARTMENT EXPORTS
            </span>
            {/* PDF Export Button */}
            <button
              type="button"
              onClick={handleExportPdf}
              className="w-full bg-white active:scale-[0.99] transition-transform rounded-2xl p-4 shadow-2xs border border-slate-100 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffdbcb] flex items-center justify-center text-[#ff7722] group-hover:bg-[#ff7722] group-hover:text-white transition-colors shrink-0">
                  <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#131b2e]">Monthly Constituency Audit</span>
                  <span className="text-[10px] text-[#584237]">Official PDF report for Collectorate</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#584237] group-hover:text-[#ff7722]">
                <span className="material-symbols-outlined text-lg">download</span>
              </div>
            </button>

            {/* CSV Mo Sarkar Export Button */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="w-full bg-white active:scale-[0.99] transition-transform rounded-2xl p-4 shadow-2xs border border-slate-100 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6ffbbe] flex items-center justify-center text-[#006c49] group-hover:bg-[#006c49] group-hover:text-white transition-colors shrink-0">
                  <span className="material-symbols-outlined text-2xl">table_chart</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#131b2e]">Mo Sarkar Feedback Dataset</span>
                  <span className="text-[10px] text-[#584237]">Raw citizen redressal CSV (Sync Ready)</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#584237] group-hover:text-[#006c49]">
                <span className="material-symbols-outlined text-lg">file_download</span>
              </div>
            </button>
          </section>
        </main>

        <MobileBottomNav />
      </div>

      {/* DESKTOP VIEW (719px AND ABOVE) - FULL DASHBOARD INTEGRATION */}
      <div className="max-[718px]:hidden space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="material-symbols-outlined text-orange-600 text-base">analytics</span>
              <span className="text-orange-600 font-bold">Constituency Analytics &amp; Audit</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Korei Governance Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPdf}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              Export PDF Audit
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-lg">table_chart</span>
              Mo Sarkar CSV Sync
            </button>
          </div>
        </div>

        {/* Desktop Filter Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Audit Timeframe Window</span>
          <div className="flex items-center gap-2">
            {[
              { id: 'fy', label: 'FY 2025-26' },
              { id: '30days', label: 'Last 30 Days' },
              { id: '6mos', label: 'Last 6 Months' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeframe(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  timeframe === tab.id
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop KPI Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Redressal Efficiency */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">REDRESSAL EFFICIENCY</span>
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">verified_user</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{stats.efficiency}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {stats.trend}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Average Resolution Speed: {stats.speed}</p>
            </div>
          </div>

          {/* Card 2: Work Orders Executed */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">WORK ORDERS</span>
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">engineering</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{stats.workOrdersPct}</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">Live</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Total Executed Budget: {stats.executedAmount}</p>
            </div>
          </div>

          {/* Card 3: Citizen Engagement */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CITIZEN SATISFACTION</span>
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">star</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{stats.rating} / 5</span>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  {stats.servedCount} Served
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Based on official Mo Sarkar citizen feedback</p>
            </div>
          </div>
        </div>

        {/* Desktop Category Distribution & Panchayat Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Grievances by Category */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Grievances by Category</h3>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {stats.totalGrievances}
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Roads &amp; Culverts</span>
                  <span>{stats.roadsPct}% ({stats.roadsCount})</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${stats.roadsPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Drinking Water (RWSS)</span>
                  <span>{stats.waterPct}% ({stats.waterCount})</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${stats.waterPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Electricity &amp; Streetlighting</span>
                  <span>{stats.powerPct}% ({stats.powerCount})</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.powerPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Welfare &amp; Pensions</span>
                  <span>{stats.welfarePct}% ({stats.welfareCount})</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-stone-500 h-full rounded-full" style={{ width: `${stats.welfarePct}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Panchayat Performance Matrix */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-900">Panchayat Performance Matrix</h3>
                <span className="text-xs font-bold text-orange-600">High Efficiency Tier</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-xl font-extrabold text-emerald-700 block">94%</span>
                  <span className="text-xs font-bold text-slate-900">Balipatna</span>
                  <span className="text-[10px] text-slate-500 block">62 Solved</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-xl font-extrabold text-emerald-700 block">91%</span>
                  <span className="text-xs font-bold text-slate-900">Korei Town</span>
                  <span className="text-[10px] text-slate-500 block">118 Solved</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-xl font-extrabold text-emerald-700 block">88%</span>
                  <span className="text-xs font-bold text-slate-900">Nuagaon</span>
                  <span className="text-[10px] text-slate-500 block">45 Solved</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">priority_high</span>
                <div>
                  <span className="text-[10px] font-bold uppercase text-red-700 block">Needs Immediate Review</span>
                  <span className="text-xs font-bold text-slate-900">Vyasanagar Border GP</span>
                </div>
              </div>
              <span className="text-base font-extrabold text-red-600">64% (24 Overdue)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
