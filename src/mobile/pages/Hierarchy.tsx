'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';


interface GpUnit {
  id: string;
  name: string;
  zone: string;
  zoneType: 'zone1' | 'zone2' | 'urban';
  president: string;
  booths: number;
  cadres: number;
  progress: number;
  phone: string;
  searchData: string;
}

const gpUnitsData: GpUnit[] = [
  {
    id: 'gp-1',
    name: 'Balipatna GP',
    zone: 'Zone 1',
    zoneType: 'zone1',
    president: 'Rameshwar Jena',
    booths: 12,
    cadres: 45,
    progress: 88,
    phone: '+919800000010',
    searchData: 'balipatna rameshwar jena zone 1',
  },
  {
    id: 'gp-2',
    name: 'Nuagaon GP',
    zone: 'Zone 2',
    zoneType: 'zone2',
    president: 'Smt. Pravati Sahoo',
    booths: 10,
    cadres: 38,
    progress: 76,
    phone: '+919800000011',
    searchData: 'nuagaon pravati sahoo zone 2',
  },
  {
    id: 'gp-3',
    name: 'Vyasanagar Ward',
    zone: 'Urban Wing',
    zoneType: 'urban',
    president: 'K. C. Pradhan',
    booths: 14,
    cadres: 62,
    progress: 92,
    phone: '+919800000012',
    searchData: 'vyasanagar ward committee kc pradhan urban wing',
  },
];

const bottomNavItems = [
  { label: 'Home', icon: 'grid_view', path: '/mobile/dashboard' },
  { label: 'Issues', icon: 'warning', path: '/mobile/issues' },
  { label: 'Works', icon: 'build', path: '/mobile/work-orders' },
  { label: 'Appts', icon: 'calendar_today', path: '/mobile/appointments' },
  { label: 'More', icon: 'grid_view', path: '/mobile/more' },
];

export default function Hierarchy() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'block' | 'gp' | 'booth' | 'morcha'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedBoothUnit, setSelectedBoothUnit] = useState<GpUnit | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Broadcast Form State
  const [targetGroup, setTargetGroup] = useState('All Korei Mandal & GP Office Bearers (340)');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBroadcastModal(false);
    triggerToast('Broadcast transmitted to 340 Korei Mandal members via SMS & App Push!');
    setBroadcastMessage('');
  };

  const filteredGpUnits = useMemo(() => {
    if (!searchQuery.trim()) return gpUnitsData;
    const q = searchQuery.toLowerCase().trim();
    return gpUnitsData.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.president.toLowerCase().includes(q) ||
        item.searchData.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const showExecutive = activeFilter === 'all' || activeFilter === 'block';
  const showMandal = activeFilter === 'all' || activeFilter === 'block';
  const showGp = activeFilter === 'all' || activeFilter === 'gp' || activeFilter === 'booth';
  const showMorcha = activeFilter === 'all' || activeFilter === 'morcha';

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#131b2e] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm text-[#00b57d]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7722] text-2xl">campaign</span>
                <h3 className="text-base font-bold text-[#131b2e]">Broadcast to Cadre</h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-[#584237]">
              Send official circular or emergency advisory to verified Korei leaders.
            </p>

            <form onSubmit={handleDispatchBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Target Group</label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30 font-medium"
                >
                  <option>All Korei Mandal &amp; GP Office Bearers (340)</option>
                  <option>GP Presidents Only (22)</option>
                  <option>Youth &amp; Mahila Morchas Only (832)</option>
                  <option>Booth Level In-Charges (340)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Message Content (SMS &amp; Push)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type notification in Odia or English..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30 font-medium resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#eaedff] text-[#584237] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ff7722] text-white font-bold shadow-xs flex items-center gap-1.5 hover:bg-[#9f4200]"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Send Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booth Overview Sheet Modal */}
      {selectedBoothUnit && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setSelectedBoothUnit(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-xl border border-slate-100 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[10px] text-[#ff7722] font-bold uppercase tracking-wider">GP Overview</span>
                <h3 className="text-lg font-bold text-[#131b2e]">{selectedBoothUnit.name}</h3>
                <p className="text-xs text-[#584237]">President: {selectedBoothUnit.president}</p>
              </div>
              <button
                onClick={() => setSelectedBoothUnit(null)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f2f3ff]">
              <div>
                <span className="text-[10px] text-[#584237]">Assigned Booths</span>
                <p className="text-xl font-extrabold text-[#ff7722]">{selectedBoothUnit.booths}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#584237]">Active Volunteers</span>
                <p className="text-xl font-extrabold text-[#006c49]">{selectedBoothUnit.cadres}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#eaedff] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#131b2e]">Booth #104 - Balipatna Pry School</p>
                  <p className="text-[10px] text-[#584237]">President: N. Mohanty (840 Voters)</p>
                </div>
                <span className="material-symbols-outlined text-[#006c49] text-lg">check_circle</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#eaedff] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#131b2e]">Booth #105 - Panchayat Bhavan</p>
                  <p className="text-[10px] text-[#584237]">President: S. Rout (910 Voters)</p>
                </div>
                <span className="material-symbols-outlined text-[#006c49] text-lg">check_circle</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#eaedff] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#131b2e]">Booth #106 - Nodal Upper Primary</p>
                  <p className="text-[10px] text-[#584237]">President: K. Behera (760 Voters)</p>
                </div>
                <span className="material-symbols-outlined text-[#fea619] text-lg">pending</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBoothUnit(null)}
              className="w-full h-11 rounded-xl bg-[#ff7722] text-white font-bold text-xs flex items-center justify-center shadow-xs hover:bg-[#9f4200]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Fixed Mobile Top Header */}
        <header className="fixed top-0 w-full z-50 pt-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 px-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#eaedff] p-0.5 rounded-full text-xs font-semibold">
                <button aria-label="Switch to English" className="px-2.5 py-1 rounded-full bg-[#ff7722] text-white leading-none">EN</button>
                <button aria-label="Switch to Odia" className="px-2.5 py-1 rounded-full text-[#584237] leading-none">ଓଡ଼ିଆ</button>
              </div>
              <button aria-label="Notifications" className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#584237] hover:bg-[#eaedff] transition-colors">
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

        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full pt-16 max-w-md mx-auto px-4 pb-8 space-y-5">
          {/* Sub-Header & Actions Bar */}
          <section className="pt-3">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[#9f4200]">
                  <span className="material-symbols-outlined text-base font-bold text-[#ff7722]">
                    account_tree
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#9f4200]">KOREI ASSEMBLY (43)</span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#131b2e] truncate">Leadership &amp; Cadre</h1>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(true)}
                  aria-label="Broadcast Notice"
                  className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#ff7722] text-white shadow-xs active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-xl">campaign</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Opening Cadre Enrollment Form for Korei Constituency.')}
                  aria-label="Add Member"
                  className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff] active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full mb-3">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#584237] text-xl select-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search by leader name, GP, or booth..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white text-[#131b2e] text-xs font-medium placeholder:text-slate-400 focus:outline-none border border-slate-200/80 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#584237] hover:text-[#131b2e]"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'block', label: 'Block Level' },
                { id: 'gp', label: 'GP Coordinators' },
                { id: 'booth', label: 'Booth Presidents' },
                { id: 'morcha', label: 'Morcha Wings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    activeFilter === tab.id
                      ? 'bg-[#ff7722] text-white shadow-xs'
                      : 'bg-[#eaedff] text-[#584237] hover:bg-[#e2e7ff]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {/* Section 1: Apex Executive Council */}
          {showExecutive && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-[#ff7722]"></span>
                  <h2 className="text-base font-extrabold text-[#131b2e]">Apex Executive Council</h2>
                </div>
                <span className="text-[10px] text-[#584237] bg-[#eaedff] px-2.5 py-0.5 rounded-full font-semibold">
                  Constituency HQ
                </span>
              </div>

              {/* MLA Leader Card */}
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-xs p-4 border border-slate-100/80">
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="relative shrink-0">
                    <img
                      className="w-16 h-16 rounded-2xl object-cover shadow-xs"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe0ENBC-rzaINJa_R44ZEwYkdw8evryXL5IJDN-jmD7pkb-9i5aIaELzfA2LdpJj1M4Wkm_ai663exk6wnr1OQvzOyxI3PALnRMyoCd33ykckuDx-VbM6QgODUlvitKPBcu0jxw_kSoUGwFuk10hIz8nG7AiyD0xfABU_F6DLHmoCIBgtmEYynPW-q1GIO-uGjMIqMPLZZHk4LdUlfGvqus1VT-_dsfosyok6GMKEDpVFphcm1AJUR"
                      alt="Shri Akash Dasnayak"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#ff7722] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">
                      <span className="material-symbols-outlined text-xs">check</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#9f4200] text-white text-[10px] font-bold">
                        MLA / HEAD
                      </span>
                      <span className="text-[10px] text-[#006c49] font-bold flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span> Active in Korei
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[#131b2e] mt-1 truncate">Shri Akash Dasnayak</h3>
                    <p className="text-[11px] text-[#584237] leading-tight">Member of Legislative Assembly • Korei Constituency</p>

                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href="tel:+919800000001"
                        className="flex-1 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center gap-1.5 text-[#131b2e] font-bold text-xs active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-base text-[#ff7722]">call</span>
                        <span>Camp Office</span>
                      </a>
                      <a
                        href="https://wa.me/919800000001"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-9 rounded-xl bg-[#006c49] text-white flex items-center justify-center gap-1.5 font-bold text-xs active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* In-Charge Card */}
              <div className="rounded-2xl bg-white shadow-xs p-4 border border-slate-100/80">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkLo5-PboNZhz15nt4y_2EYO58WGeaMyGkUzGfzZrd8J8bQIHpVXhcyVd44xeidxcNOKXPwh6B-_6pQU6sR0a_Jkjr8rSqVx6sbFCMecsKhHIAuPnwQWpekEr5eOMy_mfnqT5S0KAxX6owuaRCZ7wYe1mnOLU-o39dzoAfmbYGCROX6vbsRrR4B1pc6WAfCgYsb_dqwWY1dTHUJ8ABelLzKkX_9FPG2gSw24oJj0TGlwIrzYFBThaO"
                      alt="Shri Bijoy Kumar Mohapatra"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#fea619] text-[#684000] w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">
                      <span className="material-symbols-outlined text-xs">shield</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold">
                        IN-CHARGE
                      </span>
                      <span className="text-[10px] text-[#584237]">Zone Coordination</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-[#131b2e] mt-1 truncate">Shri Bijoy Kumar Mohapatra</h3>
                    <p className="text-[11px] text-[#584237] leading-tight">Constituency President &amp; Lead Observer</p>

                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href="tel:+919800000002"
                        className="flex-1 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center gap-1.5 text-[#131b2e] font-bold text-xs"
                      >
                        <span className="material-symbols-outlined text-base text-[#ff7722]">call</span>
                        <span>Call</span>
                      </a>
                      <a
                        href="https://wa.me/919800000002"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-9 rounded-xl bg-[#6ffbbe] text-[#002113] flex items-center justify-center gap-1.5 font-bold text-xs"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        <span>Message</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Executive Grid (2 items in a row as in Image 1) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white shadow-xs p-3.5 flex flex-col justify-between border border-slate-100/80">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#9f4200] text-[10px] font-bold inline-block mb-1.5">
                      Gen. Secretary
                    </span>
                    <h4 className="text-xs font-extrabold text-[#131b2e] truncate">Manas R. Sahu</h4>
                    <p className="text-[10px] text-[#584237]">Block Administration</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2">
                    <a
                      href="tel:+919800000003"
                      aria-label="Call Manas"
                      className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#131b2e] hover:bg-[#ff7722] hover:text-white transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">call</span>
                    </a>
                    <a
                      href="https://wa.me/919800000003"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp Manas"
                      className="flex-1 h-9 rounded-xl bg-[#006c49] text-white flex items-center justify-center gap-1 text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>WA</span>
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl bg-white shadow-xs p-3.5 flex flex-col justify-between border border-slate-100/80">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-[#ffddb8] text-[#2a1700] text-[10px] font-bold inline-block mb-1.5">
                      Youth President
                    </span>
                    <h4 className="text-xs font-extrabold text-[#131b2e] truncate">Soumya Ranjan</h4>
                    <p className="text-[10px] text-[#584237]">Yuva Morcha Korei</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2">
                    <a
                      href="tel:+919800000004"
                      aria-label="Call Soumya"
                      className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#131b2e] hover:bg-[#ff7722] hover:text-white transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">call</span>
                    </a>
                    <a
                      href="https://wa.me/919800000004"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp Soumya"
                      className="flex-1 h-9 rounded-xl bg-[#006c49] text-white flex items-center justify-center gap-1 text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>WA</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Korei Block Mandal Committee */}
          {showMandal && (
            <section className="space-y-3">
              <div className="rounded-3xl bg-[#f4f5fc] p-4 border border-slate-200/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#ff7722] text-xl">flag</span>
                      <h2 className="text-sm font-extrabold text-[#131b2e]">Korei Block Mandal Committee</h2>
                    </div>
                    <p className="text-[10px] text-[#584237] mt-0.5">28 Active Executive Office Bearers</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#00b57d] text-white text-[10px] font-bold shadow-2xs">
                    Verified 2024
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#ffdbcb] flex items-center justify-center text-[#341100] shrink-0 font-bold text-xs">
                        <span className="material-symbols-outlined text-lg">person</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#131b2e] truncate">Debabrata Nayak</p>
                        <p className="text-[10px] text-[#584237]">Mandal President</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="tel:+919800000005"
                        aria-label="Call Mandal President"
                        className="w-8 h-8 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#ff7722]"
                      >
                        <span className="material-symbols-outlined text-base">call</span>
                      </a>
                      <a
                        href="https://wa.me/919800000005"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="WhatsApp Mandal President"
                        className="w-8 h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#131b2e] shrink-0 font-bold text-xs">
                        <span className="material-symbols-outlined text-lg">badge</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#131b2e] truncate">Gitanjali Panigrahi</p>
                        <p className="text-[10px] text-[#584237]">General Secretary (Org)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="tel:+919800000006"
                        aria-label="Call General Secretary"
                        className="w-8 h-8 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#ff7722]"
                      >
                        <span className="material-symbols-outlined text-base">call</span>
                      </a>
                      <a
                        href="https://wa.me/919800000006"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="WhatsApp General Secretary"
                        className="w-8 h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#2a1700] shrink-0 font-bold text-xs">
                        <span className="material-symbols-outlined text-lg">cell_tower</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#131b2e] truncate">Pradeep K. Samal</p>
                        <p className="text-[10px] text-[#584237]">Media &amp; IT Coordinator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="tel:+919800000007"
                        aria-label="Call Media Coordinator"
                        className="w-8 h-8 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#ff7722]"
                      >
                        <span className="material-symbols-outlined text-base">call</span>
                      </a>
                      <a
                        href="https://wa.me/919800000007"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="WhatsApp Media Coordinator"
                        className="w-8 h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerToast('Opening full 28-member Mandal roster...')}
                  className="w-full text-center text-xs font-bold text-[#ff7722] flex items-center justify-center gap-1 hover:underline pt-1"
                >
                  <span>View full 28-member Mandal roster</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </section>
          )}

          {/* Section 3: Gram Panchayat Units */}
          {showGp && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#006c49]"></span>
                    <h2 className="text-base font-extrabold text-[#131b2e]">Gram Panchayat Units</h2>
                  </div>
                  <p className="text-[10px] text-[#584237]">22 GP Units &amp; Municipal Wards</p>
                </div>
                <span className="text-[10px] text-[#584237] bg-[#eaedff] px-2.5 py-0.5 rounded-full font-semibold">
                  340 Booths
                </span>
              </div>

              <div className="space-y-3">
                {filteredGpUnits.map((gp) => (
                  <div key={gp.id} className="rounded-2xl bg-white shadow-xs p-4 border border-slate-100/80 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-[#131b2e]">{gp.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">
                            {gp.zone}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#584237] mt-0.5">
                          President: <span className="font-bold text-[#131b2e]">{gp.president}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#9f4200] bg-[#ffddb8] px-2.5 py-0.5 rounded-full">
                          {gp.booths} Booths
                        </span>
                        <p className="text-[10px] text-[#584237] mt-1 font-medium">{gp.cadres} Cadres active</p>
                      </div>
                    </div>

                    <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ff7722] h-full rounded-full" style={{ width: `${gp.progress}%` }}></div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${gp.phone}`}
                        className="flex-1 h-10 rounded-xl bg-[#eaedff] flex items-center justify-center gap-1.5 text-[#131b2e] text-xs font-bold active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-base text-[#ff7722]">phone_in_talk</span>
                        <span>Contact</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedBoothUnit(gp)}
                        className="flex-1 h-10 rounded-xl bg-[#eaedff] text-[#131b2e] flex items-center justify-center gap-1.5 text-xs font-bold hover:bg-[#e2e7ff] active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-base text-[#584237]">grid_view</span>
                        <span>View Booths</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 4: Specialized Morcha Wings */}
          {showMorcha && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-[#fea619]"></span>
                  <h2 className="text-base font-extrabold text-[#131b2e]">Specialized Morcha Wings</h2>
                </div>
                <span className="text-[10px] text-[#584237]">Frontal Units</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-2xl bg-white shadow-xs p-4 flex items-center justify-between border border-slate-100/80">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#eaedff] text-[#9f4200] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">
                        diversity_1
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-extrabold text-[#131b2e] truncate">Mahila Morcha</h3>
                        <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#584237] text-[9px] font-bold">
                          Women Wing
                        </span>
                      </div>
                      <p className="text-[11px] text-[#584237] mt-0.5">Lead: Smita Mohanty • 312 Cadres</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast('Opening Mahila Morcha details...')}
                    className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#ff7722] shrink-0 hover:bg-[#ff7722] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-white shadow-xs p-4 flex items-center justify-between border border-slate-100/80">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#eaedff] text-[#855300] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">
                        bolt
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-extrabold text-[#131b2e] truncate">Yuva Morcha</h3>
                        <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#584237] text-[9px] font-bold">
                          Youth Wing
                        </span>
                      </div>
                      <p className="text-[11px] text-[#584237] mt-0.5">Lead: Soumya Ranjan • 520 Cadres</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast('Opening Yuva Morcha details...')}
                    className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#ff7722] shrink-0 hover:bg-[#ff7722] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-white shadow-xs p-4 flex items-center justify-between border border-slate-100/80">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#eaedff] text-[#006c49] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">
                        agriculture
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-extrabold text-[#131b2e] truncate">Krushak Morcha</h3>
                        <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#584237] text-[9px] font-bold">
                          Farmers Wing
                        </span>
                      </div>
                      <p className="text-[11px] text-[#584237] mt-0.5">Lead: Biranchi Das • 440 Cadres</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast('Opening Krushak Morcha details...')}
                    className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#ff7722] shrink-0 hover:bg-[#ff7722] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
          <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex-1 min-w-[44px] h-11 flex flex-col items-center justify-center gap-0.5 text-[#584237] hover:text-[#131b2e] transition-colors"
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-[10px] leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* DESKTOP VIEW (719px AND ABOVE) - MATCHES DESIGN FROM MOBILE SCREENSHOTS */}
      <div className="max-[718px]:hidden space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="material-symbols-outlined text-orange-600 text-base">account_tree</span>
              <span className="text-orange-600 font-bold">KOREI ASSEMBLY (43)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Leadership &amp; Cadre
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-lg">campaign</span>
              Broadcast Notice
            </button>
            <button
              onClick={() => triggerToast('Opening Cadre Enrollment Form...')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              Add Member
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search by leader name, GP, or booth..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            {[
              { id: 'all', label: 'All' },
              { id: 'block', label: 'Block Level' },
              { id: 'gp', label: 'GP Coordinators' },
              { id: 'booth', label: 'Booth Presidents' },
              { id: 'morcha', label: 'Morcha Wings' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === tab.id
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Apex Executive Council */}
        {showExecutive && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-orange-600"></span>
                <h2 className="text-base font-extrabold text-slate-900">Apex Executive Council</h2>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                Constituency HQ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MLA Leader Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe0ENBC-rzaINJa_R44ZEwYkdw8evryXL5IJDN-jmD7pkb-9i5aIaELzfA2LdpJj1M4Wkm_ai663exk6wnr1OQvzOyxI3PALnRMyoCd33ykckuDx-VbM6QgODUlvitKPBcu0jxw_kSoUGwFuk10hIz8nG7AiyD0xfABU_F6DLHmoCIBgtmEYynPW-q1GIO-uGjMIqMPLZZHk4LdUlfGvqus1VT-_dsfosyok6GMKEDpVFphcm1AJUR"
                    alt="Shri Akash Dasnayak"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">
                    <span className="material-symbols-outlined text-xs">check</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-800 text-white font-bold text-[10px] rounded-md">MLA / HEAD</span>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Active in Korei
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">Shri Akash Dasnayak</h3>
                  <p className="text-xs text-slate-500">Member of Legislative Assembly • Korei Constituency</p>

                  <div className="flex items-center gap-2 mt-3">
                    <a
                      href="tel:+919800000001"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-orange-600">call</span>
                      Camp Office
                    </a>
                    <a
                      href="https://wa.me/919800000001"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#006c49] hover:bg-[#005237] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* In-Charge Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkLo5-PboNZhz15nt4y_2EYO58WGeaMyGkUzGfzZrd8J8bQIHpVXhcyVd44xeidxcNOKXPwh6B-_6pQU6sR0a_Jkjr8rSqVx6sbFCMecsKhHIAuPnwQWpekEr5eOMy_mfnqT5S0KAxX6owuaRCZ7wYe1mnOLU-o39dzoAfmbYGCROX6vbsRrR4B1pc6WAfCgYsb_dqwWY1dTHUJ8ABelLzKkX_9FPG2gSw24oJj0TGlwIrzYFBThaO"
                    alt="Shri Bijoy Kumar Mohapatra"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-amber-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-2 ring-white">
                    <span className="material-symbols-outlined text-xs">shield</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-950 font-bold text-[10px] rounded-md">IN-CHARGE</span>
                    <span className="text-xs text-slate-500">Zone Coordination</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">Shri Bijoy Kumar Mohapatra</h3>
                  <p className="text-xs text-slate-500">Constituency President &amp; Lead Observer</p>

                  <div className="flex items-center gap-2 mt-3">
                    <a
                      href="tel:+919800000002"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-orange-600">call</span>
                      Call
                    </a>
                    <a
                      href="https://wa.me/919800000002"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      Message
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Executive Grid (2 items in desktop grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-orange-800 font-bold text-[10px] inline-block mb-1">
                    Gen. Secretary
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">Manas R. Sahu</h4>
                  <p className="text-xs text-slate-500">Block Administration</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+919800000003"
                    className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </a>
                  <a
                    href="https://wa.me/919800000003"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#006c49] text-white flex items-center gap-1 text-xs font-bold hover:bg-[#005237]"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WA</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold text-[10px] inline-block mb-1">
                    Youth President
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">Soumya Ranjan</h4>
                  <p className="text-xs text-slate-500">Yuva Morcha Korei</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+919800000004"
                    className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </a>
                  <a
                    href="https://wa.me/919800000004"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#006c49] text-white flex items-center gap-1 text-xs font-bold hover:bg-[#005237]"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WA</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 2: Korei Block Mandal Committee */}
        {showMandal && (
          <section className="p-5 rounded-3xl bg-[#f4f5fc] border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-600 text-xl">flag</span>
                  <h2 className="text-base font-extrabold text-slate-900">Korei Block Mandal Committee</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">28 Active Executive Office Bearers</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
                Verified 2024
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-950 shrink-0 font-bold text-xs">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate">Debabrata Nayak</p>
                    <p className="text-[10px] text-slate-500">Mandal President</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href="tel:+919800000005"
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </a>
                  <a
                    href="https://wa.me/919800000005"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 shrink-0 font-bold text-xs">
                    <span className="material-symbols-outlined text-xl">badge</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate">Gitanjali Panigrahi</p>
                    <p className="text-[10px] text-slate-500">General Secretary (Org)</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href="tel:+919800000006"
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </a>
                  <a
                    href="https://wa.me/919800000006"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-950 shrink-0 font-bold text-xs">
                    <span className="material-symbols-outlined text-xl">cell_tower</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate">Pradeep K. Samal</p>
                    <p className="text-[10px] text-slate-500">Media &amp; IT Coordinator</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href="tel:+919800000007"
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                  </a>
                  <a
                    href="https://wa.me/919800000007"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                  </a>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Opening full 28-member Mandal roster...')}
              className="w-full text-center text-xs font-bold text-orange-600 flex items-center justify-center gap-1 hover:underline pt-1"
            >
              <span>View full 28-member Mandal roster</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </section>
        )}

        {/* Section 3: Gram Panchayat Cards */}
        {showGp && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-[#006c49]"></span>
                  <h2 className="text-base font-extrabold text-slate-900">Gram Panchayat Units</h2>
                </div>
                <p className="text-xs text-slate-500">22 GP Units &amp; Municipal Wards</p>
              </div>
              <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                340 Booths
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredGpUnits.map((gp) => (
                <div key={gp.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{gp.name}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 text-[10px] font-bold">
                          {gp.zone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">President: {gp.president}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        {gp.booths} Booths
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{gp.cadres} Cadres active</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${gp.progress}%` }}></div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${gp.phone}`}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-orange-600">phone_in_talk</span>
                      Contact
                    </a>
                    <button
                      onClick={() => setSelectedBoothUnit(gp)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-slate-600">grid_view</span>
                      View Booths
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Specialized Morcha Wings */}
        {showMorcha && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-amber-500"></span>
                <h2 className="text-base font-extrabold text-slate-900">Specialized Morcha Wings</h2>
              </div>
              <span className="text-xs text-slate-500">Frontal Units</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-orange-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">diversity_1</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-extrabold text-slate-900 truncate">Mahila Morcha</h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold">
                        Women Wing
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Lead: Smita Mohanty • 312 Cadres</p>
                  </div>
                </div>
                <button
                  onClick={() => triggerToast('Opening Mahila Morcha details...')}
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600 shrink-0 hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-amber-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">bolt</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-extrabold text-slate-900 truncate">Yuva Morcha</h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold">
                        Youth Wing
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Lead: Soumya Ranjan • 520 Cadres</p>
                  </div>
                </div>
                <button
                  onClick={() => triggerToast('Opening Yuva Morcha details...')}
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600 shrink-0 hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">agriculture</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-extrabold text-slate-900 truncate">Krushak Morcha</h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold">
                        Farmers Wing
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Lead: Biranchi Das • 440 Cadres</p>
                  </div>
                </div>
                <button
                  onClick={() => triggerToast('Opening Krushak Morcha details...')}
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600 shrink-0 hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
