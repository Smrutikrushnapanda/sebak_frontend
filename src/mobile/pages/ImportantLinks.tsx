'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';


interface DirectoryItem {
  id: string;
  type: 'emergency' | 'portal' | 'admin';
  title: string;
  subtitle: string;
  badge: string;
  phone?: string;
  url?: string;
  description?: string;
  keywords: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const emergencyHelplines: DirectoryItem[] = [
  {
    id: 'helpline-1',
    type: 'emergency',
    title: 'Korei Police Station',
    subtitle: 'IIC Korei Desk • 24/7 Patrol',
    badge: 'Law & Order',
    phone: '112',
    keywords: 'police iic korei 112 emergency crime station law order',
    icon: 'local_police',
    iconBg: 'bg-[#ffdad6]',
    iconColor: 'text-[#ba1a1a]',
  },
  {
    id: 'helpline-2',
    type: 'emergency',
    title: 'CHC Korei Ambulance',
    subtitle: 'Community Health Centre Unit',
    badge: 'Critical Care',
    phone: '108',
    keywords: 'chc ambulance hospital medical korei health doctor 108 emergency',
    icon: 'emergency',
    iconBg: 'bg-[#ffdad6]',
    iconColor: 'text-[#ba1a1a]',
  },
  {
    id: 'helpline-3',
    type: 'emergency',
    title: 'Fire & Emergency Services',
    subtitle: 'Jajpur Road Station Response',
    badge: 'Fire Rescue',
    phone: '101',
    keywords: 'fire rescue jajpur road emergency 101 disaster safety',
    icon: 'local_fire_department',
    iconBg: 'bg-[#ffddb8]',
    iconColor: 'text-[#855300]',
  },
  {
    id: 'helpline-4',
    type: 'emergency',
    title: 'Women & Child Helpline',
    subtitle: 'Toll-free: 181 / 1098',
    badge: 'Safety Desk',
    phone: '181',
    keywords: 'women child helpline safety 181 1098 protection family',
    icon: 'shield_with_heart',
    iconBg: 'bg-[#ffdbcb]',
    iconColor: 'text-[#9f4200]',
  },
  {
    id: 'helpline-5',
    type: 'emergency',
    title: 'RWSS Drinking Water',
    subtitle: 'Grievance Control • 1916',
    badge: 'Water Supply',
    phone: '1916',
    keywords: 'rwss drinking water pipe grievance control 1916 tube well supply',
    icon: 'water_drop',
    iconBg: 'bg-[#e2e7ff]',
    iconColor: 'text-[#9f4200]',
  },
];

const statePortals: DirectoryItem[] = [
  {
    id: 'portal-1',
    type: 'portal',
    title: 'Mo Sarkar Citizen Grievance',
    subtitle: 'Government of Odisha',
    badge: '5T Verified',
    url: 'https://mosarkar.odisha.gov.in',
    description: 'Direct 5T grievance registration and governance accountability rating system.',
    keywords: 'mo sarkar citizen grievance odisha governance feedback hospital police 5t',
    icon: 'how_to_reg',
    iconBg: 'bg-[#6ffbbe]',
    iconColor: 'text-[#006c49]',
  },
  {
    id: 'portal-2',
    type: 'portal',
    title: 'e-Panchayat & PALLI SABHA',
    subtitle: 'Rural Development & Panchayati Raj',
    badge: 'Rural Works',
    url: 'https://panchayat.odisha.gov.in',
    description: 'Track resolution minutes, village development works, and GP fund allocations.',
    keywords: 'e-panchayat palli sabha monitoring gram panchayat village meeting korei works',
    icon: 'groups',
    iconBg: 'bg-[#ffddb8]',
    iconColor: 'text-[#855300]',
  },
  {
    id: 'portal-3',
    type: 'portal',
    title: 'Kalia & PM-Kisan DBT Portal',
    subtitle: 'Farmer Welfare Direct Transfer',
    badge: 'DBT Grants',
    url: 'https://kalia.odisha.gov.in',
    description: 'Check DBT installment sanction lists, land seed aid, and Aadhaar seeding status.',
    keywords: 'kalia pm kisan dbt portal agriculture farmer krushak subsidy assistance',
    icon: 'agriculture',
    iconBg: 'bg-[#ffdbcb]',
    iconColor: 'text-[#9f4200]',
  },
  {
    id: 'portal-4',
    type: 'portal',
    title: 'OSDMA Early Warning System',
    subtitle: 'Odisha State Disaster Management Authority',
    badge: 'Flood Alert',
    url: 'https://osdma.org',
    description: 'Baitarani river warning levels, flash flood advisories, and cyclone shelters.',
    keywords: 'osdma disaster management flood cyclone weather alert jajpur baitarani rain',
    icon: 'crisis_alert',
    iconBg: 'bg-[#ffdad6]',
    iconColor: 'text-[#ba1a1a]',
  },
];

const adminOffices: DirectoryItem[] = [
  {
    id: 'admin-1',
    type: 'admin',
    title: 'Block Development Office (BDO)',
    subtitle: 'Panikoili, Korei Block HQ',
    badge: 'Office Hours',
    phone: '06726244222',
    description: '10:00 AM - 5:30 PM (Mon-Sat)',
    keywords: 'bdo block development office korei panikoili admin mgnrega आवास',
    icon: 'domain',
    iconBg: 'bg-[#e2e7ff]',
    iconColor: 'text-[#131b2e]',
  },
  {
    id: 'admin-2',
    type: 'admin',
    title: 'Tahasildar Office Korei',
    subtitle: 'Land Records, RoR & Certificates',
    badge: 'Revenue',
    phone: '06726244210',
    description: '10:00 AM - 5:00 PM (Revenue Desk)',
    keywords: 'tahasildar tehsil revenue land records patta certificate korei mutation',
    icon: 'history_edu',
    iconBg: 'bg-[#e2e7ff]',
    iconColor: 'text-[#131b2e]',
  },
  {
    id: 'admin-3',
    type: 'admin',
    title: 'District Collectorate Jajpur',
    subtitle: 'District HQ Grievance & Citizen Cell',
    badge: 'District Apex',
    phone: '06728222001',
    description: 'Citizen Toll-Free Helpline',
    keywords: 'district collectorate jajpur magistrate grievance helpline collector dcm',
    icon: 'location_city',
    iconBg: 'bg-[#e2e7ff]',
    iconColor: 'text-[#131b2e]',
  },
];

const bottomNavItems: { label: string; icon: string; path: string; active?: boolean }[] = [
  { label: 'Home', icon: 'dashboard', path: '/mobile/dashboard' },
  { label: 'Issues', icon: 'warning', path: '/mobile/issues' },
  { label: 'Works', icon: 'build', path: '/mobile/work-orders' },
  { label: 'Appts', icon: 'calendar_today', path: '/mobile/appointments' },
  { label: 'More', icon: 'grid_view', path: '/mobile/more' },
];

export default function ImportantLinks() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEmergency = useMemo(() => {
    if (!searchQuery.trim()) return emergencyHelplines;
    const q = searchQuery.toLowerCase();
    return emergencyHelplines.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredPortals = useMemo(() => {
    if (!searchQuery.trim()) return statePortals;
    const q = searchQuery.toLowerCase();
    return statePortals.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredAdmin = useMemo(() => {
    if (!searchQuery.trim()) return adminOffices;
    const q = searchQuery.toLowerCase();
    return adminOffices.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalMatches = filteredEmergency.length + filteredPortals.length + filteredAdmin.length;

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
                <button aria-label="Switch to English" className="px-2.5 py-1 rounded-full bg-[#ff7722] text-white leading-none">EN</button>
                <button aria-label="Switch to Odia" className="px-2.5 py-1 rounded-full text-[#584237] leading-none">ଓଡ଼ିଆ</button>
              </div>
              <button aria-label="Notifications" className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#584237] hover:bg-[#e2e7ff] transition-colors">
                <span className="material-symbols-outlined text-2xl">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#faf8ff]"></span>
              </button>
              <div className="relative flex items-center justify-center">
                <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ff7722]" src="https://lh3.googleusercontent.com/aida/AEtjO1U1Kx_eScSQYJs2VSC9t6JtflN0nRVU9CbFLUo5WVxp79LpXdakHZySIcm_hCLy4mbk1cgF3zhhQWpdF2YLA9lZFH_TPu7oo708acj_7yt16QXcphY6eIAhCo35rObsvjF8TJmwpfzZuFEUi_mnbcmsy-ZJodUSYYpCeURiZy7v9LtwRSZOBJQ9t3kE8liF3hHgGOuFTwK9-UmFvqNQQc9Ks8WwF1DFNtJTGD3XZk1tM1oIdVQUmHdSbi727uL6kaIyhmPzyc6DnQ" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#006c49] ring-2 ring-[#faf8ff]"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Mobile Body */}
        <main className="flex-1 flex flex-col relative w-full pt-16 max-w-md mx-auto px-4 pb-8">
          <div className="flex flex-col w-full pb-6 gap-5">
            {/* Top Greeting & Search Header */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9f4200] font-bold uppercase tracking-wider">Help &amp; Governance</span>
                  <h2 className="text-xl font-bold text-[#131b2e]">Constituency &amp; Govt Portals</h2>
                </div>
                <div className="flex items-center gap-1 bg-[#e2e7ff] px-2.5 py-1 rounded-full text-[#584237]">
                  <span className="material-symbols-outlined text-sm text-[#006c49]">verified_user</span>
                  <span className="text-xs font-semibold">24x7 Seva</span>
                </div>
              </div>
              <p className="text-xs text-[#584237]">
                Verified emergency desks, administrative blocks, and welfare direct portals for Korei Constituency.
              </p>

              {/* Interactive Search Bar */}
              <div className="relative w-full mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  type="text"
                  placeholder="Search police, hospital, KALIA, BDO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-3 bg-white rounded-xl text-xs font-medium text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 shadow-xs border border-slate-200/80"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Section 1: Quick Emergency Helplines */}
            {filteredEmergency.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></div>
                    <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wide">Quick Emergency Helplines</h3>
                  </div>
                  <span className="text-[10px] bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-full font-bold">
                    Priority One-Tap
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {filteredEmergency.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-3 shadow-xs flex flex-col gap-2 relative overflow-hidden border border-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center ${item.iconColor} shrink-0`}>
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#131b2e]">{item.title}</span>
                            <span className="text-[10px] text-[#584237]">{item.subtitle}</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#e2e7ff] text-[#584237] px-2 py-0.5 rounded-md font-semibold">
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-[#584237]">
                          <span className="material-symbols-outlined text-sm text-[#ff7722]">call</span>
                          <span className="text-xs font-bold text-[#131b2e]">{item.phone}</span>
                        </div>
                        <a
                          href={`tel:${item.phone}`}
                          className="flex items-center gap-1 bg-[#ff7722] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-transform"
                        >
                          <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                          <span>Call Now</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Highlight Banner: Odisha Seva Sankalpa */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#ff7722] to-[#855300] p-4 shadow-md text-white flex items-center justify-between">
              <div className="flex flex-col gap-1 z-10 max-w-[75%]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdbcb]">Jan Sunani • Korei</span>
                <h4 className="text-sm font-bold leading-tight">Direct Citizen Support at your Fingertips</h4>
                <p className="text-[11px] text-[#ffdbcb] mt-0.5">Always connect via dedicated constituency desk for escalated matters.</p>
              </div>
              <div className="z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-white">support_agent</span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-32 opacity-15 pointer-events-none flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-white">account_balance</span>
              </div>
            </div>

            {/* Section 2: State & Central Portals */}
            {filteredPortals.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#9f4200] text-xl">language</span>
                    <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wide">State &amp; Central Portals</h3>
                  </div>
                  <span className="text-[10px] text-[#584237] font-semibold">Official Web Portals</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {filteredPortals.map((portal) => (
                    <a
                      key={portal.id}
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl p-3.5 shadow-xs flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors border border-slate-100 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${portal.iconBg} flex items-center justify-center ${portal.iconColor} shrink-0 mt-0.5`}>
                          <span className="material-symbols-outlined text-xl">{portal.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#ff7722] transition-colors">
                              {portal.title}
                            </span>
                            <span className="material-symbols-outlined text-xs text-[#006c49]">check_circle</span>
                          </div>
                          <span className={`text-[10px] font-semibold ${portal.iconColor}`}>{portal.subtitle}</span>
                          <p className="text-[11px] text-[#584237] mt-1 leading-snug">{portal.description}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-[#ff7722] transition-colors shrink-0">
                        open_in_new
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Administration Directory */}
            {filteredAdmin.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#9f4200] text-xl">apartment</span>
                    <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wide">Constituency Administration</h3>
                  </div>
                  <span className="text-[10px] text-[#584237] font-semibold">Local Offices</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {filteredAdmin.map((admin) => (
                    <div key={admin.id} className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-2 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#131b2e] shrink-0">
                            <span className="material-symbols-outlined text-xl">{admin.icon}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#131b2e]">{admin.title}</span>
                            <span className="text-[10px] text-[#584237]">{admin.subtitle}</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#e2e7ff] text-[#584237] px-2 py-0.5 rounded-md font-semibold">
                          {admin.badge}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 text-[#584237] text-[11px]">
                          <span className="material-symbols-outlined text-xs text-[#006c49]">schedule</span>
                          <span>{admin.description}</span>
                        </div>
                        <a
                          href={`tel:${admin.phone}`}
                          className="flex items-center gap-1 bg-[#e2e7ff] text-[#ff7722] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#ff7722] hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">call</span>
                          <span>{admin.phone}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Search State */}
            {totalMatches === 0 && (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-[#e2e7ff] flex items-center justify-center text-slate-400 mb-3">
                  <span className="material-symbols-outlined text-3xl">search_off</span>
                </div>
                <h4 className="text-sm font-bold text-[#131b2e]">No contacts found</h4>
                <p className="text-xs text-[#584237] max-w-xs mt-1">
                  Try searching with other keywords like 'Ambulance', 'Water', 'BDO', or 'Disaster'.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#ff7722] text-white font-bold text-xs shadow-xs"
                >
                  Show All Portals &amp; Numbers
                </button>
              </div>
            )}

            {/* Bottom Informational Note */}
            <div className="rounded-xl bg-[#f2f3ff] p-3.5 flex items-start gap-3 text-[#584237] border border-slate-200/60">
              <span className="material-symbols-outlined text-[#9f4200] text-xl mt-0.5">info</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-[#131b2e]">Constituency Verification Note</span>
                <p className="text-[11px] leading-relaxed">
                  All department numbers are synchronized with the Jajpur District NIC registry. For MLA Camp Office escort for urgent patient referrals, please register an issue on the Home tab.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
          <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex-1 min-w-[44px] h-11 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  item.active ? 'text-[#ff7722] font-bold' : 'text-[#584237] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-[10px] leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* DESKTOP VIEW (719px AND ABOVE) */}
      <div className="max-[718px]:hidden space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Verified Government Directory</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">24x7 Korei Sevaka Desk</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Constituency &amp; Govt Direct Portals Desk
            </h1>
          </div>

          <div className="relative min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search police, hospital, BDO, KALIA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </div>

        {/* Desktop Emergency Grid */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Emergency Helplines &amp; 24/7 Response Units</h3>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
              Priority One-Tap Dial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredEmergency.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-600">{item.badge}</span>
                    <span className="text-xs font-mono font-bold text-slate-700">{item.phone}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.subtitle}</p>
                </div>
                <a
                  href={`tel:${item.phone}`}
                  className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-xl text-center hover:bg-orange-700 block"
                >
                  Call {item.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop State Portals Grid */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">State &amp; Central Government Web Portals</h3>
            <span className="text-xs font-bold text-orange-600">Official Portals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPortals.map((portal) => (
              <a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-3 hover:border-orange-500 transition-colors group"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-700">{portal.subtitle}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-orange-600">{portal.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{portal.description}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-600 text-lg shrink-0">
                  open_in_new
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Administration Offices */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Local Administration Offices Directory</h3>
            <span className="text-xs font-semibold text-slate-600">Korei &amp; Jajpur HQ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredAdmin.map((admin) => (
              <div key={admin.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">{admin.badge}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{admin.title}</h4>
                  <p className="text-xs text-slate-500">{admin.subtitle}</p>
                  <p className="text-[11px] text-slate-400 mt-2">{admin.description}</p>
                </div>
                <a
                  href={`tel:${admin.phone}`}
                  className="w-full py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl text-center hover:bg-slate-200 block"
                >
                  Call {admin.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
