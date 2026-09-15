'use client';

import React from 'react';
import Link from 'next/link';
import { useConstituencySettings } from '@/context/settings-context';
import { useLanguage } from '@/context/language-context';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import {
  LuTriangleAlert,
  LuWrench,
  LuCheckCheck,
  LuIndianRupee,
  LuCalendarDays,
  LuMapPin,
  LuUsers,
  LuBuilding2,
  LuVote,
  LuArrowRight,
  LuClock,
  LuCircleCheck,
  LuFileText,
  LuPhone,
  LuArrowUpRight,
  LuShieldAlert,
  LuSparkles,
  LuLayers,
} from 'react-icons/lu';

export default function Dashboard() {
  const { settings, representativeType } = useConstituencySettings();
  const { t, lang } = useLanguage();

  const representativeName = settings?.representativeName || 'Shri Akash Dasnayak';
  const constituencyName = settings?.constituencyName || 'Korei Assembly Constituency';
  const isOd = lang === 'OD';

  // Mobile Quick Actions
  const mobileQuickActions = [
    { icon: <LuTriangleAlert className="w-5 h-5" />, label: t('dashboard.grievance'), path: '/mobile/issues', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: <LuWrench className="w-5 h-5" />, label: t('dashboard.projects'), path: '/mobile/work-orders', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: <LuCalendarDays className="w-5 h-5" />, label: t('dashboard.appts'), path: '/mobile/appointments', color: 'text-violet-500', bg: 'bg-violet-50' },
    { icon: <LuUsers className="w-5 h-5" />, label: t('dashboard.organization'), path: '/mobile/people', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: <LuVote className="w-5 h-5" />, label: t('dashboard.hierarchy'), path: '/mobile/hierarchy', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: <LuFileText className="w-5 h-5" />, label: t('dashboard.reports'), path: '/mobile/reports', color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { icon: <LuBuilding2 className="w-5 h-5" />, label: t('dashboard.funds'), path: '/mobile/funds', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: <LuMapPin className="w-5 h-5" />, label: t('dashboard.more'), path: '/mobile/more', color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  // Mobile Recent Activity
  const mobileRecentActivities = [
    { title: 'Road issue reported in Ward 12', area: 'Balipatna GP', time: '2h ago', type: 'alert' as const },
    { title: 'Water supply issue resolved', area: 'Nuagaon', time: '5h ago', type: 'success' as const },
    { title: 'Work order updated', area: 'Korei Market', time: '1d ago', type: 'info' as const },
  ];

  // Desktop Actions
  const desktopQuickActions = [
    {
      icon: <LuTriangleAlert className="w-6 h-6" />,
      label: t('dashboard.grievance'),
      description: isOd ? 'ନାଗରିକ ଅଭିଯୋଗ ପରିଚାଳନା' : 'Citizen Grievance & Redressal',
      path: '/mobile/issues',
      color: 'text-red-500',
      bg: 'bg-red-50 hover:bg-red-100/80',
      border: 'border-red-100',
      badge: '48 Active',
    },
    {
      icon: <LuWrench className="w-6 h-6" />,
      label: t('dashboard.projects'),
      description: isOd ? 'ଉନ୍ନୟନ ପ୍ରକଳ୍ପ ଓ କାର୍ଯ୍ୟାଦେଶ' : 'Development Projects & Works',
      path: '/mobile/work-orders',
      color: 'text-blue-500',
      bg: 'bg-blue-50 hover:bg-blue-100/80',
      border: 'border-blue-100',
      badge: '21 Projects',
    },
    {
      icon: <LuCalendarDays className="w-6 h-6" />,
      label: t('dashboard.appts'),
      description: isOd ? 'ଭ୍ରମଣ ସୂଚୀ ଓ ସାକ୍ଷାତକାର' : 'Official Tour & Citizen Meetings',
      path: '/mobile/appointments',
      color: 'text-violet-500',
      bg: 'bg-violet-50 hover:bg-violet-100/80',
      border: 'border-violet-100',
      badge: '3 Today',
    },
    {
      icon: <LuUsers className="w-6 h-6" />,
      label: t('dashboard.organization'),
      description: isOd ? 'ସଂଗଠନ ଓ କର୍ମୀ ଡାଇରେକ୍ଟୋରୀ' : 'Organization & Worker Directory',
      path: '/mobile/people',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 hover:bg-emerald-100/80',
      border: 'border-emerald-100',
      badge: '1.9L+ Records',
    },
    {
      icon: <LuVote className="w-6 h-6" />,
      label: t('dashboard.hierarchy'),
      description: isOd ? 'ଦଳୀୟ ପଦାନୁକ୍ରମ ଓ ସଂଗଠନ' : 'Party Hierarchy & Cadre Grid',
      path: '/mobile/hierarchy',
      color: 'text-amber-500',
      bg: 'bg-amber-50 hover:bg-amber-100/80',
      border: 'border-amber-100',
      badge: '242 Booths',
    },
    {
      icon: <LuFileText className="w-6 h-6" />,
      label: t('dashboard.reports'),
      description: isOd ? 'ବିଶ୍ଳେଷଣ ଓ ପ୍ରଗତି ରିପୋର୍ଟ' : 'Analytics & Progress Reports',
      path: '/mobile/reports',
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 hover:bg-cyan-100/80',
      border: 'border-cyan-100',
      badge: 'Live Data',
    },
    {
      icon: <LuBuilding2 className="w-6 h-6" />,
      label: t('dashboard.funds'),
      description: isOd ? 'ବିଧାୟକ ପାଣ୍ଠି ଓ ବ୍ୟୟ ଟ୍ରାକିଂ' : 'MLALAD Funds & Budget Tracking',
      path: '/mobile/funds',
      color: 'text-orange-500',
      bg: 'bg-orange-50 hover:bg-orange-100/80',
      border: 'border-orange-100',
      badge: '₹1.8 Cr',
    },
    {
      icon: <LuShieldAlert className="w-6 h-6" />,
      label: isOd ? 'ଏସ୍କାଲେସନ୍' : 'Escalations',
      description: isOd ? 'ଜରୁରୀ ସମସ୍ୟା ଓ ନିରୀକ୍ଷଣ' : 'Priority Grievances Tracker',
      path: '/mobile/escalation',
      color: 'text-rose-500',
      bg: 'bg-rose-50 hover:bg-rose-100/80',
      border: 'border-rose-100',
      badge: '2 Critical',
    },
  ];

  const desktopTodaySchedule = [
    {
      time: '10:00 AM',
      title: isOd ? 'ଜନସାଧାରଣଙ୍କ ସହିତ ଅଭିଯୋଗ ଶୁଣାଣି' : 'Public Grievance Redressal Session',
      location: 'Korei Camp Office',
      status: 'Ongoing',
    },
    {
      time: '01:30 PM',
      title: isOd ? 'ବାଳିପାଟଣା ଗ୍ରାମ୍ୟ ଉନ୍ନୟନ କାର୍ଯ୍ୟ ନିରୀକ୍ଷଣ' : 'Balipatna Road Project Field Inspection',
      location: 'Balipatna GP',
      status: 'Upcoming',
    },
    {
      time: '04:30 PM',
      title: isOd ? 'ବ୍ଲକ କାର୍ଯ୍ୟକର୍ତ୍ତା ଓ ସଂଯୋଜକ ସମୀକ୍ଷା ବୈଠକ' : 'Block Coordinators Review Meeting',
      location: 'Block Hall, Korei',
      status: 'Upcoming',
    },
  ];

  const desktopRecentActivities = [
    {
      title: isOd ? 'ୱାର୍ଡ ୧୨ ରାସ୍ତା ନିର୍ମାଣ ଅଭିଯୋଗ' : 'Road issue reported in Ward 12',
      area: 'Balipatna GP',
      time: '2h ago',
      type: 'alert' as const,
    },
    {
      title: isOd ? 'ନୂଆଗାଁ ପାନୀୟ ଜଳ ସମସ୍ୟା ସମାଧାନ' : 'Drinking water pipeline restored',
      area: 'Nuagaon GP',
      time: '5h ago',
      type: 'success' as const,
    },
    {
      title: isOd ? 'କୋରେଇ ମାର୍କେଟ ଡ୍ରେନେଜ କାର୍ଯ୍ୟ ଆଦେଶ' : 'Drainage work order sanctioned',
      area: 'Korei Market',
      time: '1d ago',
      type: 'info' as const,
    },
  ];

  const desktopWorkProjects = [
    {
      title: isOd ? 'ବାଳିପାଟଣା ମୁଖ୍ୟ ରାସ୍ତା କଂକ୍ରିଟିକରଣ' : 'Balipatna Main Road Concrete Work',
      budget: '₹45.0 Lakhs',
      progress: 75,
      status: isOd ? 'ଚାଲୁଛି' : 'In Progress',
      color: 'bg-amber-500',
    },
    {
      title: isOd ? 'ୱାର୍ଡ ୪ ସୌର ପାନୀୟ ଜଳ ପ୍ରକଳ୍ପ' : 'Ward 4 Solar Drinking Water Tank',
      budget: '₹18.5 Lakhs',
      progress: 90,
      status: isOd ? 'ପ୍ରାୟ ସମ୍ପୂର୍ଣ୍ଣ' : 'Near Completion',
      color: 'bg-emerald-500',
    },
    {
      title: isOd ? 'କୋରେଇ ବ୍ଲକ କମ୍ୟୁନିଟି ସେଣ୍ଟର ନିର୍ମାଣ' : 'Korei Community Cultural Hall',
      budget: '₹62.0 Lakhs',
      progress: 40,
      status: isOd ? 'ଯୋଜନାଧୀନ' : 'Active Work',
      color: 'bg-blue-500',
    },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* 1. MOBILE VIEWPORT (ORIGINAL PRISTINE MOBILE UI - < lg)      */}
      {/* ============================================================ */}
      <div className="block lg:hidden flex flex-col w-full min-h-screen bg-[#f5f5f5] relative pb-20">
        <main className="flex-1 w-full flex flex-col">

          {/* Hero Banner with Gradient */}
          <div className="bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fb923c] px-4 pt-4 pb-6 rounded-b-[28px]">
            {/* Banner Image */}
            <div className="w-full rounded-2xl overflow-hidden mb-3 shadow-md bg-white border border-white/20">
              <img
                src="/images/webapp-banner.png"
                alt="Korei Sevaka Banner"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[
                { label: t('dashboard.issues'), value: '48', icon: <LuTriangleAlert className="w-4 h-4" />, color: 'bg-white/20' },
                { label: t('dashboard.works'), value: '21', icon: <LuWrench className="w-4 h-4" />, color: 'bg-white/20' },
                { label: t('dashboard.done'), value: '12', icon: <LuCheckCheck className="w-4 h-4" />, color: 'bg-white/20' },
                { label: t('dashboard.funds'), value: '₹1.8Cr', icon: <LuIndianRupee className="w-4 h-4" />, color: 'bg-white/20' },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.color} backdrop-blur-sm rounded-2xl p-2.5 text-center`}>
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <p className="text-white text-sm font-bold leading-none">{stat.value}</p>
                  <p className="text-white/70 text-[9px] font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 -mt-2 space-y-4">

            {/* Quick Actions Grid */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">{t('dashboard.quickActions')}</h3>
              <div className="grid grid-cols-4 gap-3">
                {mobileQuickActions.map((action) => (
                  <Link key={action.label} href={action.path} className="flex flex-col items-center gap-1.5 group">
                    <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center ${action.color} group-active:scale-95 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">{action.label}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Today's Schedule */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">{t('dashboard.todaysSchedule')}</h3>
                <Link href="/mobile/appointments" className="text-[11px] font-semibold text-orange-500">{t('dashboard.viewAll')}</Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('dashboard.meetings'), count: '3', icon: <LuUsers className="w-5 h-5" />, color: 'text-orange-500', bg: 'bg-orange-50' },
                  { label: t('dashboard.fieldVisit'), count: '1', icon: <LuMapPin className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { label: t('dashboard.events'), count: '0', icon: <LuBuilding2 className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-50' },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                    <div className={`${item.color} flex justify-center mb-1.5`}>{item.icon}</div>
                    <p className="text-lg font-bold text-slate-900 leading-none">{item.count}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">{t('dashboard.recentActivity')}</h3>
                <Link href="/mobile/issues" className="text-[11px] font-semibold text-orange-500">{t('dashboard.viewAll')}</Link>
              </div>
              <div className="space-y-2.5">
                {mobileRecentActivities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      activity.type === 'alert' ? 'bg-red-50 text-red-500' :
                      activity.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {activity.type === 'alert' ? <LuTriangleAlert className="w-4 h-4" /> :
                       activity.type === 'success' ? <LuCircleCheck className="w-4 h-4" /> :
                       <LuWrench className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{activity.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{activity.area}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <LuClock className="w-3 h-3 text-slate-300" />
                      <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Issue Overview */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">{t('dashboard.issueOverview')}</h3>
                <Link href="/mobile/issues" className="text-[11px] font-semibold text-orange-500">{t('dashboard.viewAll')}</Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: t('dashboard.inReview'), count: '5', color: 'bg-orange-500' },
                  { label: t('dashboard.dueSoon'), count: '12', color: 'bg-amber-400' },
                  { label: t('dashboard.overdue'), count: '8', color: 'bg-red-500' },
                  { label: t('dashboard.closed'), count: '23', color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-base font-bold text-slate-900">{item.count}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Work Orders */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">{t('dashboard.workOrders')}</h3>
                <Link href="/mobile/work-orders" className="text-[11px] font-semibold text-orange-500">{t('dashboard.viewAll')}</Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('dashboard.inPlanning'), count: '4', color: 'text-orange-500', bg: 'bg-orange-50' },
                  { label: t('dashboard.inProgress'), count: '7', color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: t('dashboard.completed'), count: '9', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                    <p className={`text-lg font-bold ${item.color} leading-none`}>{item.count}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-4" />
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {/* ============================================================ */}
      {/* 2. DESKTOP / LAPTOP EXECUTIVE WORKSPACE (>= lg)              */}
      {/* ============================================================ */}
      <div className="hidden lg:flex flex-col w-full min-h-screen bg-slate-50 relative pb-12">
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-6 space-y-7">

          {/* Panoramic Hero Banner */}
          <div className="w-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm bg-white border border-slate-200/80">
            <img
              src="/images/webapp-banner.png"
              alt="Korei Sevaka Banner"
              className="w-full h-auto block"
            />
          </div>

          {/* Dedicated Compact KPI Stats Section (Reduced Height) */}
          <section className="grid grid-cols-4 gap-3.5">
            {[
              {
                label: t('dashboard.issues'),
                value: '48',
                sub: isOd ? '୧୨ ସମାଧାନ ହୋଇଛି' : '12 Resolved',
                icon: <LuTriangleAlert className="w-5 h-5 text-red-500" />,
                bg: 'bg-red-50',
                border: 'border-red-100',
                href: '/mobile/issues',
              },
              {
                label: t('dashboard.works'),
                value: '21',
                sub: isOd ? '୭ ଚାଲୁଅଛି' : '7 Ongoing',
                icon: <LuWrench className="w-5 h-5 text-blue-500" />,
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                href: '/mobile/work-orders',
              },
              {
                label: isOd ? 'ଆଜିର ଭ୍ରମଣ / ସାକ୍ଷାତ' : "Today's Schedule",
                value: '3',
                sub: isOd ? '୧ କ୍ଷେତ୍ର ପରିଦର୍ଶନ' : '1 Field Visit',
                icon: <LuCalendarDays className="w-5 h-5 text-violet-500" />,
                bg: 'bg-violet-50',
                border: 'border-violet-100',
                href: '/mobile/appointments',
              },
              {
                label: t('dashboard.funds'),
                value: '₹1.8 Cr',
                sub: isOd ? '୬୭% ବ୍ୟବହୃତ' : '67% Disbursed',
                icon: <LuIndianRupee className="w-5 h-5 text-emerald-500" />,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                href: '/mobile/funds',
              },
            ].map((stat, idx) => (
              <Link
                key={idx}
                href={stat.href}
                className="bg-white hover:bg-slate-50/80 rounded-2xl p-3.5 shadow-xs border border-slate-200/80 hover:border-orange-200/80 transition-all group flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-black text-slate-900 leading-none tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-1 truncate">
                      {stat.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {stat.sub}
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-orange-50 text-slate-400 group-hover:text-orange-600 flex items-center justify-center shrink-0 transition-colors">
                  <LuArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </section>

          {/* Desktop 2-Column Grid */}
          <div className="grid grid-cols-12 gap-7 items-start">

            {/* Left 8-col Column */}
            <div className="col-span-8 space-y-6">

              {/* Quick Actions Panel */}
              <section className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {t('dashboard.quickActions')}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {isOd ? 'ନିର୍ବାଚନ ମଣ୍ଡଳୀ କାର୍ଯ୍ୟ ପରିଚାଳନା ପାଇଁ ସର୍ଟକଟ୍' : 'Constituency management shortcuts & modules'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                    <LuSparkles className="w-3 h-3" />
                    {isOd ? 'ଦ୍ରୁତ ସେବା' : 'Quick Access'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {desktopQuickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.path}
                      className={`group relative flex flex-col p-4 rounded-2xl border ${action.border} ${action.bg} transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-11 h-11 rounded-xl bg-white shadow-2xs flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
                          {action.badge}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                        {action.label}
                      </span>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {action.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Grievance / Issues Overview */}
              <section className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {t('dashboard.issueOverview')}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {isOd ? 'ନାଗରିକ ଅଭିଯୋଗ ସ୍ଥିତି ଓ ସମାଧାନ ପ୍ରଗତି' : 'Citizen grievances lifecycle and resolution track'}
                    </p>
                  </div>
                  <Link
                    href="/mobile/issues"
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    {t('dashboard.viewAll')}
                    <LuArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-3.5 mb-4">
                  {[
                    { label: t('dashboard.inReview'), count: '5', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                    { label: t('dashboard.dueSoon'), count: '12', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
                    { label: t('dashboard.overdue'), count: '8', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                    { label: t('dashboard.closed'), count: '23', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-2xl p-3.5 ${item.bg} border ${item.border} text-center`}>
                      <p className={`text-2xl font-black ${item.color} leading-none`}>
                        {item.count}
                      </p>
                      <p className="text-xs font-bold text-slate-700 mt-1.5">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <LuCircleCheck className="w-4 h-4 text-emerald-500" />
                      {isOd ? 'ସାମଗ୍ରିକ ସମାଧାନ ହାର (Resolution Rate)' : 'Overall Resolution Efficiency'}
                    </span>
                    <span className="text-emerald-600 font-extrabold">78.5% Solved</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '55%' }} />
                    <div className="h-full bg-orange-500" style={{ width: '25%' }} />
                    <div className="h-full bg-red-500 rounded-r-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </section>

              {/* Work Orders */}
              <section className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {t('dashboard.workOrders')}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {isOd ? 'ନିର୍ବାଚନ ମଣ୍ଡଳୀର ମୁଖ୍ୟ ଭିତ୍ତିଭୂମି ପ୍ରକଳ୍ପ' : 'Key ongoing infrastructure & development projects'}
                    </p>
                  </div>
                  <Link
                    href="/mobile/work-orders"
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    {t('dashboard.viewAll')}
                    <LuArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {desktopWorkProjects.map((project, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black text-slate-900 truncate">
                            {project.title}
                          </span>
                          <span className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>Budget: <strong className="text-slate-800">{project.budget}</strong></span>
                          <span>•</span>
                          <span>Progress: <strong className="text-orange-600">{project.progress}%</strong></span>
                        </div>
                      </div>

                      <div className="w-48 shrink-0">
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${project.color} rounded-full transition-all`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Geographic Coverage */}
              <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <LuLayers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {isOd ? 'କୋରେଇ ନିର୍ବାଚନ ମଣ୍ଡଳୀ ଜନସଂଖ୍ୟା ଓ ଗଠନ' : 'Korei Constituency Geographic & Cadre Coverage'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isOd ? '୨୨ ଗ୍ରାମ ପଞ୍ଚାୟତ, ୧୮ ୱାର୍ଡ, ୨୪୨ ବୁଥ୍' : '22 Gram Panchayats • 18 Urban Wards • 242 Polling Booths'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/mobile/hierarchy"
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    {isOd ? 'ସଂଗଠନ ଦେଖନ୍ତୁ' : 'View Network'}
                    <LuArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: isOd ? 'ଗ୍ରାମ ପଞ୍ଚାୟତ' : 'Gram Panchayats', count: '22 GPs', icon: '🏛️' },
                    { label: isOd ? 'ସହରାଞ୍ଚଳ ୱାର୍ଡ' : 'Urban Wards', count: '18 Wards', icon: '🏢' },
                    { label: isOd ? 'ପୋଲିଂ ବୁଥ୍' : 'Polling Booths', count: '242 Booths', icon: '🗳️' },
                    { label: isOd ? 'ମୋଟ ଜନସଂଖ୍ୟା' : 'Voters / Citizens', count: '1.92 Lakhs', icon: '👥' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                      <span className="text-base">{item.icon}</span>
                      <p className="text-lg font-black text-white mt-1 leading-none">{item.count}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right 4-col Column */}
            <div className="col-span-4 space-y-6">

              {/* Today's Schedule Card */}
              <section className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <LuCalendarDays className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      {t('dashboard.todaysSchedule')}
                    </h3>
                  </div>
                  <Link href="/mobile/appointments" className="text-xs font-bold text-orange-600 hover:text-orange-700">
                    {t('dashboard.viewAll')}
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {desktopTodaySchedule.map((item, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                          {item.time}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mt-1">
                        <LuMapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/mobile/appointments"
                  className="mt-3 w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LuCalendarDays className="w-3.5 h-3.5" />
                  {isOd ? '+ ନୂଆ କାର୍ଯ୍ୟସୂଚୀ ଯୋଡନ୍ତୁ' : '+ Add Schedule / Tour'}
                </Link>
              </section>

              {/* Recent Activity */}
              <section className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <LuClock className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      {t('dashboard.recentActivity')}
                    </h3>
                  </div>
                  <Link href="/mobile/issues" className="text-xs font-bold text-orange-600 hover:text-orange-700">
                    {t('dashboard.viewAll')}
                  </Link>
                </div>

                <div className="space-y-3">
                  {desktopRecentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        activity.type === 'alert' ? 'bg-red-50 text-red-500' :
                        activity.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        {activity.type === 'alert' ? <LuTriangleAlert className="w-4 h-4" /> :
                         activity.type === 'success' ? <LuCircleCheck className="w-4 h-4" /> :
                         <LuWrench className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 font-medium">{activity.area}</span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Priority Escalations */}
              <section className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-5 border border-rose-200/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                    <LuShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-rose-900">
                      {isOd ? 'ଜରୁରୀ ଏସ୍କାଲେସନ୍ (2)' : 'Priority Escalations (2)'}
                    </h4>
                    <p className="text-[10px] text-rose-700">
                      {isOd ? 'ତୁରନ୍ତ ବିଧାୟକ ହସ୍ତକ୍ଷେପ ଆବଶ୍ୟକ' : 'Requires immediate MLA office review'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 mb-3 bg-white/70 p-2.5 rounded-xl border border-rose-100">
                  {isOd
                    ? 'କୋରେଇ ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ଆମ୍ବୁଲାନ୍ସ ରୋଡ ବ୍ଲକେଜ ଓ ୱାର୍ଡ ୭ ବିଦ୍ୟୁତ୍ ଟ୍ରାନ୍ସଫର୍ମର ସମସ୍ୟା।'
                    : 'Hospital emergency road blockage and Ward 7 transformer replacement pending.'}
                </p>
                <Link
                  href="/mobile/escalation"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  {isOd ? 'ଏସ୍କାଲେସନ୍ ସମାଧାନ କରନ୍ତୁ' : 'Review & Resolve Escalations'}
                  <LuArrowRight className="w-3.5 h-3.5" />
                </Link>
              </section>

              {/* Camp Helpline */}
              <section className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                  {isOd ? 'ବିଧାୟକ କ୍ୟାମ୍ପ ଅଫିସ୍ ସମ୍ପର୍କ' : 'MLA Camp Office Helpline'}
                </h4>
                <div className="space-y-2">
                  <a
                    href="tel:+919437012345"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <LuPhone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Camp Office Coordinator</p>
                      <p className="leading-none text-slate-900">+91 94370 12345</p>
                    </div>
                  </a>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
