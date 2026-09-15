'use client';

import React, { useState } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


interface EscalationItem {
  id: string;
  code: string;
  categoryBadge: string;
  categoryType: 'critical' | 'infra' | 'health';
  timeInfo: string;
  timeIcon?: string;
  title: string;
  location: string;
  authority: string;
  image: string;
  btn1Text: string;
  btn1Icon: string;
  btn2Text: string;
  btn2Icon: string;
}

const escalationList: EscalationItem[] = [
  {
    id: 'esc-1',
    code: '#ESC-2025-014',
    categoryBadge: 'Critical',
    categoryType: 'critical',
    timeInfo: '36h in Escalation (SLA Breached)',
    timeIcon: 'schedule',
    title: 'Total drinking water disruption in Nuagaon Harijan Sahi for 4 days - RWSS local JE non-responsive',
    location: 'Nuagaon GP, Korei Block',
    authority: 'Executive Engineer, RWSS Division Jajpur & Collector',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuLp05C3W9MfIqPG9ghHgyq4f7Cq5gM_9c-y0W8uuk8SRBlzBkCZR8iFzGmIIPlwIb-1CnDhyfsu8I7Hd4BZnmtrWnkPz810sJz3OE0_-o2CaDDpmgiH5EwwZGcbhIRTlx8d17SzV7ELiKfgdSBk7iCjKZP2ACTu9FJjs6pkIAwvZuBU3hEpK2PVg1_8ZWNXwEonNzwQnhWorXTHy4VxNV-zOKxGJakFniOg4drhv7UJXMTvlQaOt_',
    btn1Text: 'Call Collectorate',
    btn1Icon: 'call',
    btn2Text: 'Direct MLA Notice',
    btn2Icon: 'send',
  },
  {
    id: 'esc-2',
    code: '#ESC-2025-011',
    categoryBadge: 'Infra Hazard',
    categoryType: 'infra',
    timeInfo: 'D.O. Letter Sent',
    timeIcon: 'check_circle',
    title: 'Culvert structural collapse threatening school bus route near Balipatna High School',
    location: 'Balipatna Gram Panchayat',
    authority: 'Chief Engineer, Rural Works Dept (Bhubaneswar)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa8mM4SKZULNULStwVMQnj1zWTeTck96TLI1uB5bIDVm55JD8jALG8baSmtBwpCp-MFjP_B3JAQ_Z23hb7hoRtaKJwEW2AyYIj3UFdm3nLgMrrRUr3fsi_dk4XJeK9F0Z8YNsfUev0sFGv9T7O4BSMNIXGV_APvPZio8WUrwZrmgPYqOIWMTF92l7xCrdH39UfBCvIPXu2kTT_MDsByjBCndSSu7iLjtxUbJWS3XxNX0lTSiyOhW0D',
    btn1Text: 'View D.O. Letter',
    btn1Icon: 'description',
    btn2Text: 'Track Status',
    btn2Icon: 'route',
  },
  {
    id: 'esc-3',
    code: '#ESC-2025-009',
    categoryBadge: 'Health Alert',
    categoryType: 'health',
    timeInfo: 'Pending 14h',
    timeIcon: 'notifications_active',
    title: 'Shortage of anti-venom and emergency doctors at Korei CHC',
    location: 'Korei Community Health Centre, Ward 04',
    authority: 'CDMO Jajpur & Health & Family Welfare Dept',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdpYicpq8n9h1OchuhJCuhrSkm62UwPhq-LnEwNP2UecpCf07TEFU_Or1UKeKGgDh5jcqYXziB47lASnkIGA8JuAfFocyrNXSj3SZbO7RflFsXxLfIByVNhFS7iMpzafzEmaWrjHlKYpsxf8Ig5aeKkeddinx_Q3RS2Wt5kRC8r8S_2WsFTLaV3t7e5YLp4iVXJP8RRi8CrmuxT1kPLLp75deQ0qhMU-XFmEd4PU5P--zUx5zYw1EO',
    btn1Text: 'Call CDMO',
    btn1Icon: 'phone_in_talk',
    btn2Text: 'Send Reminder',
    btn2Icon: 'emergency_home',
  },
];

export default function Escalation() {
  const { t } = useLanguage();
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Escalation Form State
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('RWSS');
  const [details, setDetails] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRaiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setShowRaiseModal(false);
    triggerToast('Direct Departmental Escalation issued under MLA Office!');
    setSubject('');
    setDetails('');
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#131b2e] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm text-[#00b57d]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Raise Escalation Modal */}
      {showRaiseModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7722] text-xl font-bold">add_alert</span>
                <h3 className="text-base font-bold text-[#131b2e]">Raise Departmental Escalation</h3>
              </div>
              <button
                onClick={() => setShowRaiseModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleRaiseSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Target Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs font-medium text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                >
                  <option value="RWSS">RWSS (Drinking Water & Sanitation)</option>
                  <option value="RuralWorks">Rural Works & Roads</option>
                  <option value="Health">Health & Family Welfare (CHC/CDMO)</option>
                  <option value="Revenue">Revenue & Tahasildar Office</option>
                  <option value="Energy">TPSODL / Electricity Grid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Escalation Title / Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical transformer breakdown at Korai East..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs font-medium text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Details &amp; Bureaucratic Bottleneck</label>
                <textarea
                  rows={3}
                  placeholder="Specify location, JE/SDO non-responsiveness, and urgency level..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs font-medium text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRaiseModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#e2e7ff] text-[#584237] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ff7722] text-white text-xs font-bold shadow-xs hover:bg-[#9f4200] transition-colors"
                >
                  Dispatch MLA Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8">
          <div className="flex flex-col w-full pb-6 space-y-5">
            {/* Top Section Title & Critical Live Alert Banner */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ff7722] text-xl font-bold">priority_high</span>
                  <h1 className="text-xl font-bold text-[#131b2e] tracking-tight">Grievance Escalations</h1>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
                  LIVE ESCALATIONS
                </span>
              </div>

              {/* Red Alert Headline Strip */}
              <div className="relative overflow-hidden rounded-2xl bg-[#ffdad6]/80 p-3.5 shadow-xs border border-red-200/60">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ba1a1a] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      warning
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#93000a]">
                        6 Critical Escalations Pending Intervention
                      </span>
                    </div>
                    <p className="text-[11px] text-[#93000a]/90 mt-0.5 leading-snug">
                      Direct MLA intervention required to breach bureaucratic hold-ups across Korei block jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Metric Grid (Quadrant) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Critical / Overdue */}
              <div className="flex flex-col p-3.5 rounded-2xl bg-[#ffdad6] text-[#93000a] shadow-xs justify-between border border-red-200/60">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#93000a]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      timer_off
                    </span>
                  </span>
                  <span className="text-2xl font-extrabold text-[#ba1a1a]">06</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold block leading-tight">Critical / Overdue</span>
                  <span className="text-[10px] opacity-80 font-medium">SLA Breached &gt;24h</span>
                </div>
              </div>

              {/* Escalated to District Collector */}
              <div className="flex flex-col p-3.5 rounded-2xl bg-[#e2e7ff] text-[#131b2e] shadow-xs justify-between border border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#ff7722]/10 flex items-center justify-center text-[#ff7722]">
                    <span className="material-symbols-outlined text-base">account_balance</span>
                  </span>
                  <span className="text-2xl font-extrabold text-[#ff7722]">03</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold block leading-tight">District Collector</span>
                  <span className="text-[10px] text-[#584237]">Jajpur HQ Liaison</span>
                </div>
              </div>

              {/* Escalated to Dept Secretary */}
              <div className="flex flex-col p-3.5 rounded-2xl bg-[#eaedff] text-[#131b2e] shadow-xs justify-between border border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#855300]/15 flex items-center justify-center text-[#855300]">
                    <span className="material-symbols-outlined text-base">corporate_fare</span>
                  </span>
                  <span className="text-2xl font-extrabold text-[#855300]">02</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold block leading-tight">Dept Secretary</span>
                  <span className="text-[10px] text-[#584237]">State HQ Secretariat</span>
                </div>
              </div>

              {/* Resolved Post-Escalation */}
              <div className="flex flex-col p-3.5 rounded-2xl bg-white text-[#131b2e] shadow-xs justify-between border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#4edea3]/30 flex items-center justify-center text-[#006c49]">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      task_alt
                    </span>
                  </span>
                  <span className="text-2xl font-extrabold text-[#006c49]">19</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold block leading-tight">Resolved Grievance</span>
                  <span className="text-[10px] text-[#584237]">This Fiscal Month</span>
                </div>
              </div>
            </div>

            {/* Priority Escalation Feed */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5 uppercase tracking-wide">
                  <span>Active Priority Escalations</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ff7722]/15 text-[#ff7722] text-[10px] font-bold">
                    Live Queue
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => triggerToast('Filtered queue by department.')}
                  className="text-xs font-bold text-[#ff7722] hover:underline flex items-center gap-0.5"
                >
                  <span>Filter by Dept</span>
                  <span className="material-symbols-outlined text-sm">tune</span>
                </button>
              </div>

              {/* Escalations List */}
              {escalationList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-2xl bg-white shadow-xs border border-slate-100 overflow-hidden"
                >
                  {/* Card Header Stripe */}
                  <div
                    className={`px-3.5 py-2 flex items-center justify-between ${
                      item.categoryType === 'critical'
                        ? 'bg-[#ffdad6]/50'
                        : item.categoryType === 'infra'
                        ? 'bg-[#ffddb8]/50'
                        : 'bg-[#ffdad6]/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.categoryType === 'critical'
                            ? 'bg-[#ba1a1a]'
                            : item.categoryType === 'infra'
                            ? 'bg-[#855300]'
                            : 'bg-[#ba1a1a]'
                        }`}
                      ></span>
                      <span className="text-xs font-bold text-[#131b2e]">{item.code}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          item.categoryType === 'critical'
                            ? 'bg-[#ba1a1a] text-white'
                            : item.categoryType === 'infra'
                            ? 'bg-[#fea619] text-[#684000]'
                            : 'bg-[#ba1a1a] text-white'
                        }`}
                      >
                        {item.categoryBadge}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[10px] font-bold ${
                        item.categoryType === 'critical'
                          ? 'text-[#ba1a1a]'
                          : item.categoryType === 'infra'
                          ? 'text-[#006c49]'
                          : 'text-[#ba1a1a]'
                      }`}
                    >
                      {item.timeIcon && <span className="material-symbols-outlined text-xs">{item.timeIcon}</span>}
                      <span>{item.timeInfo}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex flex-col gap-3">
                    <div className="flex gap-3 items-start">
                      <img src={item.image} alt="Thumbnail" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <h3 className="text-xs font-bold text-[#131b2e] leading-snug">{item.title}</h3>
                        <span className="text-[10px] text-[#584237] flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-xs text-[#ff7722]">location_on</span>
                          {item.location}
                        </span>
                      </div>
                    </div>

                    {/* Escalated Routing Detail Box */}
                    <div className="rounded-xl bg-[#f2f3ff] p-2.5 flex flex-col gap-0.5 text-[#131b2e]">
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-xs text-[#584237] mt-0.5">
                          {item.categoryType === 'infra' ? 'engineering' : item.categoryType === 'health' ? 'local_hospital' : 'forward_to_inbox'}
                        </span>
                        <div className="flex flex-col text-[11px]">
                          <span className="text-[10px] text-[#584237] font-semibold">Escalated To Authority:</span>
                          <span className="font-bold text-[#131b2e]">{item.authority}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rapid Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        onClick={() => triggerToast(`Initiating call to ${item.btn1Text}...`)}
                        className="h-10 rounded-xl bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5 px-2 text-xs font-bold"
                      >
                        <span className="material-symbols-outlined text-sm text-[#ff7722]">{item.btn1Icon}</span>
                        <span>{item.btn1Text}</span>
                      </button>
                      <button
                        onClick={() => triggerToast(`Notice sent: ${item.btn2Text}`)}
                        className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 px-2 shadow-xs transition-opacity ${
                          item.categoryType === 'critical' || item.categoryType === 'health'
                            ? 'bg-[#ff7722] text-white hover:bg-[#9f4200]'
                            : 'bg-[#dae2fd] text-[#131b2e] hover:bg-[#e2e7ff]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{item.btn2Icon}</span>
                        <span>{item.btn2Text}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Primary Escalation Trigger Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowRaiseModal(true)}
                type="button"
                className="w-full h-12 rounded-xl bg-[#ff7722] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform hover:bg-[#9f4200]"
              >
                <span className="material-symbols-outlined text-xl font-bold">add_alert</span>
                <span>+ Raise Direct Departmental Escalation</span>
              </button>
              <p className="text-[10px] text-center text-[#584237] mt-2">
                Authorized directly under Office of MLA Korei Constituency (Odisha Legislative Assembly)
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
              <span>Constituency Grievance Desk</span>
              <span>•</span>
              <span className="text-rose-600 font-bold">6 Critical Hold-ups Pending</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Grievance Escalations &amp; Direct MLA Notices
            </h1>
          </div>

          <button
            onClick={() => setShowRaiseModal(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_alert</span>
            Raise Direct Departmental Escalation
          </button>
        </div>

        {/* Desktop Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold block">Critical / Overdue</span>
              <span className="text-[10px] opacity-75">SLA Breached &gt;24h</span>
            </div>
            <span className="text-3xl font-extrabold text-rose-600">06</span>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold block">District Collector</span>
              <span className="text-[10px] opacity-75">Jajpur HQ Liaison</span>
            </div>
            <span className="text-3xl font-extrabold text-orange-600">03</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold block">Dept Secretary</span>
              <span className="text-[10px] opacity-75">State HQ Secretariat</span>
            </div>
            <span className="text-3xl font-extrabold text-amber-700">02</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold block">Resolved Grievance</span>
              <span className="text-[10px] opacity-75">This Fiscal Month</span>
            </div>
            <span className="text-3xl font-extrabold text-emerald-700">19</span>
          </div>
        </div>

        {/* Desktop Escalations Feed Grid */}
        <div className="space-y-4">
          {escalationList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img src={item.image} alt="Thumbnail" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800">{item.code}</span>
                      <span className="text-xs font-bold text-rose-600 uppercase">• {item.categoryBadge}</span>
                      <span className="text-xs text-slate-400">• {item.timeInfo}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-orange-600">location_on</span>
                      {item.location}
                    </p>

                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <span className="text-slate-400 block font-semibold">Escalated To Authority:</span>
                      <span className="font-bold text-slate-800">{item.authority}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => triggerToast(`Calling ${item.btn1Text}...`)}
                    className="px-4 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    {item.btn1Text}
                  </button>
                  <button
                    onClick={() => triggerToast(`Action issued: ${item.btn2Text}`)}
                    className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    {item.btn2Text}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
