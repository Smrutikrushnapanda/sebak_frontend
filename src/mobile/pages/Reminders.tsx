'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';


interface UrgentReminder {
  id: string;
  dueText: string;
  timerText: string;
  title: string;
  location: string;
  mandate: string;
  category: 'critical' | 'approvals' | 'tenders' | 'personal';
  status: 'pending' | 'completed' | 'delegated';
}

interface SanctionApproval {
  id: string;
  workOrder: string;
  amount: string;
  title: string;
  location: string;
  isEmergency?: boolean;
  category: 'critical' | 'approvals' | 'tenders' | 'personal';
  status: 'pending' | 'signed' | 'approved';
}

interface StatutoryItem {
  id: string;
  month: string;
  day: number;
  remainingText: string;
  title: string;
  description: string;
  tagColor: string;
}

const initialUrgentReminders: UrgentReminder[] = [
  {
    id: 'urg-1',
    dueText: 'Due Today • 5:00 PM',
    timerText: '02h 45m left',
    title: 'Submit MLALAD Utilization Certificate to District Planning Office',
    location: 'Jajpur Collectorate Office',
    mandate: 'Mandate #OD-MLALAD-24',
    category: 'critical',
    status: 'pending',
  },
  {
    id: 'urg-2',
    dueText: 'Tomorrow • 11:00 AM',
    timerText: 'Cabinet Cell',
    title: 'Cabinet Review briefing on Baitarani River embankment strengthening',
    location: 'Water Resources Dept',
    mandate: 'Korei-Jajpur Flood Division',
    category: 'critical',
    status: 'pending',
  },
];

const initialSanctions: SanctionApproval[] = [
  {
    id: 'sanc-1',
    workOrder: 'Work Order #WO-2025-092',
    amount: '₹14.80 Lakhs',
    title: 'Sign Work Order for Korai High School science lab modern upgrade',
    location: 'Korai Block • Verified by BDO Korai',
    category: 'approvals',
    status: 'pending',
  },
  {
    id: 'sanc-2',
    workOrder: 'Emergency CMRF Assistance',
    amount: '₹40,000',
    title: 'Approve financial assistance for BPL health emergency (Ramesh Jena)',
    location: 'Danagadi GP • SCB Medical Oncology Referral',
    isEmergency: true,
    category: 'approvals',
    status: 'pending',
  },
];

const statutoryItemsData: StatutoryItem[] = [
  {
    id: 'stat-1',
    month: 'Sep',
    day: 18,
    remainingText: '10 Days Remaining',
    title: 'Assembly Question cut-off (Starred/Unstarred)',
    description: '16th Odisha Legislative Assembly • Winter Session 2025',
    tagColor: 'text-[#ff7722]',
  },
  {
    id: 'stat-2',
    month: 'Sep',
    day: 24,
    remainingText: 'Quarterly Review',
    title: 'Quarterly Grievance Audit with Jajpur Collector',
    description: 'Review of 142 pending Jan Sunani petitions',
    tagColor: 'text-[#006c49]',
  },
  {
    id: 'stat-3',
    month: 'Oct',
    day: 5,
    remainingText: 'Panchayat Raj Dept',
    title: '15th Finance Commission Grant Allocations',
    description: 'Rural roads and solar drinking water projects',
    tagColor: 'text-[#855300]',
  },
];

const bottomNavItems: { label: string; icon: string; path: string; active?: boolean }[] = [
  { label: 'Home', icon: 'dashboard', path: '/mobile/dashboard' },
  { label: 'Issues', icon: 'warning', path: '/mobile/issues' },
  { label: 'Works', icon: 'build', path: '/mobile/work-orders' },
  { label: 'Appts', icon: 'calendar_today', path: '/mobile/appointments' },
  { label: 'More', icon: 'grid_view', path: '/mobile/more' },
];

export default function Reminders() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [urgentList, setUrgentList] = useState<UrgentReminder[]>(initialUrgentReminders);
  const [sanctionList, setSanctionList] = useState<SanctionApproval[]>(initialSanctions);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Pending Approvals');
  const [newDueDate, setNewDueDate] = useState('2025-09-12');
  const [sendAlertPA, setSendAlertPA] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUrgentAction = (id: string, actionType: 'Completed' | 'Delegated to PA') => {
    setUrgentList(
      urgentList.map((u) => (u.id === id ? { ...u, status: actionType === 'Completed' ? 'completed' : 'delegated' } : u))
    );
    showToast(`Action recorded: ${actionType}`);
  };

  const handleSanctionAction = (id: string, actionText: 'E-Signed' | 'Disbursement Approved') => {
    setSanctionList(
      sanctionList.map((s) => (s.id === id ? { ...s, status: actionText === 'E-Signed' ? 'signed' : 'approved' } : s))
    );
    showToast(`Action recorded: ${actionText}`);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newUrgent: UrgentReminder = {
      id: `urg-${Date.now()}`,
      dueText: `Due ${newDueDate}`,
      timerText: 'New Alert',
      title: newTitle,
      location: 'Constituency Office',
      mandate: newCategory,
      category: 'critical',
      status: 'pending',
    };

    setUrgentList([newUrgent, ...urgentList]);
    setShowCreateModal(false);
    setNewTitle('');
    showToast('New reminder pinned to MLA schedule');
  };

  return (
    <>
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#283044] text-[#eef0ff] rounded-full shadow-lg font-semibold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 max-w-[90%]">
          <span className="material-symbols-outlined text-[#4edea3] text-base">check_circle</span>
          <span>{toastMessage}</span>
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
        <main className="flex-1 flex flex-col relative w-full pt-16 max-w-md mx-auto">
          <div className="flex flex-col w-full pb-8">
            {/* Subtle Civic Status Banner */}
            <div className="px-4 pt-3">
              <div className="bg-white shadow-xs rounded-xl p-3.5 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#ffdbcb] flex items-center justify-center text-[#9f4200] shrink-0">
                    <span className="material-symbols-outlined text-2xl">calendar_clock</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h1 className="font-bold text-base text-[#131b2e] truncate">Reminders &amp; Follow-ups</h1>
                    </div>
                    <p className="text-xs text-[#584237] truncate">Constituency Secretariat • Korei</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#e2e7ff] px-2.5 py-1 rounded-full shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                  <span className="text-xs text-[#131b2e] font-semibold">4 Critical</span>
                </div>
              </div>
            </div>

            {/* Horizontal Filter Pills */}
            <div className="pt-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 px-4 min-w-max">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 shadow-xs ${
                    activeFilter === 'all'
                      ? 'bg-[#ff7722] text-white'
                      : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                  }`}
                >
                  <span>All</span>
                  <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">18</span>
                </button>
                <button
                  onClick={() => setActiveFilter('critical')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeFilter === 'critical'
                      ? 'bg-[#ff7722] text-white'
                      : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                  }`}
                >
                  <span>Critical / Today</span>
                  <span className="bg-[#ffdad6] text-[#93000a] font-bold px-1.5 py-0.2 rounded-full text-[10px]">4</span>
                </button>
                <button
                  onClick={() => setActiveFilter('approvals')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeFilter === 'approvals'
                      ? 'bg-[#ff7722] text-white'
                      : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                  }`}
                >
                  <span>Pending Approvals</span>
                  <span className="bg-[#dae2fd] text-[#131b2e] px-1.5 py-0.2 rounded-full text-[10px]">6</span>
                </button>
                <button
                  onClick={() => setActiveFilter('tenders')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeFilter === 'tenders'
                      ? 'bg-[#ff7722] text-white'
                      : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                  }`}
                >
                  <span>Tenders &amp; Grants</span>
                  <span className="bg-[#dae2fd] text-[#131b2e] px-1.5 py-0.2 rounded-full text-[10px]">5</span>
                </button>
                <button
                  onClick={() => setActiveFilter('personal')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeFilter === 'personal'
                      ? 'bg-[#ff7722] text-white'
                      : 'bg-[#e2e7ff] text-[#584237] hover:text-[#131b2e]'
                  }`}
                >
                  <span>Personal</span>
                  <span className="bg-[#dae2fd] text-[#131b2e] px-1.5 py-0.2 rounded-full text-[10px]">3</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: Urgent Attention */}
            {(activeFilter === 'all' || activeFilter === 'critical') && (
              <div className="px-4 pt-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-lg">error</span>
                    <h2 className="text-xs font-bold text-[#131b2e] tracking-tight uppercase">Urgent Attention</h2>
                  </div>
                  <span className="text-[10px] bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-full font-bold">
                    Immediate SLA
                  </span>
                </div>

                {urgentList.map((item) => (
                  <div key={item.id} className="bg-white shadow-xs rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden border border-slate-100">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ba1a1a]"></div>
                    <div className="flex items-start justify-between gap-2 pl-1">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-full font-semibold">
                            {item.dueText}
                          </span>
                          <span className="text-[10px] text-[#ba1a1a] flex items-center gap-0.5 font-bold">
                            <span className="material-symbols-outlined text-xs">timer</span> {item.timerText}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-[#131b2e] leading-snug">{item.title}</h3>
                        <p className="text-[11px] text-[#584237] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">account_balance</span> {item.location} • {item.mandate}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Controls */}
                    <div className="pt-1 pl-1 flex items-center gap-2">
                      <button
                        onClick={() => handleUrgentAction(item.id, 'Completed')}
                        disabled={item.status === 'completed'}
                        className={`flex-1 h-9 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform ${
                          item.status === 'completed'
                            ? 'bg-[#eaedff] text-[#584237]'
                            : 'bg-[#006c49] text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>{item.status === 'completed' ? 'Completed' : 'Mark Completed'}</span>
                      </button>
                      <button
                        onClick={() => handleUrgentAction(item.id, 'Delegated to PA')}
                        disabled={item.status === 'delegated'}
                        className="flex-1 h-9 rounded-lg bg-[#e2e7ff] text-[#131b2e] font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-sm text-[#ff7722]">forward_to_inbox</span>
                        <span>{item.status === 'delegated' ? 'Delegated' : 'Delegate to PA'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 2: Pending Sanctions & Signatures */}
            {(activeFilter === 'all' || activeFilter === 'approvals') && (
              <div className="px-4 pt-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#ff7722] text-lg">draw</span>
                    <h2 className="text-xs font-bold text-[#131b2e] tracking-tight uppercase">Pending Sanction Approvals</h2>
                  </div>
                  <span className="text-[10px] bg-[#ffdbcb] text-[#341100] font-bold px-2 py-0.5 rounded-full">
                    2 Pending Sign
                  </span>
                </div>

                {sanctionList.map((sanction) => (
                  <div key={sanction.id} className="bg-white shadow-xs rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden border border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${sanction.isEmergency ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#eaedff] text-[#584237]'}`}>
                            {sanction.workOrder}
                          </span>
                          <span className="text-[10px] text-[#ff7722] font-bold">{sanction.amount}</span>
                        </div>
                        <h3 className="text-xs font-bold text-[#131b2e] leading-snug">{sanction.title}</h3>
                        <p className="text-[11px] text-[#584237] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">school</span> {sanction.location}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => handleSanctionAction(sanction.id, sanction.isEmergency ? 'Disbursement Approved' : 'E-Signed')}
                        className="flex-1 h-9 rounded-lg bg-[#ff7722] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-sm">verified</span>
                        <span>{sanction.status !== 'pending' ? 'Processed' : sanction.isEmergency ? 'Approve Relief' : 'Digital Signature'}</span>
                      </button>
                      <button className="w-9 h-9 rounded-lg bg-[#e2e7ff] text-[#131b2e] flex items-center justify-center hover:bg-slate-200">
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 3: Statutory & Legislative Timeline */}
            {(activeFilter === 'all' || activeFilter === 'tenders' || activeFilter === 'personal') && (
              <div className="px-4 pt-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#855300] text-lg">account_balance</span>
                    <h2 className="text-xs font-bold text-[#131b2e] tracking-tight uppercase">Statutory Dates &amp; Deadlines</h2>
                  </div>
                  <span className="text-[10px] text-[#584237] font-semibold">Odisha Assembly</span>
                </div>

                <div className="bg-white shadow-xs rounded-xl p-3.5 flex flex-col gap-3 border border-slate-100">
                  {statutoryItemsData.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 && <div className="h-[1px] w-full bg-slate-100"></div>}
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-[#e2e7ff] text-[#131b2e] shrink-0">
                          <span className={`text-[10px] uppercase font-bold ${item.tagColor}`}>{item.month}</span>
                          <span className="text-sm font-extrabold leading-none">{item.day}</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-semibold ${item.tagColor}`}>{item.remainingText}</span>
                            <span className="material-symbols-outlined text-[#584237] text-sm">bookmark</span>
                          </div>
                          <h3 className="text-xs font-bold text-[#131b2e] truncate">{item.title}</h3>
                          <p className="text-[10px] text-[#584237]">{item.description}</p>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Floating Quick Creator Button */}
            <div className="sticky bottom-20 px-4 mt-6 flex justify-end z-30 pointer-events-none">
              <button
                onClick={() => setShowCreateModal(true)}
                className="pointer-events-auto h-11 px-4 rounded-full bg-[#ff7722] text-white shadow-lg flex items-center gap-2 active:scale-95 transition-all hover:bg-orange-700 text-xs font-bold"
              >
                <span className="material-symbols-outlined text-lg">alarm_add</span>
                <span>+ Create New Reminder</span>
              </button>
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
              <span>Constituency Secretariat Protocol</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">Korei AC-53 SLA Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Reminders &amp; Legislative Deadlines Desk
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <span className="material-symbols-outlined text-lg">alarm_add</span>
              <span>+ Create New Reminder</span>
            </button>
          </div>
        </div>

        {/* 4 Large Desktop Metric Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl p-4 bg-rose-50/70 border border-rose-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900">Critical SLA Due</span>
                <div className="text-2xl font-extrabold text-rose-950 mt-1">4 Items</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-200/80 flex items-center justify-center text-rose-800">
                <span className="material-symbols-outlined text-xl">error</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-rose-200/40 text-xs font-semibold text-rose-800">Immediate Action Required</div>
          </div>

          <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Digital Sign</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">6 Sanctions</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined text-xl">draw</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500">Work Orders &amp; Relief Grants</div>
          </div>

          <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Assembly Deadlines</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">3 Cut-offs</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-xl">account_balance</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500">Winter Session 2025</div>
          </div>

          <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">PA Delegated</span>
                <div className="text-2xl font-extrabold text-amber-700 mt-1">5 Follow-ups</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-xl">forward_to_inbox</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500">Secretariat Tracking</div>
          </div>
        </div>

        {/* Desktop Urgent & Sanctions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Urgent SLA Attention</h3>
              <span className="text-xs font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">2 Urgent</span>
            </div>

            <div className="space-y-3">
              {urgentList.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-rose-600">{item.dueText}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.location} • {item.mandate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUrgentAction(item.id, 'Completed')}
                      className="flex-1 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => handleUrgentAction(item.id, 'Delegated to PA')}
                      className="flex-1 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200"
                    >
                      Delegate to PA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Pending Digital Signatures</h3>
              <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">2 Pending</span>
            </div>

            <div className="space-y-3">
              {sanctionList.map((sanction) => (
                <div key={sanction.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-orange-600">{sanction.amount}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{sanction.title}</h4>
                      <p className="text-xs text-slate-500">{sanction.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSanctionAction(sanction.id, sanction.isEmergency ? 'Disbursement Approved' : 'E-Signed')}
                      className="flex-1 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700"
                    >
                      {sanction.isEmergency ? 'Approve Relief' : 'Digital Signature'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create New Reminder Modal Sheet */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-xl">edit_calendar</span>
                <h3 className="text-base font-bold text-white">New Secretariat Reminder</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call DRDA Project Director for bridge audit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  >
                    <option value="Pending Approvals">Pending Approvals</option>
                    <option value="Critical / Today">Critical / Today</option>
                    <option value="Tenders & Grants">Tenders &amp; Grants</option>
                    <option value="Constituency Event">Constituency Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="paAlert"
                  checked={sendAlertPA}
                  onChange={(e) => setSendAlertPA(e.target.checked)}
                  className="rounded text-orange-600 w-4 h-4"
                />
                <label htmlFor="paAlert" className="text-xs font-semibold text-slate-800">
                  Send alert to PA Phone
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs">
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
