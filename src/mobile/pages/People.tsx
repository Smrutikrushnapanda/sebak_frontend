'use client';

import React, { useState, useMemo } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


interface Constituent {
  id: string;
  initials: string;
  name: string;
  isVerified?: boolean;
  starIcon?: boolean;
  communityLead?: boolean;
  badge?: string;
  role: string;
  location: string;
  phone: string;
  kycVerified?: boolean;
  category: 'delegations' | 'influencers' | 'beneficiaries' | 'seniors';
  gp: string;
  tags: { text: string; icon: string; bg: string; color: string }[];
  history: string;
}

const constituentData: Constituent[] = [
  {
    id: 'cit-1',
    initials: 'DK',
    name: 'Debendra Khatua',
    isVerified: true,
    starIcon: true,
    role: 'Nuagaon Farmers Association President',
    location: 'Ward 4, Nuagaon GP',
    phone: '+91 94371 44810',
    category: 'delegations',
    gp: 'Nuagaon',
    tags: [
      { text: 'Farmer Delegate', icon: 'agriculture', bg: 'bg-[#eaedff]', color: 'text-[#855300]' },
      { text: 'Lift Irrigation Petition', icon: 'water_drop', bg: 'bg-[#ffddb8]', color: 'text-[#2a1700]' },
    ],
    history: '3 petitions filed • 1 Jan Sunani resolution',
  },
  {
    id: 'cit-2',
    initials: 'MM',
    name: 'Smt. Manorama Mohanty',
    isVerified: true,
    communityLead: true,
    role: 'Ward 7 Councillor Rep & SHG Leader (Maa Tarini)',
    location: 'Ward 7, Korei Town',
    phone: '+91 98610 89234',
    category: 'influencers',
    gp: 'Korei Town',
    tags: [
      { text: 'Healthcare Advocate', icon: 'local_hospital', bg: 'bg-[#6ffbbe]', color: 'text-[#002113]' },
      { text: 'Panchayat Samiti', icon: 'diversity_3', bg: 'bg-[#eaedff]', color: 'text-[#9f4200]' },
    ],
    history: '5 community drives • CHC Sub-centre sanitation',
  },
  {
    id: 'cit-3',
    initials: 'AR',
    name: 'Dr. Ashok Kumar Ray',
    isVerified: true,
    badge: 'Senior',
    role: 'Retd. Headmaster, Balipatna High School & Social Worker',
    location: 'Balipatna GP',
    phone: '+91 94370 01122',
    kycVerified: true,
    category: 'seniors',
    gp: 'Balipatna',
    tags: [
      { text: 'Education Influencer', icon: 'school', bg: 'bg-[#e2e7ff]', color: 'text-[#9f4200]' },
      { text: 'Jan Sunani Committee', icon: 'gavel', bg: 'bg-[#eaedff]', color: 'text-[#855300]' },
    ],
    history: '2 school library renovation grants advised',
  },
  {
    id: 'cit-4',
    initials: 'ND',
    name: 'Niranjan Das',
    isVerified: true,
    badge: 'Youth',
    role: 'Youth Sports Club Convener & Entrepreneur',
    location: 'Vyasanagar',
    phone: '+91 70081 22910',
    category: 'influencers',
    gp: 'Vyasanagar',
    tags: [
      { text: 'Youth Morcha', icon: 'sports_soccer', bg: 'bg-[#ffddb8]', color: 'text-[#2a1700]' },
      { text: 'Stadium Proposal', icon: 'stadium', bg: 'bg-[#e2e7ff]', color: 'text-[#9f4200]' },
    ],
    history: 'Vyasanagar Mini Stadium memorandum submitted',
  },
];

export default function People() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGp, setSelectedGp] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedModalCitizen, setSelectedModalCitizen] = useState<Constituent | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Registration Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGp, setNewGp] = useState('Nuagaon');
  const [newRole, setNewRole] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVoiceSearch = () => {
    triggerToast('Listening for Odia/English name (AC-53 voice search active)...');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setShowRegisterModal(false);
    triggerToast(`Constituent Profile for ${newName} registered successfully!`);
    setNewName('');
    setNewPhone('');
    setNewRole('');
  };

  const filteredConstituents = useMemo(() => {
    return constituentData.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      const matchesGp = selectedGp === 'all' || item.gp === selectedGp;
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;

      return matchesSearch && matchesGp && matchesCat;
    });
  }, [searchQuery, selectedGp, activeCategory]);

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#131b2e] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm text-[#00b57d]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Case History Modal Sheet */}
      {selectedModalCitizen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setSelectedModalCitizen(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffdbcb] text-[#9f4200] flex items-center justify-center font-bold text-xs">
                  <span className="material-symbols-outlined text-base">folder_shared</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#131b2e]">{selectedModalCitizen.name}</h3>
                  <span className="text-[10px] text-[#584237]">{selectedModalCitizen.role}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModalCitizen(null)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#f2f3ff] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#ff7722]">Grievance &amp; Petition Record</span>
                  <span className="text-[10px] text-[#006c49] font-bold">Active File</span>
                </div>
                <p className="text-[#131b2e] mt-1">{selectedModalCitizen.history}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#eaedff] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c49] text-lg">event_available</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#131b2e]">Last Meeting with MLA</span>
                    <span className="text-[10px] text-[#584237]">Korei Camp Office • 18 Oct 2024</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] font-bold">Logged</span>
              </div>

              <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#855300] text-lg">call_log</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#131b2e]">Outbound Helpline Status</span>
                    <span className="text-[10px] text-[#584237]">Resolved via Korei Sevaka Desk</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#584237] text-base">chevron_right</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedModalCitizen(null)}
                className="flex-1 h-10 rounded-xl bg-[#e2e7ff] text-[#131b2e] font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerToast('Case dossier exported to MLA Korei Private Secretariat.');
                  setSelectedModalCitizen(null);
                }}
                className="flex-1 h-10 rounded-xl bg-[#ff7722] text-white font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#9f4200]"
              >
                <span className="material-symbols-outlined text-sm">download</span> Export Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Constituent Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7722] text-xl font-bold">person_add</span>
                <h3 className="text-base font-bold text-[#131b2e]">Register Constituent Profile</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Das..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 94370 00000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Gram Panchayat / Area</label>
                <select
                  value={newGp}
                  onChange={(e) => setNewGp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                >
                  <option value="Nuagaon">Nuagaon GP</option>
                  <option value="Korei Town">Korei Town (Ward 1-12)</option>
                  <option value="Balipatna">Balipatna GP</option>
                  <option value="Vyasanagar">Vyasanagar Boundary Area</option>
                  <option value="Jajpur Road Ward">Jajpur Road Border</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#131b2e] mb-1">Community Role / Representation</label>
                <input
                  type="text"
                  placeholder="e.g. Youth Morcha Convener, Farmer Delegate..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7722]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#e2e7ff] text-[#584237] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ff7722] text-white font-bold shadow-xs hover:bg-[#9f4200] transition-colors"
                >
                  Complete KYC Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-8 space-y-4">
          {/* Sub-Header */}
          <div className="flex flex-col gap-1 pt-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-[#131b2e]">{t('people.title')}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#9f4200] text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span> AC-53
              </span>
            </div>
            <p className="text-xs text-[#584237]">Verified constituent profiles across Korei constituency</p>
          </div>

          {/* Search & Filter Dropdown Bar */}
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#584237] text-xl select-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name, phone, GP, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-20 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs font-medium focus:outline-none focus:bg-[#eaedff] border border-slate-200/60 shadow-xs placeholder:text-slate-400"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  aria-label="Voice Search"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ff7722] hover:bg-[#e2e7ff] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">mic</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Filter options enabled')}
                  aria-label="Filter Results"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#584237] hover:bg-[#e2e7ff] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">tune</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <select
                value={selectedGp}
                onChange={(e) => setSelectedGp(e.target.value)}
                className="w-full h-10 px-3 pr-8 bg-white text-[#131b2e] text-xs font-bold rounded-xl shadow-xs border border-slate-200/80 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="all">All Gram Panchayats (Korei)</option>
                <option value="Nuagaon">Nuagaon GP</option>
                <option value="Korei Town">Korei Town (Ward 1-12)</option>
                <option value="Balipatna">Balipatna GP</option>
                <option value="Vyasanagar">Vyasanagar Boundary Area</option>
                <option value="Jajpur Road Ward">Jajpur Road Border</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#584237] pointer-events-none text-lg">
                expand_more
              </span>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5">
            {[
              { id: 'all', label: 'All (48,200)', icon: 'groups' },
              { id: 'delegations', label: 'Delegations' },
              { id: 'influencers', label: 'Key Influencers' },
              { id: 'beneficiaries', label: 'Beneficiaries' },
              { id: 'seniors', label: 'Senior Citizens' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveCategory(chip.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeCategory === chip.id
                    ? 'bg-[#ff7722] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#584237] hover:bg-[#eaedff]'
                }`}
              >
                {chip.icon && <span className="material-symbols-outlined text-sm">{chip.icon}</span>}
                {chip.label}
              </button>
            ))}
          </div>

          {/* Result Count Bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-[#584237] font-bold uppercase tracking-wide">
              Showing Constituent Profiles
            </span>
            <span
              onClick={() => triggerToast('Sorting set to Active First.')}
              className="text-[11px] text-[#ff7722] font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
            >
              <span className="material-symbols-outlined text-sm">sort</span> Active First
            </span>
          </div>

          {/* Constituent Cards Feed */}
          <div className="flex flex-col gap-3">
            {filteredConstituents.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-2xl p-4 shadow-xs flex flex-col gap-3 border border-slate-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full bg-[#e2e7ff] text-[#9f4200] font-bold text-sm flex items-center justify-center shrink-0">
                      {person.initials}
                      {person.isVerified && (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#006c49] text-white flex items-center justify-center text-[10px]"
                          title="Verified Citizen"
                        >
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#131b2e] truncate">{person.name}</span>
                        {person.starIcon && (
                          <span className="material-symbols-outlined text-[#ff7722] text-sm shrink-0" title="Key Delegate">
                            star
                          </span>
                        )}
                        {person.communityLead && (
                          <span className="material-symbols-outlined text-[#006c49] text-sm shrink-0" title="Community Lead">
                            verified
                          </span>
                        )}
                        {person.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-[#e2e7ff] text-[#131b2e] text-[9px] font-semibold uppercase">
                            {person.badge}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-[#584237] line-clamp-1">{person.role}</span>

                      <div className="flex items-center gap-2 mt-0.5 text-[#584237]">
                        <span className="text-[10px] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {person.location}
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-[10px] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">call</span>
                          {person.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerToast(`Actions menu for ${person.name}`)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#584237] hover:bg-[#f2f3ff] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </div>

                {/* Tag Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {person.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-md ${t.bg} ${t.color} text-[10px] font-semibold flex items-center gap-1`}
                    >
                      <span className="material-symbols-outlined text-xs">{t.icon}</span>
                      {t.text}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <a
                    href={`tel:${person.phone}`}
                    className="flex-1 h-9 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-[#ff7722]">call</span> Call
                  </a>
                  <button
                    type="button"
                    onClick={() => triggerToast(`Opening chat with ${person.name}...`)}
                    className="flex-1 h-9 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-[#006c49]">chat</span> Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModalCitizen(person)}
                    className="h-9 px-3 rounded-xl bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">history</span>
                    <span>Cases</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Register New Constituent Profile Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="w-full h-12 rounded-xl bg-[#ff7722] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:bg-[#9f4200] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-xl">person_add</span>
              <span>Register New Constituent Profile</span>
            </button>
          </div>
        </main>

        <MobileBottomNav />
      </div>

      {/* DESKTOP VIEW (719px AND ABOVE) - IDENTICAL RICH DESIGN */}
      <div className="max-[718px]:hidden space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Verified Constituent Directory</span>
              <span>•</span>
              <span className="text-[#ff7722] font-bold">Korei AC-53 Registry</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Organization Directory &amp; Cadre Index
            </h1>
            <p className="text-xs text-[#584237] mt-0.5">Verified organization, worker &amp; constituent profiles across Korei constituency</p>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 bg-[#ff7722] hover:bg-[#9f4200] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Register New Constituent Profile
          </button>
        </div>

        {/* Desktop Search & Filters */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#584237] text-lg">search</span>
              <input
                type="text"
                placeholder="Search by constituent name, phone, GP, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f2f3ff] border border-slate-200 text-xs font-medium text-[#131b2e] focus:ring-2 focus:ring-[#ff7722]/30"
              />
            </div>

            <select
              value={selectedGp}
              onChange={(e) => setSelectedGp(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#f2f3ff] border border-slate-200 text-xs font-bold text-[#131b2e] cursor-pointer"
            >
              <option value="all">All Gram Panchayats (Korei)</option>
              <option value="Nuagaon">Nuagaon GP</option>
              <option value="Korei Town">Korei Town (Ward 1-12)</option>
              <option value="Balipatna">Balipatna GP</option>
              <option value="Vyasanagar">Vyasanagar Boundary Area</option>
            </select>
          </div>

          {/* Category Filter Chips Desktop */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            {[
              { id: 'all', label: 'All (48,200)', icon: 'groups' },
              { id: 'delegations', label: 'Delegations' },
              { id: 'influencers', label: 'Key Influencers' },
              { id: 'beneficiaries', label: 'Beneficiaries' },
              { id: 'seniors', label: 'Senior Citizens' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveCategory(chip.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeCategory === chip.id
                    ? 'bg-[#ff7722] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#584237] hover:bg-[#eaedff]'
                }`}
              >
                {chip.icon && <span className="material-symbols-outlined text-sm">{chip.icon}</span>}
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Directory Grid with IDENTICAL Rich Mobile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConstituents.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-2xl p-4 shadow-xs flex flex-col gap-3 border border-slate-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full bg-[#e2e7ff] text-[#9f4200] font-bold text-sm flex items-center justify-center shrink-0">
                    {person.initials}
                    {person.isVerified && (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#006c49] text-white flex items-center justify-center text-[10px]"
                        title="Verified Citizen"
                      >
                        <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#131b2e] truncate">{person.name}</span>
                      {person.starIcon && (
                        <span className="material-symbols-outlined text-[#ff7722] text-sm shrink-0" title="Key Delegate">
                          star
                        </span>
                      )}
                      {person.communityLead && (
                        <span className="material-symbols-outlined text-[#006c49] text-sm shrink-0" title="Community Lead">
                          verified
                        </span>
                      )}
                      {person.badge && (
                        <span className="px-1.5 py-0.2 rounded bg-[#e2e7ff] text-[#131b2e] text-[9px] font-semibold uppercase">
                          {person.badge}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[#584237] line-clamp-1">{person.role}</span>

                    <div className="flex items-center gap-2 mt-0.5 text-[#584237]">
                      <span className="text-[10px] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {person.location}
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-[10px] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">call</span>
                        {person.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => triggerToast(`Actions menu for ${person.name}`)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#584237] hover:bg-[#f2f3ff] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5">
                {person.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-md ${t.bg} ${t.color} text-[10px] font-semibold flex items-center gap-1`}
                  >
                    <span className="material-symbols-outlined text-xs">{t.icon}</span>
                    {t.text}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <a
                  href={`tel:${person.phone}`}
                  className="flex-1 h-9 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-[#ff7722]">call</span> Call
                </a>
                <button
                  type="button"
                  onClick={() => triggerToast(`Opening chat with ${person.name}...`)}
                  className="flex-1 h-9 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-[#006c49]">chat</span> Message
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModalCitizen(person)}
                  className="h-9 px-3 rounded-xl bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">history</span>
                  <span>Cases</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
