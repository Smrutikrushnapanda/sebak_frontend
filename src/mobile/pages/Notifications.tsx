'use client';

import React, { useState, useMemo } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


interface NotificationItem {
  id: string;
  category: 'grievance' | 'govt' | 'media';
  unread: boolean;
  highPriority?: boolean;
  badge: string;
  locationOrDept: string;
  timeAgo: string;
  title: string;
  description: string;
  token?: string;
  actionText?: string;
  actionIcon?: string;
  actionBg?: string;
  metaText?: string;
  metaIcon?: string;
  pdfSize?: string;
  circularNo?: string;
  slotStatus?: string;
  photoUrl?: string;
  photoCount?: number;
  stats?: {
    sanctioned: string;
    status: string;
    workNo: string;
  };
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'grievance',
    unread: true,
    highPriority: true,
    badge: 'High Urgency',
    locationOrDept: 'Nuagaon GP',
    timeAgo: '15m ago',
    title: 'Emergency Water Tanker dispatched to Nuagaon Ward 4',
    description: 'Dispatched following major pipeline breach report #KS-2025-074. Executive Engineer RWSS on-site with repair crew.',
    token: '#KS-2025-074',
    actionText: 'View Tracking',
    actionIcon: 'near_me',
    metaText: 'Driver: K. Patra',
    metaIcon: 'verified',
  },
  {
    id: 'notif-2',
    category: 'govt',
    unread: true,
    badge: 'Gazette Order',
    locationOrDept: 'PR & DW Dept',
    timeAgo: '2h ago',
    title: 'State Govt notifies new guidelines for Ama Odisha Nabin Odisha rural connectivity fund',
    description: 'Sanction envelope enhanced for village bridge link roads and cremation shed electrification across 26 Gram Panchayats.',
    actionText: 'Download PDF (2.4 MB)',
    actionIcon: 'download',
    circularNo: 'Circular #4092/PR',
  },
  {
    id: 'notif-3',
    category: 'grievance',
    unread: true,
    badge: 'Confirmed Tour',
    locationOrDept: 'Constituency Office',
    timeAgo: '4h ago',
    title: 'Delegation from Vyasanagar Merchant Association confirmed for Friday 4:00 PM',
    description: 'Agenda: Korei bypass truck terminal proposal and bypass drainage improvements before upcoming monsoon.',
    actionText: 'View Schedule',
    actionIcon: 'calendar_clock',
    slotStatus: 'Slot Locked',
  },
  {
    id: 'notif-4',
    category: 'media',
    unread: false,
    badge: 'Public Outreach',
    locationOrDept: 'Korei Camp Office',
    timeAgo: 'Yesterday',
    title: 'Over 140 villagers participated in Jana Samparka hearing at Korei Camp Office',
    description: '68 individual applications recorded directly into Korei Sevaka portal covering old-age pensions, irrigation pump solarization, and school playgrounds.',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL4do9_zwusYzXQCQIZ0RLtXHN1jm4V6oQ_tp1e5uUNfSToxntRitobDTaHT5b2Hc5URByBGeBiRqvYnH97VO5gYVC1CKrJ672QtTbx3wgc-ooCjzTnnAtfDF4ID4AuqZQu8e5C1_XeQDQJyZHee9SsxQBDnjBRiEig8EiMUQp8K81TERNUJeX2E4GOMUtyhWCxkQop4k0Y_44Jyew1Qq8188kVHzhFG8H1bQNDMPfsF8BObOQ-ic3',
    photoCount: 4,
    actionText: 'Read Summary Report',
    metaText: 'Jan 14, 2025',
  },
  {
    id: 'notif-5',
    category: 'govt',
    unread: false,
    badge: 'Milestone Passed',
    locationOrDept: 'Health Infra',
    timeAgo: '2 days ago',
    title: 'Quality audit approved for CHC Maternity Ward renovation, ready for inauguration',
    description: 'PWD Superintending Engineer issued final structural compliance certificate. 20-bed air-conditioned facility with neonatal monitoring bay.',
    stats: {
      sanctioned: '₹42.50 Lakh',
      status: '100% Ready',
      workNo: 'Work #WO-KOR-881',
    },
    actionText: 'Plan Ceremony',
    actionIcon: 'celebration',
  },
];

export default function Notifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'grievance' | 'govt' | 'media'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allMarkedRead, setAllMarkedRead] = useState<boolean>(false);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    setAllMarkedRead(true);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Filter by category pill
      if (activeFilter === 'unread' && !item.unread) return false;
      if (activeFilter === 'grievance' && item.category !== 'grievance') return false;
      if (activeFilter === 'govt' && item.category !== 'govt') return false;
      if (activeFilter === 'media' && item.category !== 'media') return false;

      // Filter by text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesToken = item.token ? item.token.toLowerCase().includes(q) : false;
        const matchesDept = item.locationOrDept.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesToken || matchesDept;
      }

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  return (
    <>
      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8">
          <div className="flex flex-col w-full pb-6 gap-3">
            {/* Top Bar: Title Context & Mark Read Action */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#131b2e] tracking-tight">Alerts &amp; Updates</h1>
                  {unreadCount > 0 ? (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#ff7722] text-white text-[11px] font-bold">
                      {unreadCount} New
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[11px] font-bold">
                      All Read
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#584237]">ବିଜ୍ଞପ୍ତି ଏବଂ ଜରୁରୀ ସୂଚନା • Korei Constituency</p>
              </div>
              <button
                onClick={handleMarkAllRead}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold select-none transition-all active:scale-95 ${
                  allMarkedRead || unreadCount === 0
                    ? 'bg-[#6ffbbe] text-[#002113]'
                    : 'bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#ff7722]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {allMarkedRead || unreadCount === 0 ? 'check_circle' : 'done_all'}
                </span>
                <span>{allMarkedRead || unreadCount === 0 ? 'All Read' : 'Mark Read'}</span>
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search alerts, G.O., tokens (e.g. #KS-2025)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:bg-[#eaedff] border border-slate-200/60 transition-colors"
              />
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#584237] hover:text-[#131b2e] text-lg p-1 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">tune</span>
              </button>
            </div>

            {/* Segmented Filter Pills (Horizontal Scrollable) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-[#9f4200] text-white shadow-xs'
                    : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeFilter === 'unread'
                    ? 'bg-[#9f4200] text-white shadow-xs'
                    : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                <span>Unread</span>
                <span className="w-2 h-2 rounded-full bg-[#ff7722]"></span>
                <span>({unreadCount})</span>
              </button>
              <button
                onClick={() => setActiveFilter('grievance')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'grievance'
                    ? 'bg-[#9f4200] text-white shadow-xs'
                    : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                Grievances
              </button>
              <button
                onClick={() => setActiveFilter('govt')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'govt'
                    ? 'bg-[#9f4200] text-white shadow-xs'
                    : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                Govt Orders
              </button>
              <button
                onClick={() => setActiveFilter('media')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'media'
                    ? 'bg-[#9f4200] text-white shadow-xs'
                    : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                Press &amp; Media
              </button>
            </div>

            {/* Notification Feed */}
            <div className="flex flex-col gap-3">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-xl bg-white p-3.5 shadow-xs border border-slate-100 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      {item.highPriority ? (
                        <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shadow-inner">
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            fmd_bad
                          </span>
                        </div>
                      ) : item.category === 'govt' ? (
                        <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#9f4200] flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            description
                          </span>
                        </div>
                      ) : item.category === 'media' ? (
                        <div className="w-10 h-10 rounded-xl bg-[#ffddb8] text-[#2a1700] flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">groups</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#6ffbbe] text-[#002113] flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            event_available
                          </span>
                        </div>
                      )}
                      {item.unread && (
                        <span
                          className={`absolute -top-1 -right-1 rounded-full ring-2 ring-white ${
                            item.highPriority ? 'w-3 h-3 bg-[#ba1a1a] animate-pulse' : 'w-2.5 h-2.5 bg-[#ff7722]'
                          }`}
                        ></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              item.highPriority
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : item.badge === 'Confirmed Tour'
                                ? 'bg-[#6ffbbe] text-[#003f29]'
                                : item.badge === 'Public Outreach'
                                ? 'bg-[#ffddb8] text-[#653e00]'
                                : 'bg-[#e2e7ff] text-[#131b2e]'
                            }`}
                          >
                            {item.badge}
                          </span>
                          <span className="text-[11px] text-[#584237]">{item.locationOrDept}</span>
                        </div>
                        <span className="text-[10px] text-[#584237] shrink-0">{item.timeAgo}</span>
                      </div>

                      <h2 className="text-xs font-bold text-[#131b2e] leading-snug mb-1">{item.title}</h2>
                      <p className="text-[11px] text-[#584237] line-clamp-2 mb-2 leading-relaxed">{item.description}</p>

                      {/* Photo Banner if available */}
                      {item.photoUrl && (
                        <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2">
                          <img src={item.photoUrl} alt="Public outreach" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/70 to-transparent flex items-end p-2">
                            <span className="text-[10px] text-white font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">photo_camera</span>
                              {item.photoCount} Photos Captured
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Mini Stats if available */}
                      {item.stats && (
                        <div className="grid grid-cols-2 gap-2 mb-2.5">
                          <div className="p-2 rounded-lg bg-[#f2f3ff] flex flex-col">
                            <span className="text-[10px] text-[#584237]">Sanctioned Outlay</span>
                            <span className="text-xs font-bold text-[#131b2e]">{item.stats.sanctioned}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#f2f3ff] flex flex-col">
                            <span className="text-[10px] text-[#584237]">Status</span>
                            <span className="text-xs font-bold text-[#006c49] flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">verified</span>
                              {item.stats.status}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Embedded Action & Details */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        {item.actionText && (
                          <button
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all ${
                              item.highPriority
                                ? 'bg-[#ff7722] text-white hover:brightness-105'
                                : 'bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd]'
                            }`}
                          >
                            {item.actionIcon && (
                              <span className="material-symbols-outlined text-sm">{item.actionIcon}</span>
                            )}
                            <span>{item.actionText}</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1 text-[#584237] text-[11px]">
                          {item.metaIcon && (
                            <span className="material-symbols-outlined text-sm text-[#006c49]">{item.metaIcon}</span>
                          )}
                          {item.metaText && <span>{item.metaText}</span>}
                          {item.circularNo && <span className="font-medium text-slate-500">{item.circularNo}</span>}
                          {item.slotStatus && <span className="font-bold text-[#006c49]">{item.slotStatus}</span>}
                          {item.stats && <span className="font-medium text-slate-500">{item.stats.workNo}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* End of Feed Warm Anchor / Delight Card */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f2f3ff] text-center mt-2 gap-1.5 border border-slate-200/60">
              <div className="w-8 h-8 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#9f4200]">
                <span className="material-symbols-outlined text-lg">all_inbox</span>
              </div>
              <span className="text-xs font-bold text-[#131b2e]">You are completely up to date!</span>
              <p className="text-[11px] text-[#584237] max-w-xs leading-relaxed">
                ଆପଣଙ୍କର ସମସ୍ତ ସୂଚନା ସମୀକ୍ଷା ହୋଇସାରିଛି। Emergency escalations continue 24/7.
              </p>
            </div>
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {/* DESKTOP VIEW (719px AND ABOVE) */}
      <div className="max-[718px]:hidden space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Constituency Notification Center</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">24x7 Seva Broadcast</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Alerts &amp; Official Updates
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Search alerts, G.O., tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          {(['all', 'unread', 'grievance', 'govt', 'media'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setActiveFilter(filterKey)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                activeFilter === filterKey
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filterKey === 'all'
                ? `All Notifications (${notifications.length})`
                : filterKey === 'unread'
                ? `Unread (${unreadCount})`
                : filterKey === 'grievance'
                ? 'Grievances'
                : filterKey === 'govt'
                ? 'Govt Orders'
                : 'Press & Media'}
            </button>
          ))}
        </div>

        {/* Desktop Notifications Feed Grid */}
        <div className="space-y-4">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      item.highPriority
                        ? 'bg-rose-100 text-rose-700'
                        : item.category === 'govt'
                        ? 'bg-orange-100 text-orange-700'
                        : item.category === 'media'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {item.highPriority ? 'fmd_bad' : item.category === 'govt' ? 'description' : 'groups'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">{item.badge}</span>
                      <span className="text-xs text-slate-400">• {item.locationOrDept}</span>
                      <span className="text-xs text-slate-400">• {item.timeAgo}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{item.description}</p>

                    {item.stats && (
                      <div className="flex items-center gap-4 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 block">Outlay</span>
                          <span className="font-bold text-slate-800">{item.stats.sanctioned}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Status</span>
                          <span className="font-bold text-emerald-700">{item.stats.status}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Reference</span>
                          <span className="font-medium text-slate-600">{item.stats.workNo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {item.actionText && (
                  <button className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shrink-0">
                    {item.actionText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
