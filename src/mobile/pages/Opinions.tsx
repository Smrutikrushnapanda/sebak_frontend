'use client';

import React, { useState } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


interface PollOption {
  id: number;
  label: string;
  votes: number;
  percentage: number;
  badge?: string;
  leading?: boolean;
}

const initialPollOptions: PollOption[] = [
  {
    id: 1,
    label: '1. Rural Roads & Drainage',
    votes: 1420,
    percentage: 44,
    leading: true,
  },
  {
    id: 2,
    label: '2. Primary Healthcare & Mobile Dispensary',
    votes: 998,
    percentage: 31,
    badge: 'Byasanagar & Korai East',
  },
  {
    id: 3,
    label: '3. Youth Skill Training & Sports Infra',
    votes: 548,
    percentage: 17,
    badge: '18-25 Demographics',
  },
  {
    id: 4,
    label: '4. High School Smart Classrooms',
    votes: 258,
    percentage: 8,
    badge: 'PTA & School Committees',
  },
];

export default function Opinions() {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [pollOptions, setPollOptions] = useState<PollOption[]>(initialPollOptions);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [showLaunchModal, setShowLaunchModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Poll Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVote = (optionId: number) => {
    setSelectedOption(optionId);
    if (!hasVoted) {
      setPollOptions((prev) =>
        prev.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        })
      );
      setHasVoted(true);
      triggerToast('Vote recorded! Thank you for participating.');
    }
  };

  const totalVotes = pollOptions.reduce((acc, opt) => acc + opt.votes, 0);

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setShowLaunchModal(false);
    triggerToast('New Constituency Poll launched successfully!');
    setNewTitle('');
    setNewDesc('');
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

      {/* Launch New Poll Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7722] text-xl">add_chart</span>
                <h3 className="text-base font-bold text-[#131b2e]">Launch Constituency Poll</h3>
              </div>
              <button
                onClick={() => setShowLaunchModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Poll Topic / Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priority for Canal Beautification Project..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs font-medium text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Description / Context</label>
                <textarea
                  rows={3}
                  placeholder="Provide background context for citizens to make an informed choice..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs font-medium text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLaunchModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#e2e7ff] text-[#584237] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ff7722] text-white text-xs font-bold shadow-xs hover:bg-[#9f4200] transition-colors"
                >
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8 space-y-6">
          {/* Sub-Header & Live Overview Pill */}
          <div className="flex flex-col pt-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#9f4200] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                ଜନତା ମତାମତ • LIVE OPINIONS
              </span>
              <span className="text-xs text-[#584237] font-medium">22 GPs Active</span>
            </div>
            <h1 className="text-xl font-bold text-[#131b2e] tracking-tight">Citizen Opinions &amp; Surveys</h1>
            <p className="text-xs text-[#584237] mt-0.5">Gauging constituency sentiment across 22 Gram Panchayats</p>
          </div>

          {/* Featured Poll: Hero Card */}
          <section className="flex flex-col bg-white rounded-2xl shadow-md p-4 relative overflow-hidden border border-slate-100">
            {/* Ambient saffron flare */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ffdbcb]/40 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-2 relative z-10 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#ff7722]/15 text-[#ff7722]">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    how_to_vote
                  </span>
                </span>
                <span className="text-xs text-[#ff7722] font-semibold uppercase tracking-wider">Featured Constituency Vote</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                <span className="material-symbols-outlined text-xs">timer</span>
                Ends in 3d
              </span>
            </div>

            <h2 className="text-sm font-bold text-[#131b2e] mb-1 relative z-10">
              Priority for MLALAD 2025-26 Budget Allocation in Korei Block
            </h2>
            <p className="text-[11px] text-[#584237] mb-4 relative z-10 leading-snug">
              Select the public infrastructure vertical needing immediate capital deployment this financial year.
            </p>

            {/* Poll Options Accordion / Interactive Bars */}
            <div className="space-y-3 relative z-10 mb-4">
              {pollOptions.map((option) => {
                const isSelected = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleVote(option.id)}
                    className={`w-full text-left relative p-3 rounded-xl transition-all flex flex-col gap-1.5 border ${
                      isSelected
                        ? 'bg-[#ffdbcb]/30 border-[#ff7722]/40 shadow-xs'
                        : 'bg-[#f2f3ff] hover:bg-[#eaedff] border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-baseline w-full z-10">
                      <span className="text-xs font-semibold text-[#131b2e] flex items-center gap-1.5">
                        <span
                          className={`material-symbols-outlined text-base ${
                            isSelected ? 'text-[#ff7722]' : 'text-slate-400'
                          }`}
                        >
                          {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        {option.label}
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#ff7722]' : 'text-[#131b2e]'}`}>
                        {option.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#e2e7ff] overflow-hidden z-10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          option.id === 1
                            ? 'bg-[#ff7722]'
                            : option.id === 2
                            ? 'bg-[#fea619]'
                            : option.id === 3
                            ? 'bg-[#dae2fd]'
                            : 'bg-[#d2d9f4]'
                        }`}
                        style={{ width: `${option.percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center w-full z-10 text-[10px] text-[#584237]">
                      <span>{option.votes.toLocaleString()} votes</span>
                      {option.leading ? (
                        <span className="text-[#006c49] font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">trending_up</span> Leading
                        </span>
                      ) : (
                        <span>{option.badge}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Poll Meta & Actions */}
            <div className="flex flex-col gap-2 pt-3 bg-[#f2f3ff]/50 -mx-4 -mb-4 p-4 rounded-b-2xl border-t border-slate-100">
              <div className="flex items-center justify-between text-[#584237] text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#ff7722]">groups</span>
                  <span className="font-bold text-[#131b2e]">{totalVotes.toLocaleString()}</span> citizens voted
                </div>
                <div className="flex items-center gap-1 text-[#006c49]">
                  <span className="material-symbols-outlined text-xs">verified_user</span>
                  <span>Aadhaar OTP Verified</span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => triggerToast('Poll link copied to clipboard!')}
                  className="flex-1 h-10 px-3 rounded-xl bg-[#dae2fd] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#e2e7ff] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">share</span>
                  Share Poll
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Ward breakdown analytical view updated.')}
                  className="flex-1 h-10 px-3 rounded-xl bg-[#dae2fd] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#e2e7ff] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">analytics</span>
                  Ward Breakdown
                </button>
              </div>
            </div>
          </section>

          {/* LOWER SECTION 1: Concluded Public Reviews (Exact Screenshot Design) */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-[#9f4200]"></span>
                <h3 className="text-base font-bold text-[#131b2e]">Concluded Public Reviews</h3>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('Viewing archived surveys list.')}
                className="text-xs font-semibold text-[#9f4200] hover:underline flex items-center"
              >
                View All <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
              </button>
            </div>

            {/* Survey Card 1: Sub-Division Hospital Services */}
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100/80 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6ffbbe]/40 flex items-center justify-center text-[#006c49] shrink-0">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      add_box
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-[#131b2e] line-clamp-1">Sub-Division Hospital Services</h4>
                    <p className="text-xs text-[#584237]">Jajpur Road Sub-divisional center</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#584237] text-[11px] font-semibold">
                  Archived
                </span>
              </div>

              {/* Metric visualization banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eaedff]/60">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#584237]">Constituency Sentiment</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-extrabold text-[#006c49]">72%</span>
                    <span className="text-xs text-[#006c49] font-semibold">Positive Response</span>
                  </div>
                </div>

                {/* Donut Chart with thumb_up in center */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e2e7ff]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></path>
                    <path
                      className="text-[#006c49]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="72, 100"
                      strokeLinecap="round"
                      strokeWidth="4"
                    ></path>
                  </svg>
                  <span className="absolute material-symbols-outlined text-sm text-[#006c49]">thumb_up</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[#584237] text-xs pt-0.5">
                <span>2,150 local respondents</span>
                <button
                  type="button"
                  onClick={() => triggerToast('Opening Action Report...')}
                  className="text-[#9f4200] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Action Report Filed</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>
            </div>

            {/* Survey Card 2: Night Streetlighting Coverage */}
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100/80 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#855300] shrink-0">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lightbulb
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-[#131b2e] line-clamp-1">Night Streetlighting Coverage</h4>
                    <p className="text-xs text-[#584237]">Market squares &amp; connecting arterial lanes</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#584237] text-[11px] font-semibold">
                  Archived
                </span>
              </div>

              {/* Metric visualization banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eaedff]/60">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#584237]">Citizen Approval</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-extrabold text-[#855300]">86%</span>
                    <span className="text-xs text-[#855300] font-semibold">Satisfaction Rate</span>
                  </div>
                </div>

                {/* Donut Chart with lightbulb in center */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e2e7ff]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></path>
                    <path
                      className="text-[#ff7722]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="86, 100"
                      strokeLinecap="round"
                      strokeWidth="4"
                    ></path>
                  </svg>
                  <span className="absolute material-symbols-outlined text-sm text-[#ff7722]">lightbulb</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[#584237] text-xs pt-0.5">
                <span>1,890 local respondents</span>
                <span className="text-[#006c49] font-bold">LED Phase 2 Approved</span>
              </div>
            </div>
          </section>

          {/* LOWER SECTION 2: Verified Resident Stream (Exact Screenshot Design) */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-[#006c49]"></span>
                <h3 className="text-base font-bold text-[#131b2e]">Verified Resident Stream</h3>
              </div>
              <span className="text-xs text-[#584237] font-medium">Real-time Opinions</span>
            </div>

            {/* Feedback Stream Item 1: Rameshwar Jena */}
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100/80 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAymzbtHym3lo3aLGJNBpnZq8uj3VSKQk15Wnp9CYkxIW0SldXR5WbQ2GjjJzm1BqOR4x0iH374YZkXJ1leEfUqBQulIFU5wFn4kb9yw85f2jl1UFNLQ4lLbHP9vgXiohYoVWaNpEQLToqlyAfLnnVdV71eyGx3rqvjAB57RJNTZkRC4c2Ojjj6KFGcHTOWyyEqNjppNzFLV_zg2mg3xLD_pWQe_JGpZC43_EssWPaD4mThSWyNaPEF"
                    alt="Rameshwar Jena"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#131b2e]">Rameshwar Jena</span>
                    <span className="text-xs text-[#584237]">20 mins ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#dae2fd] text-[#002113] font-semibold text-xs">
                    <span className="material-symbols-outlined text-sm text-[#006c49]">check_circle</span>
                    Ward 5, Korei GP
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#ffdbcb] text-[#341100] font-bold text-xs">
                    Voted Roads
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#131b2e] leading-relaxed pt-1">
                “The culvert near Hatapada market floods every monsoon. If the MLALAD road fund tackles this drainage segment first, farmers from 4 neighboring hamlets will benefit greatly.”
              </p>
            </div>

            {/* Feedback Stream Item 2: Priyanka Mohanty */}
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-100/80 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4H0wPIVwoQK6iewFUMOaGkofSR2kNFLdjg-9mU9y3uto2H6GYLxAYqKEIgk1MBVWeQ9mHk7W9RLZSJghV2wGpEIESwLHa-x2dDIj3wH7YmB5qd9CszUigEWZm9YRwFgOqFrnRUcKsoi3ddBU5EbpPMq7aWKVGC35L3CLUua0ZcUKpsX4mvWdQAYSMIqcCfsCarZOrUqvcuV01rCM3VCACI5Da1lWDuIfKQMaIolJxieBV7xhhwwMk"
                    alt="Priyanka Mohanty"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#131b2e]">Priyanka Mohanty</span>
                    <span className="text-xs text-[#584237]">1 hour ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#dae2fd] text-[#002113] font-semibold text-xs">
                    <span className="material-symbols-outlined text-sm text-[#006c49]">check_circle</span>
                    Ward 2, Byasanagar
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#ffdbcb] text-[#341100] font-bold text-xs">
                    Voted Healthcare
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#131b2e] leading-relaxed pt-1">
                “A dedicated mobile dispensary with ultrasound facility on weekly rotation would serve senior citizens who cannot commute to the main town hospital.”
              </p>
            </div>
          </section>

          {/* Launch Constituency Poll Button */}
          <div className="pt-2 pb-4">
            <button
              onClick={() => setShowLaunchModal(true)}
              type="button"
              className="w-full h-12 rounded-xl bg-[#ff7722] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:bg-[#9f4200] transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">add_chart</span>
              + Launch New Constituency Poll
            </button>
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {/* DESKTOP VIEW (719px AND ABOVE) */}
      <div className="max-[718px]:hidden space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Constituency Public Opinion Platform</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">22 Gram Panchayats Active</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Citizen Opinions &amp; Infrastructure Surveys
            </h1>
          </div>

          <button
            onClick={() => setShowLaunchModal(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_chart</span>
            Launch New Constituency Poll
          </button>
        </div>

        {/* Desktop Active Voting Hero */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Featured Poll • MLALAD 2025-26 Outlay
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">Ends in 3 days</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            Priority for MLALAD 2025-26 Budget Allocation in Korei Block
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {pollOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleVote(option.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-900">{option.label}</span>
                  <span className="text-sm font-extrabold text-orange-600">{option.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>{option.votes.toLocaleString()} votes</span>
                  {option.leading ? <span className="text-emerald-700 font-bold">Leading Option</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Concluded Public Reviews (Exact Screenshot Design) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#9f4200]"></span>
              <h3 className="text-base font-bold text-slate-900">Concluded Public Reviews</h3>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Viewing archived surveys list.')}
              className="text-xs font-semibold text-[#9f4200] hover:underline flex items-center"
            >
              View All <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6ffbbe]/40 flex items-center justify-center text-[#006c49] shrink-0">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      add_box
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Sub-Division Hospital Services</h4>
                    <p className="text-xs text-slate-500">Jajpur Road Sub-divisional center</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#584237] text-[11px] font-semibold">
                  Archived
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eaedff]/60">
                <div className="flex flex-col">
                  <span className="text-xs text-[#584237]">Constituency Sentiment</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-extrabold text-[#006c49]">72%</span>
                    <span className="text-xs text-[#006c49] font-semibold">Positive Response</span>
                  </div>
                </div>

                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e2e7ff]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></path>
                    <path
                      className="text-[#006c49]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="72, 100"
                      strokeLinecap="round"
                      strokeWidth="4"
                    ></path>
                  </svg>
                  <span className="absolute material-symbols-outlined text-sm text-[#006c49]">thumb_up</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>2,150 local respondents</span>
                <span className="text-[#9f4200] font-bold flex items-center gap-1">
                  Action Report Filed <span className="material-symbols-outlined text-sm">open_in_new</span>
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#855300] shrink-0">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lightbulb
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Night Streetlighting Coverage</h4>
                    <p className="text-xs text-slate-500">Market squares &amp; connecting arterial lanes</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#584237] text-[11px] font-semibold">
                  Archived
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eaedff]/60">
                <div className="flex flex-col">
                  <span className="text-xs text-[#584237]">Citizen Approval</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-extrabold text-[#855300]">86%</span>
                    <span className="text-xs text-[#855300] font-semibold">Satisfaction Rate</span>
                  </div>
                </div>

                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e2e7ff]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></path>
                    <path
                      className="text-[#ff7722]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="86, 100"
                      strokeLinecap="round"
                      strokeWidth="4"
                    ></path>
                  </svg>
                  <span className="absolute material-symbols-outlined text-sm text-[#ff7722]">lightbulb</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>1,890 local respondents</span>
                <span className="text-[#006c49] font-bold">LED Phase 2 Approved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Verified Resident Stream (Exact Screenshot Design) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#006c49]"></span>
              <h3 className="text-base font-bold text-slate-900">Verified Resident Stream</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Real-time Opinions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stream 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAymzbtHym3lo3aLGJNBpnZq8uj3VSKQk15Wnp9CYkxIW0SldXR5WbQ2GjjJzm1BqOR4x0iH374YZkXJ1leEfUqBQulIFU5wFn4kb9yw85f2jl1UFNLQ4lLbHP9vgXiohYoVWaNpEQLToqlyAfLnnVdV71eyGx3rqvjAB57RJNTZkRC4c2Ojjj6KFGcHTOWyyEqNjppNzFLV_zg2mg3xLD_pWQe_JGpZC43_EssWPaD4mThSWyNaPEF"
                    alt="Rameshwar Jena"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Rameshwar Jena</span>
                    <span className="text-xs text-slate-500">20 mins ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#dae2fd] text-[#002113] font-semibold text-xs">
                    <span className="material-symbols-outlined text-sm text-[#006c49]">check_circle</span>
                    Ward 5, Korei GP
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#ffdbcb] text-[#341100] font-bold text-xs">
                    Voted Roads
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed pt-1">
                “The culvert near Hatapada market floods every monsoon. If the MLALAD road fund tackles this drainage segment first, farmers from 4 neighboring hamlets will benefit greatly.”
              </p>
            </div>

            {/* Stream 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4H0wPIVwoQK6iewFUMOaGkofSR2kNFLdjg-9mU9y3uto2H6GYLxAYqKEIgk1MBVWeQ9mHk7W9RLZSJghV2wGpEIESwLHa-x2dDIj3wH7YmB5qd9CszUigEWZm9YRwFgOqFrnRUcKsoi3ddBU5EbpPMq7aWKVGC35L3CLUua0ZcUKpsX4mvWdQAYSMIqcCfsCarZOrUqvcuV01rCM3VCACI5Da1lWDuIfKQMaIolJxieBV7xhhwwMk"
                    alt="Priyanka Mohanty"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Priyanka Mohanty</span>
                    <span className="text-xs text-slate-500">1 hour ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#dae2fd] text-[#002113] font-semibold text-xs">
                    <span className="material-symbols-outlined text-sm text-[#006c49]">check_circle</span>
                    Ward 2, Byasanagar
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#ffdbcb] text-[#341100] font-bold text-xs">
                    Voted Healthcare
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed pt-1">
                “A dedicated mobile dispensary with ultrasound facility on weekly rotation would serve senior citizens who cannot commute to the main town hospital.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
