'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { useConstituencySettings } from '@/context/settings-context';
import { Button } from '@/components/ui/button';
import {
  LuCalendar,
  LuMapPin,
  LuShare2,
  LuUsers,
  LuArrowRight,
  LuChevronRight,
  LuCircleCheck,
  LuClock,
  LuLayoutGrid,
  LuBell,
  LuSparkles,
  LuActivity,
  LuPlus,
  LuKey,
} from 'react-icons/lu';

/* ─── Stat card config ─── */
interface StatCard {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  value: string | number;
}

/* ─── Quick access card config ─── */
interface QuickCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  gradient: string;
  route: string;
}

const QUICK_CARDS: QuickCard[] = [
  {
    id: 'appointments',
    title: 'Appointments',
    description: 'Schedule and manage constituency appointments.',
    icon: LuCalendar,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600',
    route: '/internal/appointments',
  },
  {
    id: 'field-visits',
    title: 'Field Visit Schedule',
    description: 'Organise and review upcoming field visits.',
    icon: LuMapPin,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-600',
    route: '/internal/visit-schedule',
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Manage and schedule social media activities.',
    icon: LuShare2,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-600',
    route: '/internal/social-media',
  },
  {
    id: 'users-permissions',
    title: 'Users & Permissions',
    description: 'Manage internal users and their access levels.',
    icon: LuKey,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-600',
    route: '/internal/users',
  },
];

export default function InternalDashboardPage() {
  const { user } = useAuth();
  const { settings, representativeType } = useConstituencySettings();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const representativeName = settings?.representativeName || 'Shri Akash Dasnayak';
  const constituencyName = settings?.constituencyName || 'Korei Assembly';
  const userName = user?.fullName || representativeName;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [apptRes, usersRes] = await Promise.allSettled([
          ApiClient.get('appointments', { pageSize: 5, sortBy: 'date', sortDir: 'ASC' }),
          ApiClient.get('users', { pageSize: 1 }),
        ]);

        if (apptRes.status === 'fulfilled') {
          const data = apptRes.value;
          setAppointments(Array.isArray(data) ? data.slice(0, 5) : data?.data?.slice(0, 5) ?? []);
        }
        if (usersRes.status === 'fulfilled') {
          const data = usersRes.value;
          setUserCount(data?.total ?? (Array.isArray(data) ? data.length : null));
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards: StatCard[] = [
    {
      id: 'appointments',
      label: 'Total Appointments',
      sublabel: 'Scheduled meetings',
      icon: LuCalendar,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      value: isLoading ? '—' : appointments.length > 0 ? appointments.length : '—',
    },
    {
      id: 'field-visits',
      label: 'Field Visits',
      sublabel: 'Upcoming visits',
      icon: LuMapPin,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      value: '—',
    },
    {
      id: 'social-media',
      label: 'Social Activities',
      sublabel: 'Pending posts',
      icon: LuShare2,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      value: '—',
    },
    {
      id: 'users',
      label: 'Internal Users',
      sublabel: 'Authorized accounts',
      icon: LuUsers,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      value: isLoading ? '—' : userCount ?? '—',
    },
  ];

  return (
    <div className="space-y-6 pb-10 bg-[#f8fafc] -m-6 p-6 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <LuChevronRight className="w-3 h-3" />
            <span className="text-slate-500">Internal</span>
            <LuChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-bold">Dashboard</span>
          </nav>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Internal Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
              {representativeType || 'MLA'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage internal operations, appointments, field visits and team activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/internal/appointments">
            <Button
              size="sm"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white shadow-sm font-semibold text-xs px-4 py-2 h-auto rounded-xl gap-1.5"
            >
              <LuPlus className="w-4 h-4" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Hero Welcome Banner ── */}
      <div
        className="relative w-full rounded-3xl overflow-hidden shadow-md min-h-[190px] md:min-h-[210px] flex items-center p-6 md:p-8 text-white"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 100%)' }}
      >
        {/* subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="white">
            <circle cx="150" cy="50" r="80" />
            <circle cx="50" cy="150" r="60" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm mb-3 border border-white/30">
            <LuSparkles className="w-3.5 h-3.5" />
            <span>Internal Operations Center</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back,<br />
            <span className="text-blue-200">{userName}</span>
          </h2>
          <p className="text-xs md:text-sm text-white/80 font-medium mt-2 tracking-wide">
            Representative: <span className="font-bold text-white">{representativeName}</span>
            {' · '}Constituency: <span className="font-bold text-white">{constituencyName}</span>
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">{card.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{card.value}</h3>
                <p className="text-[11px] font-medium text-slate-400">{card.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Access ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <LuLayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Quick Access</h2>
              <p className="text-[11px] font-medium text-slate-400">Navigate to key internal modules</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.id} href={card.route}>
                <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  {/* top stripe */}
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${card.gradient}`} />
                  <div className={`w-12 h-12 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{card.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-bold text-slate-500 group-hover:text-orange-600 transition-colors">
                    <span>Open</span>
                    <LuArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Recent Activity + Upcoming Appointments ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <LuActivity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Recent Activity</h3>
              <p className="text-[11px] font-medium text-slate-400">Latest actions in the portal</p>
            </div>
          </div>

          {/* Empty state — no activity API yet */}
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
              <LuBell className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-500">No recent activity</p>
            <p className="text-xs text-slate-400 mt-1">Activity will appear here as actions are performed.</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <LuCalendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Upcoming Appointments</h3>
                <p className="text-[11px] font-medium text-slate-400">Next scheduled meetings</p>
              </div>
            </div>
            <Link href="/internal/appointments" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <LuArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <div className="w-8 h-8 border-[3px] border-blue-100 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                <LuCalendar className="w-7 h-7 text-blue-300" />
              </div>
              <p className="text-sm font-bold text-slate-500">No upcoming appointments</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Schedule your first appointment to get started.</p>
              <Link href="/internal/appointments">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl px-4 py-2 h-auto gap-1.5"
                >
                  <LuPlus className="w-3.5 h-3.5" />
                  New Appointment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {appointments.map((appt, idx) => (
                <div key={appt.id ?? idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <LuClock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {appt.title ?? appt.subject ?? 'Appointment'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {appt.date
                        ? new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Date TBD'}
                      {appt.time ? ` · ${appt.time}` : ''}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                    appt.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-600'
                      : appt.status === 'CANCELLED'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {appt.status ?? 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Users & Roles shortcut bar ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <LuUsers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">User Management</h3>
              <p className="text-[11px] font-medium text-slate-400">Manage internal users and access control</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <Link href="/internal/users" className="group flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LuUsers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Users</p>
                <p className="text-[11px] text-slate-400">View and manage user accounts</p>
              </div>
            </div>
            <LuChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
          <Link href="/internal/roles" className="group flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LuKey className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Roles & Permissions</p>
                <p className="text-[11px] text-slate-400">Configure access control rules</p>
              </div>
            </div>
            <LuChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

    </div>
  );
}
