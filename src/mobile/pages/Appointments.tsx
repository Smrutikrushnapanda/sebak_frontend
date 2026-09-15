'use client';

import React, { useState, useMemo } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


interface AppointmentSession {
  id: string;
  timeSlot: string;
  title: string;
  location: string;
  note: string;
  status: 'completed' | 'progress' | 'upcoming' | 'confirmed';
  statusLabel: string;
  type: 'Meeting' | 'Field Visit' | 'Event' | 'Consultation';
}

interface PendingRequest {
  id: string;
  initials: string;
  name: string;
  organization: string;
  timeAgo: string;
  details: string;
}

const initialTimeline: AppointmentSession[] = [
  {
    id: 'app-1',
    timeSlot: '09:30 AM – 11:00 AM',
    title: 'Public Grievance Hearing (Jana Samparka)',
    location: 'MLA Camp Office, Korei',
    note: '18 Constituents registered & heard',
    status: 'completed',
    statusLabel: 'Completed',
    type: 'Meeting',
  },
  {
    id: 'app-2',
    timeSlot: '11:30 AM – 01:00 PM',
    title: 'Meeting with RWSS Engineers & BDO',
    location: 'Korei Block Development Office',
    note: 'Agenda: Drinking water pipeline review & solar pump setup',
    status: 'progress',
    statusLabel: 'In Progress',
    type: 'Meeting',
  },
  {
    id: 'app-3',
    timeSlot: '03:00 PM – 05:00 PM',
    title: 'Field Inspection: Korei Market Bypass & Drainage',
    location: 'Spot Visit at Market Square',
    note: 'Joint inspection with Executive District Engineer',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    type: 'Field Visit',
  },
  {
    id: 'app-4',
    timeSlot: '06:00 PM – 07:30 PM',
    title: 'Party Karyakarta & Youth Morcha Consultation',
    location: 'Constituency HQ, Korei',
    note: 'Preparation for Youth Employment Mela',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    type: 'Consultation',
  },
];

const initialPendingRequests: PendingRequest[] = [
  {
    id: 'req-1',
    initials: 'DK',
    name: 'Debendra Khatua & Delegation',
    organization: 'Nuagaon Farmers Association',
    timeAgo: '2 hrs ago',
    details: 'Regarding sanctioning of lift irrigation sub-station near Baitarani River basin for Rabi crop season.',
  },
  {
    id: 'req-2',
    initials: 'SM',
    name: 'Smt. Manorama Mohanty',
    organization: 'Ward 7 Councillor Representative',
    timeAgo: '4 hrs ago',
    details: 'Discussion on primary healthcare center staffing and ambulance allocation for Korei Rural Hospital.',
  },
  {
    id: 'req-3',
    initials: 'RP',
    name: 'Rajendra Prasad Swain',
    organization: 'Korei Merchants Association',
    timeAgo: '5 hrs ago',
    details: 'Memorandum regarding street light installation and market shed allocation at Korei Station Square.',
  },
];

const datesList = [
  { day: 'Thu', date: 11, label: '11 Sep' },
  { day: 'Fri', date: 12, label: '12 Sep', isToday: true },
  { day: 'Sat', date: 13, label: '13 Sep' },
  { day: 'Sun', date: 14, label: '14 Sep' },
  { day: 'Mon', date: 15, label: '15 Sep' },
  { day: 'Tue', date: 16, label: '16 Sep' },
];

// Sample Month Data for Calendar Review Modal
const monthScheduleDays = [
  { day: 1, count: 2, type: 'Meeting' },
  { day: 2, count: 4, type: 'Field Visit' },
  { day: 3, count: 1, type: 'Meeting' },
  { day: 4, count: 3, type: 'Event' },
  { day: 5, count: 2, type: 'Meeting' },
  { day: 6, count: 0, type: 'None' },
  { day: 7, count: 1, type: 'Field Visit' },
  { day: 8, count: 3, type: 'Meeting' },
  { day: 9, count: 5, type: 'Meeting' },
  { day: 10, count: 2, type: 'Event' },
  { day: 11, count: 3, type: 'Meeting' },
  { day: 12, count: 4, type: 'Field Visit', isToday: true },
  { day: 13, count: 2, type: 'Meeting' },
  { day: 14, count: 1, type: 'Event' },
  { day: 15, count: 3, type: 'Field Visit' },
  { day: 16, count: 2, type: 'Meeting' },
  { day: 17, count: 4, type: 'Meeting' },
  { day: 18, count: 1, type: 'Field Visit' },
  { day: 19, count: 3, type: 'Meeting' },
  { day: 20, count: 5, type: 'Event' },
  { day: 21, count: 2, type: 'Meeting' },
  { day: 22, count: 3, type: 'Field Visit' },
  { day: 23, count: 1, type: 'Meeting' },
  { day: 24, count: 4, type: 'Meeting' },
  { day: 25, count: 2, type: 'Event' },
  { day: 26, count: 3, type: 'Field Visit' },
  { day: 27, count: 1, type: 'Meeting' },
  { day: 28, count: 2, type: 'Meeting' },
  { day: 29, count: 3, type: 'Event' },
  { day: 30, count: 4, type: 'Field Visit' },
];

export default function Appointments() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<number>(12);
  const [timeline, setTimeline] = useState<AppointmentSession[]>(initialTimeline);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(initialPendingRequests);
  const [showCalendarReview, setShowCalendarReview] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleApproveRequest = (id: string, name: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== id));
    setTimeline([
      ...timeline,
      {
        id: `app-${Date.now()}`,
        timeSlot: '04:30 PM - 05:30 PM',
        title: `Meeting with ${name}`,
        location: 'MLA Camp Office, Korei',
        note: 'Approved slot from pending requests',
        status: 'confirmed',
        statusLabel: 'Confirmed',
        type: 'Meeting',
      },
    ]);
    triggerNotice(`Slot approved for ${name}`);
  };

  const handleRescheduleRequest = (id: string, name: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== id));
    triggerNotice(`Reschedule notification sent to ${name}`);
  };

  const stats = useMemo(() => {
    const meetings = timeline.filter((t) => t.type === 'Meeting').length;
    const fieldVisits = timeline.filter((t) => t.type === 'Field Visit').length;
    const events = timeline.filter((t) => t.type === 'Event').length;
    const pending = pendingRequests.length;
    return { meetings, fieldVisits, events, pending };
  }, [timeline, pendingRequests]);

  return (
    <>
      {/* Toast Notification Banner */}
      {actionNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Scrollable Mobile Body */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8">
          <div className="flex flex-col w-full px-1 space-y-6">
            {/* Header Title Section */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#ff7722]">
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#9f4200]">Korei Tour Management</span>
                </div>
                <div className="flex items-center gap-1 bg-[#e2e7ff] px-2.5 py-0.5 rounded-full text-[#584237]">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span className="text-xs font-semibold">Korei, Odisha</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <h2 className="text-xl font-bold text-[#131b2e]">{t('appointments.title')}</h2>
              </div>
              <p className="text-xs text-[#584237]">Friday, 12 September 2025 • Daily constituency itinerary</p>
            </div>

            {/* 4 Categorical Metrics Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#9f4200] mb-1">
                  <span className="material-symbols-outlined text-lg">groups</span>
                </div>
                <span className="text-xl font-extrabold text-[#131b2e]">{stats.meetings}</span>
                <span className="text-[10px] text-[#584237] truncate w-full">Meetings</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#855300] mb-1">
                  <span className="material-symbols-outlined text-lg">pin_drop</span>
                </div>
                <span className="text-xl font-extrabold text-[#131b2e]">{stats.fieldVisits}</span>
                <span className="text-[10px] text-[#584237] truncate w-full">Field Visit</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#584237] mb-1">
                  <span className="material-symbols-outlined text-lg">flag</span>
                </div>
                <span className="text-xl font-extrabold text-[#131b2e]">{stats.events}</span>
                <span className="text-[10px] text-[#584237] truncate w-full">Events</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl shadow-xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#93000a] mb-1">
                  <span className="material-symbols-outlined text-lg">pending_actions</span>
                </div>
                <span className="text-xl font-extrabold text-[#ba1a1a]">{stats.pending}</span>
                <span className="text-[10px] text-[#584237] truncate w-full">Pending</span>
              </div>
            </div>

            {/* Date Selector Strip */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#131b2e]">September 2025</span>
                <button
                  onClick={() => setShowCalendarReview(true)}
                  className="flex items-center gap-0.5 text-[#9f4200] text-xs font-bold hover:underline"
                >
                  <span>Calendar View</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
                {datesList.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`flex-shrink-0 py-2 flex flex-col items-center rounded-xl transition-colors ${
                      selectedDate === d.date
                        ? 'w-24 px-1 bg-[#ff7722] text-white shadow-md relative'
                        : 'w-14 bg-white text-[#131b2e] shadow-xs hover:bg-[#eaedff]'
                    }`}
                  >
                    {d.isToday && selectedDate === d.date && (
                      <span className="absolute -top-1.5 bg-[#fea619] text-[#684000] text-[9px] font-semibold px-1.5 py-0.2 rounded-full uppercase">
                        Today
                      </span>
                    )}
                    <span className={`text-[10px] ${selectedDate === d.date ? 'opacity-90' : 'text-[#584237]'}`}>
                      {d.day}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {d.isToday && <span className="material-symbols-outlined text-xs">star</span>}
                      <span className="text-sm font-bold">{d.date}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Today's Timeline */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#9f4200]">schedule</span>
                  <h3 className="text-sm font-bold text-[#131b2e]">Today's Timeline</h3>
                </div>
                <span className="bg-[#eaedff] px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#584237]">
                  {timeline.length} Sessions
                </span>
              </div>

              <div className="flex flex-col gap-3 relative">
                {timeline.map((session) => (
                  <div
                    key={session.id}
                    className={`bg-white p-3.5 rounded-xl shadow-xs flex flex-col gap-1.5 relative overflow-hidden ${
                      session.status === 'progress' ? 'ring-2 ring-[#ff7722]/30 shadow-md' : ''
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        session.status === 'completed'
                          ? 'bg-[#006c49]'
                          : session.status === 'progress'
                          ? 'bg-[#ff7722]'
                          : session.status === 'upcoming'
                          ? 'bg-[#fea619]'
                          : 'bg-slate-300'
                      }`}
                    />

                    <div className="flex items-center justify-between pl-1">
                      <span
                        className={`text-xs font-bold ${
                          session.status === 'progress' ? 'text-[#ff7722]' : 'text-[#131b2e]'
                        }`}
                      >
                        {session.timeSlot}
                      </span>

                      {session.status === 'completed' && (
                        <span className="bg-[#6ffbbe] text-[#002113] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Completed
                        </span>
                      )}
                      {session.status === 'progress' && (
                        <span className="bg-[#ffdbcb] text-[#793100] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7722]"></span>
                          In Progress
                        </span>
                      )}
                      {session.status === 'upcoming' && (
                        <span className="bg-[#ffddb8] text-[#2a1700] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          Upcoming
                        </span>
                      )}
                      {session.status === 'confirmed' && (
                        <span className="bg-[#e2e7ff] text-[#584237] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#131b2e] pl-1 leading-snug">{session.title}</h4>

                    <div className="flex items-center gap-1 text-[#584237] pl-1 text-[11px]">
                      <span className="material-symbols-outlined text-xs">home_pin</span>
                      <span>{session.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 pl-1 bg-[#f2f3ff] p-2 rounded-lg text-xs">
                      <span className="material-symbols-outlined text-xs text-[#006c49]">record_voice_over</span>
                      <span className="text-[11px] text-[#131b2e]">{session.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Requests Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ff7722]">assignment_late</span>
                  <h3 className="text-sm font-bold text-[#131b2e]">Pending Requests</h3>
                </div>
                <span className="text-[#9f4200] text-xs font-semibold flex items-center gap-0.5">
                  <span>View All ({pendingRequests.length})</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {pendingRequests.length === 0 ? (
                  <div className="p-4 bg-white rounded-xl text-center text-xs text-slate-500 border border-slate-200">
                    No pending appointment requests.
                  </div>
                ) : (
                  pendingRequests.map((req) => (
                    <div key={req.id} className="bg-white p-3.5 rounded-xl shadow-xs flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#9f4200] font-bold text-xs">
                            {req.initials}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-[#131b2e]">{req.name}</h5>
                            <p className="text-[10px] text-[#584237]">{req.organization}</p>
                          </div>
                        </div>
                        <span className="bg-[#e2e7ff] text-[#584237] text-[10px] px-2 py-0.5 rounded-full">
                          {req.timeAgo}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#131b2e] bg-[#f2f3ff] p-2 rounded-lg leading-relaxed">
                        {req.details}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApproveRequest(req.id, req.name)}
                          className="flex-1 py-2 px-3 bg-[#ff7722] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                          <span>Approve Slot</span>
                        </button>
                        <button
                          onClick={() => handleRescheduleRequest(req.id, req.name)}
                          className="flex-1 py-2 px-3 bg-[#eaedff] text-[#131b2e] rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                        >
                          <span className="material-symbols-outlined text-sm">update</span>
                          <span>Reschedule</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
              <span>Constituency Tour &amp; Protocol Engine</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">Live Daily Itinerary</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Appointments &amp; Tour Schedule Desk
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalendarReview(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              <span>Calendar Review &amp; Month Overview</span>
            </button>
          </div>
        </div>

        {/* 4 Large Desktop Metric Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Public Meetings</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.meetings}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined text-xl">groups</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500">Confirmed Today</div>
          </div>

          <div className="rounded-2xl p-4 bg-amber-50/60 border border-amber-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Field Visits</span>
                <div className="text-2xl font-extrabold text-amber-950 mt-1">{stats.fieldVisits}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-xl">pin_drop</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-amber-200/40 text-xs text-amber-800">Spot Inspections</div>
          </div>

          <div className="rounded-2xl p-4 bg-orange-50/60 border border-orange-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-900">Official Events</span>
                <div className="text-2xl font-extrabold text-orange-950 mt-1">{stats.events}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-200/80 flex items-center justify-center text-orange-800">
                <span className="material-symbols-outlined text-xl">flag</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-orange-200/40 text-xs text-orange-800">Scheduled</div>
          </div>

          <div className="rounded-2xl p-4 bg-rose-50/60 border border-rose-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900">Pending Requests</span>
                <div className="text-2xl font-extrabold text-rose-950 mt-1">{stats.pending}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-200/80 flex items-center justify-center text-rose-800">
                <span className="material-symbols-outlined text-xl">pending_actions</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-rose-200/40 text-xs text-rose-800 font-semibold">Awaiting Approval</div>
          </div>
        </div>

        {/* Desktop Itinerary Timeline & Pending Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">Today's Timeline (12 Sep 2025)</h3>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {timeline.length} Sessions
              </span>
            </div>

            <div className="space-y-3">
              {timeline.map((session) => (
                <div key={session.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold text-orange-600">{session.timeSlot}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {session.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{session.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{session.location} • {session.note}</p>
                  </div>

                  <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    session.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : session.status === 'progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {session.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Slots Side Card */}
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Pending Requests</h3>
              <span className="text-xs font-bold text-orange-600">{pendingRequests.length} Pending</span>
            </div>

            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{req.name}</h4>
                      <span className="text-[10px] text-slate-500">{req.organization}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{req.timeAgo}</span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {req.details}
                  </p>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApproveRequest(req.id, req.name)}
                      className="flex-1 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
                    >
                      Approve Slot
                    </button>
                    <button
                      onClick={() => handleRescheduleRequest(req.id, req.name)}
                      className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Review Modal / Month Overview Dialog */}
      {showCalendarReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-xl">calendar_month</span>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">September 2025 Tour Calendar</h3>
                  <span className="text-[10px] text-slate-400">Constituency Itinerary &amp; Monthly Review</span>
                </div>
              </div>
              <button onClick={() => setShowCalendarReview(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Calendar Review Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Summary Badges */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-center">
                  <span className="text-orange-600 font-extrabold text-base block">74</span>
                  <span className="text-[10px] text-slate-600">Total Tours Month</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <span className="text-emerald-700 font-extrabold text-base block">18</span>
                  <span className="text-[10px] text-slate-600">Grievance Days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
                  <span className="text-amber-800 font-extrabold text-base block">12</span>
                  <span className="text-[10px] text-slate-600">Field Inspections</span>
                </div>
              </div>

              {/* Month Grid */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="font-bold text-slate-900 text-sm">September 2025</span>
                  <span className="text-[10px] font-semibold text-slate-500">Korei AC-53 Schedule</span>
                </div>

                <div className="grid grid-cols-7 text-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {monthScheduleDays.map((item) => (
                    <button
                      key={item.day}
                      onClick={() => {
                        setSelectedDate(item.day);
                        setShowCalendarReview(false);
                        triggerNotice(`Switched view to 12 September 2025 (Day ${item.day})`);
                      }}
                      className={`p-1.5 rounded-xl flex flex-col items-center justify-between min-h-[44px] transition-all relative ${
                        item.isToday
                          ? 'bg-orange-600 text-white font-bold shadow-md ring-2 ring-orange-400'
                          : selectedDate === item.day
                          ? 'bg-orange-100 text-orange-900 font-bold border border-orange-300'
                          : 'bg-white text-slate-800 border border-slate-100 hover:bg-orange-50'
                      }`}
                    >
                      <span className="text-[11px] leading-none">{item.day}</span>
                      {item.count > 0 && (
                        <span
                          className={`text-[9px] font-extrabold px-1 rounded-full mt-0.5 leading-none ${
                            item.isToday
                              ? 'bg-white text-orange-600'
                              : 'bg-orange-500 text-white'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Highlights Log */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Selected Date Itinerary Overview</h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-xs text-orange-600">
                    <span>12 September 2025 (Today)</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-[10px]">
                      4 Scheduled Sessions
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px] pt-1">
                    <li>09:30 AM: Jana Samparka Grievance Hearing (Camp Office)</li>
                    <li>11:30 AM: RWSS &amp; BDO Drinking Water Pipeline Review</li>
                    <li>03:00 PM: Korei Market Bypass Field Inspection</li>
                    <li>06:00 PM: Party Karyakarta &amp; Youth Morcha Consultation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowCalendarReview(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Calendar Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
