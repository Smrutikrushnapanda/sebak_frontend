'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMobileSidebar } from '../context/sidebar-context';

interface WorkOrder {
  id: string;
  code: string;
  title: string;
  budget: string;
  status: 'progress' | 'planning' | 'completed';
  statusLabel: string;
  category: string;
  gpLocation: string;
  executingAgency: string;
  contractor: string;
  milestone: string;
  progressPercent: number;
  progressText: string;
  targetDate: string;
  isAuditCleared?: boolean;
  inaugurationReady?: boolean;
  description?: string;
  inspectionLog?: { date: string; note: string; inspector: string }[];
}

const initialWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    code: '#WO-2025-084',
    title: 'Drainage Development at Korei Market',
    budget: '₹38.5 L',
    status: 'progress',
    statusLabel: 'IN PROGRESS',
    category: 'Urban Infrastructure & Sanitation',
    gpLocation: 'Korei Market / Ward 4',
    executingAgency: 'RD Department',
    contractor: 'Maa Tarini Const.',
    milestone: 'Milestone: Pipelaying & culvert reinforcement in progress',
    progressPercent: 65,
    progressText: '65% Completed',
    targetDate: '30 Oct 2025',
    description: 'Construction of 2.4 km covered RCC storm water drainage network to solve chronic waterlogging in Korei commercial area during monsoons.',
    inspectionLog: [
      { date: '10 Sep 2025', note: 'Grade-30 RCC slab casting verified at site segment 3.', inspector: 'Er. R. K. Mohanty (JE)' },
      { date: '28 Aug 2025', note: 'Earth excavation and bed concrete leveling completed.', inspector: 'Er. S. Swain (AE)' },
    ],
  },
  {
    id: 'wo-2',
    code: '#WO-2025-052',
    title: 'Construction of Kalyan Mandap (Community Center)',
    budget: '₹65.0 L',
    status: 'progress',
    statusLabel: 'IN PROGRESS',
    category: 'Community Infrastructure',
    gpLocation: 'Vyasanagar / Korei Border GP',
    executingAgency: 'Panchayati Raj Dept',
    contractor: 'Utkal Builders Ltd.',
    milestone: 'Foundation done, column casting & lintel reinforcement underway',
    progressPercent: 40,
    progressText: '40% Completed',
    targetDate: '15 Jan 2026',
    description: 'Multi-purpose 2-story public hall with capacity of 800 people, equipped with kitchen, dining hall, and solar roof power backup.',
    inspectionLog: [
      { date: '05 Sep 2025', note: 'First floor column shuttering and rebar inspection passed.', inspector: 'Er. P. K. Dash (Executive Engineer)' },
    ],
  },
  {
    id: 'wo-3',
    code: '#WO-2025-103',
    title: 'Solar High-Mast Lighting Installation at 14 Junctions',
    budget: '₹22.0 L',
    status: 'progress',
    statusLabel: 'IN PROGRESS',
    category: 'Renewable Energy & Lighting',
    gpLocation: 'Balipatna GP',
    executingAgency: 'OREDA / RWSS',
    contractor: 'GreenTech Energy',
    milestone: 'Testing phase & luminaire grid connection',
    progressPercent: 85,
    progressText: '85% Completed',
    targetDate: '20 Sep 2025',
    description: '12-meter octagonal high mast solar light poles with dual-battery automatic twilight sensors across key market crossroads in Korei.',
    inspectionLog: [
      { date: '12 Sep 2025', note: '12 out of 14 poles erected and energized. Final 2 poles scheduled.', inspector: 'Er. B. Sahoo' },
    ],
  },
  {
    id: 'wo-4',
    code: '#WO-2024-119',
    title: 'Renovation of CHC Maternity Ward',
    budget: '₹45.0 L',
    status: 'completed',
    statusLabel: 'COMPLETED',
    category: 'Healthcare Infrastructure',
    gpLocation: 'Nuagaon GP',
    executingAgency: 'PWD Health Wing',
    contractor: 'Shree Krishna Infra',
    milestone: 'Quality & Physical Audit 100% Passed',
    progressPercent: 100,
    progressText: '100% Completed',
    targetDate: '15 Aug 2025',
    isAuditCleared: true,
    inaugurationReady: true,
    description: 'Upgradation of 20-bed maternal care wing with centralized oxygen pipeline, LED operating lights, air conditioning, and sanitized recovery rooms.',
    inspectionLog: [
      { date: '18 Aug 2025', note: 'Final PWD quality audit report submitted with zero defects.', inspector: 'Superintending Engineer, Health Wing' },
    ],
  },
  {
    id: 'wo-5',
    code: '#WO-2025-140',
    title: 'Concrete Bridge Construction over Genguti River',
    budget: '₹1.20 Cr',
    status: 'planning',
    statusLabel: 'IN PLANNING',
    category: 'Bridges & Roads',
    gpLocation: 'Pachhikote GP',
    executingAgency: 'Irrigation & Works Dept',
    contractor: 'Tender in Preparation',
    milestone: 'Detailed Project Report (DPR) approved by State Tech Committee',
    progressPercent: 15,
    progressText: '15% Planned',
    targetDate: '30 Dec 2026',
    description: 'High-level bridge connecting Pachhikote and 8 neighboring agricultural villages, reducing commute distance to NH-16 by 14 kilometers.',
    inspectionLog: [
      { date: '01 Sep 2025', note: 'Soil testing and hydraulic survey completed successfully.', inspector: 'State Bridge Planning Bureau' },
    ],
  },
  {
    id: 'wo-6',
    code: '#WO-2024-098',
    title: 'Deep Tube-well & 50,000L Overhead Tank',
    budget: '₹28.4 L',
    status: 'completed',
    statusLabel: 'COMPLETED',
    category: 'Drinking Water & Sanitation',
    gpLocation: 'Balipatna GP',
    executingAgency: 'RWSS Korei',
    contractor: 'Kalinga Aqua Infra',
    milestone: 'Fully Operational & Handed over to GP Water Committee',
    progressPercent: 100,
    progressText: '100% Completed',
    targetDate: '10 Jul 2025',
    isAuditCleared: true,
    inaugurationReady: false,
    description: 'Overhead tank with piped water supply tap connections to 340 rural households in Balipatna village.',
    inspectionLog: [
      { date: '12 Jul 2025', note: 'Water purity test passed (BIS 10500 standards). Handover signed.', inspector: 'RWSS Lab Analyst' },
    ],
  },
];

const gpList = [
  'All GPs / Wards (Korei)',
  'Balipatna GP',
  'Nuagaon GP',
  'Vyasanagar Ward 4',
  'Pachhikote GP',
  'Korei Market / Ward 4',
];

const bottomNavItems = [
  { label: 'Home', icon: 'dashboard', path: '/mobile/dashboard' },
  { label: 'Issues', icon: 'warning', path: '/mobile/issues' },
  { label: 'Works', icon: 'build', path: '/mobile/work-orders', active: true },
  { label: 'Appts', icon: 'calendar_today', path: '/mobile/appointments' },
  { label: 'More', icon: 'grid_view', path: '/mobile/more' },
];

export default function WorkOrders() {
  const { setIsOpen } = useMobileSidebar();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [activeTab, setActiveTab] = useState<'all' | 'progress' | 'planning' | 'completed'>('all');
  const [selectedGp, setSelectedGp] = useState<string>('All GPs / Wards (Korei)');
  const [showGpDropdown, setShowGpDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  
  // Modals state
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [selectedWorkLog, setSelectedWorkLog] = useState<WorkOrder | null>(null);

  // Proposal Form State
  const [newProposal, setNewProposal] = useState({
    title: '',
    budget: '',
    category: 'Roads & Bridges',
    gpLocation: 'Balipatna GP',
    executingAgency: 'RD Department',
    description: '',
  });

  // Calculate Metrics
  const metrics = useMemo(() => {
    const total = workOrders.length;
    const progressCount = workOrders.filter((w) => w.status === 'progress').length;
    const planningCount = workOrders.filter((w) => w.status === 'planning').length;
    const completedCount = workOrders.filter((w) => w.status === 'completed').length;

    return { total, progressCount, planningCount, completedCount };
  }, [workOrders]);

  // Filtered List
  const filteredProjects = useMemo(() => {
    return workOrders.filter((project) => {
      // Tab filter
      if (activeTab !== 'all' && project.status !== activeTab) return false;

      // GP Filter
      if (
        selectedGp !== 'All GPs / Wards (Korei)' &&
        !project.gpLocation.toLowerCase().includes(selectedGp.replace(' GP', '').toLowerCase())
      ) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesCode = project.code.toLowerCase().includes(q);
        const matchesAgency = project.executingAgency.toLowerCase().includes(q);
        const matchesCategory = project.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesAgency && !matchesCategory) return false;
      }

      // Category Modal Filter
      if (selectedCategoryFilter !== 'All' && !project.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [workOrders, activeTab, selectedGp, searchQuery, selectedCategoryFilter]);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.title || !newProposal.budget) return;

    const created: WorkOrder = {
      id: `wo-${Date.now()}`,
      code: `#WO-2025-${Math.floor(100 + Math.random() * 900)}`,
      title: newProposal.title,
      budget: newProposal.budget.startsWith('₹') ? newProposal.budget : `₹${newProposal.budget}`,
      status: 'planning',
      statusLabel: 'IN PLANNING',
      category: newProposal.category,
      gpLocation: newProposal.gpLocation,
      executingAgency: newProposal.executingAgency,
      contractor: 'Pending Tendering',
      milestone: 'Proposal submitted & pending administrative approval',
      progressPercent: 5,
      progressText: '5% Proposal',
      targetDate: '15 Mar 2026',
      description: newProposal.description || 'New infrastructure project proposal submitted via Korei Sevaka portal.',
      inspectionLog: [
        { date: new Date().toLocaleDateString('en-GB'), note: 'Proposal created in portal', inspector: 'MLA Office Admin' },
      ],
    };

    setWorkOrders([created, ...workOrders]);
    setShowProposalModal(false);
    setNewProposal({
      title: '',
      budget: '',
      category: 'Roads & Bridges',
      gpLocation: 'Balipatna GP',
      executingAgency: 'RD Department',
      description: '',
    });
  };

  return (
    <>
      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-24">
        {/* Fixed Mobile Top Header */}
        <header className="fixed top-0 w-full z-50 pt-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-16 px-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsOpen(true)} aria-label="Open Drawer Menu" className="w-10 h-10 flex items-center justify-center rounded-xl text-[#131b2e] hover:bg-[#e2e7ff] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
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
          <div className="flex flex-col w-full pb-6 gap-4 select-none">
            {/* Top Context Bar: Sub-header, Fiscal Year & GP Filter */}
            <div className="flex flex-col gap-1 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ff7722] text-xl font-bold">construction</span>
                  <h1 className="font-bold text-base text-[#131b2e] tracking-tight">Work Orders &amp; Infrastructure</h1>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold shadow-xs">
                  <span className="material-symbols-outlined text-xs text-[#ff7722]">event</span>
                  <span>FY 2025-26</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="relative flex-1">
                  <button
                    onClick={() => setShowGpDropdown(!showGpDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white text-[#131b2e] shadow-xs active:scale-[0.98] transition-transform border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[#ff7722] text-sm">location_on</span>
                      <span className="text-xs font-semibold truncate">{selectedGp}</span>
                    </div>
                    <span className="material-symbols-outlined text-[#584237] text-base">expand_more</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showGpDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 overflow-hidden">
                      {gpList.map((gp) => (
                        <button
                          key={gp}
                          onClick={() => {
                            setSelectedGp(gp);
                            setShowGpDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-orange-50 ${
                            selectedGp === gp ? 'text-[#ff7722] font-bold bg-orange-50' : 'text-slate-700'
                          }`}
                        >
                          <span>{gp}</span>
                          {selectedGp === gp && <span className="material-symbols-outlined text-sm text-[#ff7722]">check</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowFilterModal(true)}
                  aria-label="Filter works"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#131b2e] shadow-xs active:scale-95 transition-transform border border-slate-200/80 ${
                    selectedCategoryFilter !== 'All' ? 'border-[#ff7722] text-[#ff7722] bg-orange-50' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">tune</span>
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="relative mt-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search work orders, code, agency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 shadow-xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Metrics Grid: 4 Categorical Status Tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Active Works */}
              <div onClick={() => setActiveTab('all')} className="cursor-pointer flex flex-col p-3.5 rounded-xl bg-[#e2e7ff] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#584237] uppercase tracking-wider">Active Works</span>
                  <div className="w-7 h-7 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#ff7722]">
                    <span className="material-symbols-outlined text-base">build</span>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-[#131b2e]">{metrics.total}</span>
                <span className="text-[10px] text-[#584237] mt-0.5">Constituency Total</span>
              </div>

              {/* In Progress */}
              <div onClick={() => setActiveTab('progress')} className="cursor-pointer flex flex-col p-3.5 rounded-xl bg-[#ffddb8] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#653e00] uppercase tracking-wider">In Progress</span>
                  <div className="w-7 h-7 rounded-lg bg-[#fea619] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-base">sync</span>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-[#2a1700]">{metrics.progressCount}</span>
                <span className="text-[10px] text-[#653e00] mt-0.5">₹1.42 Cr committed</span>
              </div>

              {/* In Planning */}
              <div onClick={() => setActiveTab('planning')} className="cursor-pointer flex flex-col p-3.5 rounded-xl bg-[#ffdbcb] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#793100] uppercase tracking-wider">In Planning</span>
                  <div className="w-7 h-7 rounded-lg bg-[#ff7722] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-base">architecture</span>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-[#341100]">{metrics.planningCount}</span>
                <span className="text-[10px] text-[#793100] mt-0.5">Estimates approved</span>
              </div>

              {/* Completed */}
              <div onClick={() => setActiveTab('completed')} className="cursor-pointer flex flex-col p-3.5 rounded-xl bg-[#6ffbbe] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#005236] uppercase tracking-wider">Completed</span>
                  <div className="w-7 h-7 rounded-lg bg-[#006c49] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-base">verified</span>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-[#002113]">{metrics.completedCount}</span>
                <span className="text-[10px] text-[#005236] mt-0.5">Audited &amp; Handed over</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
              <button onClick={() => setActiveTab('all')} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${activeTab === 'all' ? 'bg-[#ff7722] text-white' : 'bg-white text-[#584237]'}`}>
                All ({metrics.total})
              </button>
              <button onClick={() => setActiveTab('progress')} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${activeTab === 'progress' ? 'bg-[#ff7722] text-white' : 'bg-white text-[#584237]'}`}>
                In Progress ({metrics.progressCount})
              </button>
              <button onClick={() => setActiveTab('planning')} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${activeTab === 'planning' ? 'bg-[#ff7722] text-white' : 'bg-white text-[#584237]'}`}>
                Planning ({metrics.planningCount})
              </button>
              <button onClick={() => setActiveTab('completed')} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${activeTab === 'completed' ? 'bg-[#ff7722] text-white' : 'bg-white text-[#584237]'}`}>
                Completed ({metrics.completedCount})
              </button>
            </div>

            {/* Project Cards List */}
            <div className="flex flex-col gap-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex flex-col p-4 rounded-xl bg-white shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {project.status === 'progress' && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#653e00] text-[10px] font-semibold tracking-wide">
                            IN PROGRESS
                          </span>
                        )}
                        {project.status === 'planning' && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdbcb] text-[#793100] text-[10px] font-semibold tracking-wide">
                            IN PLANNING
                          </span>
                        )}
                        {project.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#005236] text-[10px] font-semibold tracking-wide flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">done_all</span> COMPLETED
                          </span>
                        )}
                        <span className="text-[10px] text-[#584237] font-mono">{project.code}</span>
                      </div>
                      <h2 className="text-sm font-bold text-[#131b2e] leading-snug line-clamp-2">{project.title}</h2>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-sm font-extrabold text-[#9f4200]">{project.budget}</span>
                      <span className="text-[10px] text-[#584237]">{project.status === 'completed' ? 'Completed' : 'Sanctioned'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 bg-[#f2f3ff] p-2.5 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#855300] text-sm">apartment</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-[#584237]">Executing Agency</span>
                        <span className="text-xs text-[#131b2e] font-medium truncate">{project.executingAgency}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#855300] text-sm">badge</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-[#584237]">Contractor</span>
                        <span className="text-xs text-[#131b2e] font-medium truncate">{project.contractor}</span>
                      </div>
                    </div>
                  </div>

                  {project.milestone && (
                    <div className="flex items-center gap-1.5 mt-3 text-[#855300] text-xs">
                      <span className="material-symbols-outlined text-base">commit</span>
                      <span className="font-semibold">{project.milestone}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 mt-2.5">
                    <div className="flex justify-between items-center text-[#584237] text-xs">
                      <span>Physical Progress</span>
                      <span className="text-[#9f4200] font-bold">{project.progressText}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#e2e7ff] overflow-hidden">
                      <div className="h-full rounded-full bg-[#ff7722] transition-all duration-500" style={{ width: `${project.progressPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 text-[#584237] text-xs border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">calendar_month</span>
                      <span>Target: {project.targetDate}</span>
                    </div>
                    <button onClick={() => setSelectedWorkLog(project)} className="flex items-center gap-0.5 text-[#ff7722] font-bold">
                      <span>Inspect Log</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Sticky Button */}
            <div className="sticky bottom-20 z-40 self-center flex justify-center w-full mt-2 pointer-events-none">
              <button
                onClick={() => setShowProposalModal(true)}
                className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full bg-[#ff7722] text-white font-semibold shadow-lg active:scale-95 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                <span>+ New Work Proposal</span>
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
        {/* Top Desktop Breadcrumbs & Action Bar */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Constituency Infrastructure Engine</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">5T &amp; PWD Connected</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Work Orders &amp; Infrastructure Monitoring Desk
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProposalModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>+ New Work Proposal</span>
            </button>
          </div>
        </div>

        {/* 4 Large Desktop Metric Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div onClick={() => setActiveTab('all')} className={`cursor-pointer rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all ${activeTab === 'all' ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Active Works</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.total}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined text-xl">build</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Constituency Total Pipeline
            </div>
          </div>

          <div onClick={() => setActiveTab('progress')} className={`cursor-pointer rounded-2xl p-4 bg-amber-50/60 border border-amber-200/80 shadow-xs flex flex-col justify-between transition-all ${activeTab === 'progress' ? 'ring-2 ring-amber-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">In Progress</span>
                <div className="text-2xl font-extrabold text-amber-950 mt-1">{metrics.progressCount}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-xl">sync</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-amber-200/40 text-xs text-amber-800 font-semibold">
              ₹1.42 Cr Funds Committed
            </div>
          </div>

          <div onClick={() => setActiveTab('planning')} className={`cursor-pointer rounded-2xl p-4 bg-orange-50/60 border border-orange-200/80 shadow-xs flex flex-col justify-between transition-all ${activeTab === 'planning' ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-900">In Planning</span>
                <div className="text-2xl font-extrabold text-orange-950 mt-1">{metrics.planningCount}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-200/80 flex items-center justify-center text-orange-800">
                <span className="material-symbols-outlined text-xl">architecture</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-orange-200/40 text-xs text-orange-800 font-semibold">
              Estimates Approved by EE
            </div>
          </div>

          <div onClick={() => setActiveTab('completed')} className={`cursor-pointer rounded-2xl p-4 bg-emerald-50/60 border border-emerald-200/80 shadow-xs flex flex-col justify-between transition-all ${activeTab === 'completed' ? 'ring-2 ring-emerald-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Completed Works</span>
                <div className="text-2xl font-extrabold text-emerald-950 mt-1">{metrics.completedCount}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-200/80 flex items-center justify-center text-emerald-800">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-emerald-200/40 text-xs text-emerald-800 font-semibold">
              Audited &amp; Handed Over
            </div>
          </div>
        </div>

        {/* Desktop Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search by title, code, agency, contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({metrics.total})
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'progress' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Progress ({metrics.progressCount})
            </button>
            <button
              onClick={() => setActiveTab('planning')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'planning' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Planning ({metrics.planningCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'completed' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Completed ({metrics.completedCount})
            </button>
          </div>
        </div>

        {/* Desktop Data Grid / Cards View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.status === 'progress' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">
                        IN PROGRESS
                      </span>
                    )}
                    {project.status === 'planning' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[10px] font-bold uppercase">
                        IN PLANNING
                      </span>
                    )}
                    {project.status === 'completed' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">done_all</span> COMPLETED
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-400 font-mono">{project.code}</span>
                  </div>
                  <span className="text-lg font-extrabold text-orange-600">{project.budget}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{project.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Executing Agency</span>
                  <span className="font-semibold text-slate-800">{project.executingAgency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Contractor</span>
                  <span className="font-semibold text-slate-800">{project.contractor}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-slate-600">Physical Completion</span>
                  <span className="text-orange-600">{project.progressText}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-orange-600 transition-all duration-500" style={{ width: `${project.progressPercent}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Target: {project.targetDate}</span>
                <button
                  onClick={() => setSelectedWorkLog(project)}
                  className="flex items-center gap-1 text-orange-600 font-bold hover:underline"
                >
                  <span>Inspect Full Log</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Modals */}
      {selectedWorkLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-5">
            <div className="p-4 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold">
                    {selectedWorkLog.code}
                  </span>
                  <span className="text-slate-400 text-xs">{selectedWorkLog.category}</span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{selectedWorkLog.title}</h3>
              </div>
              <button onClick={() => setSelectedWorkLog(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-orange-50/60 border border-orange-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Sanctioned Budget</span>
                  <span className="text-base font-extrabold text-orange-600">{selectedWorkLog.budget}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Current Status</span>
                  <span className="text-xs font-bold text-slate-800">{selectedWorkLog.progressText}</span>
                </div>
              </div>

              {selectedWorkLog.description && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Project Objective</h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedWorkLog.description}
                  </p>
                </div>
              )}

              {selectedWorkLog.inspectionLog && selectedWorkLog.inspectionLog.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Site Inspection &amp; Audit Logs</h4>
                  <div className="space-y-2 border-l-2 border-orange-200 ml-2 pl-3">
                    {selectedWorkLog.inspectionLog.map((log, idx) => (
                      <div key={idx} className="relative mb-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span>{log.date}</span>
                          <span className="text-slate-600 font-semibold">{log.inspector}</span>
                        </div>
                        <p className="text-xs text-slate-800 mt-0.5 font-medium">{log.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button onClick={() => setSelectedWorkLog(null)} className="flex-1 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showProposalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Submit New Work Proposal</h3>
              <button onClick={() => setShowProposalModal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Work Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concrete Road & Guard Wall at Nuagaon GP"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estimated Budget</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹35.0 L"
                    value={newProposal.budget}
                    onChange={(e) => setNewProposal({ ...newProposal, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gram Panchayat</label>
                  <select
                    value={newProposal.gpLocation}
                    onChange={(e) => setNewProposal({ ...newProposal, gpLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  >
                    <option value="Balipatna GP">Balipatna GP</option>
                    <option value="Nuagaon GP">Nuagaon GP</option>
                    <option value="Vyasanagar Ward 4">Vyasanagar Ward 4</option>
                    <option value="Pachhikote GP">Pachhikote GP</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowProposalModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs">
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
