'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useGrievanceSso } from '@/components/sso/use-grievance-sso';
import { PortalLoading } from '@/components/layout/portal-loading';
import { PublicLandingPage } from '@/components/layout/public-landing';
import {
  LuBuilding2,
  LuUsers,
  LuMessageCircle,
  LuFolder,
  LuLogOut,
  LuArrowRight,
  LuShieldAlert,
  LuCircleCheck,
  LuSparkles,
} from 'react-icons/lu';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  action?: () => void;
  iconColor: string;
  arrowBg: string;
  arrowColor: string;
  features: string[];
  route: string;
}

const CACHE_KEY = 'sebaka_workspace_cards';

const ALL_DASHBOARDS: DashboardCard[] = [
  {
    id: 'internal',
    title: 'Internal Dashboard',
    description: 'Appointments, field visits, social media and internal team management.',
    badge: 'Operations',
    icon: LuBuilding2,
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    arrowBg: 'bg-blue-50 group-hover:bg-blue-100',
    arrowColor: 'text-blue-600',
    features: ['Appointments', 'Field Visits', 'Social Media'],
    route: '/internal/dashboard',
  },
  {
    id: 'organization',
    title: 'Organization Dashboard',
    description: 'Manage the constituency network, members, roles and permissions.',
    badge: 'Network',
    icon: LuUsers,
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    arrowBg: 'bg-emerald-50 group-hover:bg-emerald-100',
    arrowColor: 'text-emerald-600',
    features: ['Members', 'Designations', 'Key Persons'],
    route: '/dashboard',
  },
  {
    id: 'grievance',
    title: 'Grievance Dashboard',
    description: 'Track, escalate and resolve public grievances end-to-end.',
    badge: 'Citizen',
    icon: LuMessageCircle,
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    arrowBg: 'bg-rose-50 group-hover:bg-rose-100',
    arrowColor: 'text-rose-600',
    features: ['Grievances', 'Resolution', 'Reports'],
    route: '/organization/grievances',
  },
  {
    id: 'project',
    title: 'Project Dashboard',
    description: 'Manage government projects, tasks, progress and delivery reports.',
    badge: 'Projects',
    icon: LuFolder,
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    arrowBg: 'bg-violet-50 group-hover:bg-violet-100',
    arrowColor: 'text-violet-600',
    features: ['Projects', 'Tasks', 'Reports'],
    route: '/organization/projects',
  },
];

export default function DashboardSelectionPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { isOpeningGrievance } = useGrievanceSso();

  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [showNoAccess, setShowNoAccess] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!hasFetched.current) {
      hasFetched.current = true;
      loadCards();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  const loadCards = async () => {
    // Check sessionStorage cache — skip network hit on repeat visits this session
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Omit<DashboardCard, 'icon' | 'action'>[];
        if (parsed.length > 0) {
          const rehydrated = parsed.map((c) => {
            const def = ALL_DASHBOARDS.find((d) => d.id === c.id);
            if (!def) return { ...c, icon: LuBuilding2 };
            return {
              ...c,
              icon: def.icon,
              // Always use current route defs so session cache cannot stale-navigate.
              route: def.route,
              action:
                def.id === 'grievance'
                  ? () => {
                      window.location.href = 'http://localhost:5173/admin/dashboard';
                    }
                  : undefined,
            };
          });
          setCards(rehydrated);
          setLoadingCards(false);
          return;
        }
      } catch { /* ignore bad cache */ }
    }

    try {
      const userData = await ApiClient.get('auth/me');
      const generated = generateCards(userData);
      setCards(generated);
      // Persist without the icon/action functions (not serialisable)
      const serialisable = generated.map(({ icon: _icon, action: _action, ...rest }) => rest);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(serialisable));
    } catch {
      setShowNoAccess(true);
    } finally {
      setLoadingCards(false);
    }
  };

  const withGrievanceAction = (card: DashboardCard): DashboardCard =>
    card.id === 'grievance'
      ? {
          ...card,
          action: () => {
            window.location.href = 'http://localhost:5173/admin/dashboard';
          },
        }
      : card;

  const generateCards = (userData: any): DashboardCard[] => {
    const roleSlug = userData.role?.slug || '';
    const permissions = userData.role?.permissions?.map((p: any) => p.key) || [];
    const isAdmin = roleSlug === 'admin' || roleSlug === 'mla' || roleSlug === 'mla-admin';
    if (isAdmin) return ALL_DASHBOARDS.map(withGrievanceAction);

    const result: DashboardCard[] = [];
    const has = (...keys: string[]) => keys.some((k) => permissions.includes(k));

    if (has('internal:read', 'operations:read')) result.push(ALL_DASHBOARDS[0]);
    if (has('org:read', 'organization:read'))    result.push(ALL_DASHBOARDS[1]);
    if (has('grievance:read', 'grievances:read')) result.push(ALL_DASHBOARDS[2]);
    if (has('project:read', 'projects:read'))    result.push(ALL_DASHBOARDS[3]);

    if (result.length === 0) {
      if (roleSlug === 'mla') return [withGrievanceAction(ALL_DASHBOARDS[0])];
      setShowNoAccess(true);
    }
    return result.map(withGrievanceAction);
  };

  const initials = (user?.fullName || 'U')
    .split(' ').filter(Boolean).slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase()).join('');

  if (isLoading || loadingCards) {
    return <PortalLoading />;
  }

  if (!isAuthenticated) return <PublicLandingPage />;

  if (showNoAccess) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 px-6">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-orange-50">
            <LuShieldAlert className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No Dashboard Access</h3>
          <p className="mt-2 text-sm text-slate-500">
            You don&apos;t have access to any dashboard. Contact your administrator.
          </p>
          <button
            onClick={async () => { await logout(); window.location.href = 'http://localhost:5173/'; }}
            className="mt-6 w-full h-11 rounded-2xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100 overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-100/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-100/30 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0">
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/30 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
                    d="M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6" />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div>
              <h1 className="text-base font-black leading-none tracking-tight text-slate-900">SEBAKA</h1>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">MLA Constituency Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-black text-white shadow-sm">
                {initials}
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-medium text-slate-400">Signed in as</p>
                <p className="text-sm font-bold text-slate-900">{user?.fullName || 'User'}</p>
              </div>
            </div>
            <button
              onClick={async () => { await logout(); window.location.href = 'http://localhost:5173/'; }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shadow-sm"
              aria-label="Sign out"
            >
              <LuLogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-1.5 mb-5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          <span className="text-xs font-bold text-orange-700 tracking-wide">Active Session</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Choose your workspace
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-500 text-sm leading-relaxed">
          Select a dashboard to continue. Access is based on your role and permissions within the constituency portal.
        </p>
      </div>

      {/* Cards grid */}
      <main className="relative mx-auto max-w-6xl px-6 pb-20 pt-8">
        {cards.length === 0 ? (
          <p className="py-16 text-center text-slate-400 font-medium">No dashboards available.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {cards.map((card) => {
              const Icon = card.icon;
              const isGrievanceBusy = card.id === 'grievance' && isOpeningGrievance;
              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={isGrievanceBusy}
                  aria-busy={isGrievanceBusy || undefined}
                  onClick={() => {
                    if (isGrievanceBusy) return;
                    if (card.action) {
                      card.action();
                      return;
                    }
                    ApiClient.ensureAuthCookies();
                    router.push(card.route);
                  }}
                  className={cn(
                    'group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white text-left shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
                    isGrievanceBusy
                      ? 'cursor-wait'
                      : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-200/80',
                  )}
                >
                  {/* Gradient top stripe */}
                  <div className={cn('h-1.5 w-full bg-gradient-to-r', card.gradient)} />

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        'grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                        card.iconBg
                      )}>
                        <Icon className={cn('h-7 w-7', card.iconColor)} />
                      </div>
                      <span className={cn(
                        'rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
                        card.iconBg, card.iconColor
                      )}>
                        {card.badge}
                      </span>
                    </div>

                    <div className="mt-5 space-y-1.5">
                      <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{card.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-500">{card.description}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {card.features.map((f) => (
                        <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          <LuCircleCheck className="h-3 w-3 text-slate-400" />
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex w-full items-center justify-between pt-6">
                      <span className={cn(
                        'text-sm font-bold transition-colors',
                        isGrievanceBusy ? 'text-orange-600' : 'text-slate-700 group-hover:text-orange-600',
                      )}>
                        {isGrievanceBusy ? 'Signing in…' : 'Open dashboard'}
                      </span>
                      <span className={cn(
                        'grid h-9 w-9 place-items-center rounded-full transition-all duration-300',
                        !isGrievanceBusy && 'group-hover:translate-x-1',
                        card.arrowBg, card.arrowColor
                      )}>
                        {isGrievanceBusy ? (
                          <span className="relative h-4 w-4" aria-hidden="true">
                            <span className="absolute inset-0 rounded-full border-2 border-orange-100" />
                            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-orange-500" />
                          </span>
                        ) : (
                          <LuArrowRight className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  {isGrievanceBusy && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                      <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
                        <div className="relative h-12 w-12" aria-hidden="true">
                          <div className="absolute inset-0 rounded-full border-[3px] border-orange-100" />
                          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-orange-500" />
                          <div className="absolute inset-2 rounded-full bg-orange-50 flex items-center justify-center">
                            <LuSparkles className="h-3.5 w-3.5 text-orange-500" />
                          </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                          Signing into Grievance
                        </p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
        <p className="mt-10 text-center text-[11px] text-slate-400 font-medium">
          Contact your administrator to request access to additional dashboards.
        </p>
      </main>
    </div>
  );
}
