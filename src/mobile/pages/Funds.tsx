'use client';

import React, { useState } from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';
import { useLanguage } from '@/context/language-context';


interface FundStream {
  id: string;
  name: string;
  subtitle: string;
  allocated: string;
  spent: string;
  balance: string;
  spentPercentage: number;
  badgeClass: string;
  barColor: string;
  icon: string;
  bgIconColor: string;
  iconColor: string;
}

interface Transaction {
  id: string;
  title: string;
  location: string;
  date: string;
  amount: string;
  type: 'disbursed' | 'credited';
  statusText: string;
}

const fundStreamsData: FundStream[] = [
  {
    id: 'stream-1',
    name: 'MLALAD Scheme',
    subtitle: 'MLA Local Area Development',
    allocated: '₹ 3.0 Cr',
    spent: '₹ 1.9 Cr',
    balance: '₹ 1.1 Cr',
    spentPercentage: 63,
    badgeClass: 'bg-[#f2f3ff] text-[#9f4200]',
    barColor: 'bg-[#9f4200]',
    icon: 'assured_workload',
    bgIconColor: 'bg-[#FFF7ED]',
    iconColor: 'text-[#9f4200]',
  },
  {
    id: 'stream-2',
    name: 'Special Problem Fund (SPF)',
    subtitle: 'SPF Urgent Public Relief',
    allocated: '₹ 1.0 Cr',
    spent: '₹ 60 L',
    balance: '₹ 40 L',
    spentPercentage: 60,
    badgeClass: 'bg-[#f2f3ff] text-[#9f4200]',
    barColor: 'bg-[#fea619]',
    icon: 'warning_amber',
    bgIconColor: 'bg-[#e2e7ff]',
    iconColor: 'text-[#ff7722]',
  },
  {
    id: 'stream-3',
    name: 'Rural Infrastructure (RIDF)',
    subtitle: 'NABARD Co-Sponsored',
    allocated: '₹ 50 L',
    spent: '₹ 20 L',
    balance: '₹ 30 L',
    spentPercentage: 40,
    badgeClass: 'bg-[#f2f3ff] text-[#006c49]',
    barColor: 'bg-[#006c49]',
    icon: 'handyman',
    bgIconColor: 'bg-[#ECFDF5]',
    iconColor: 'text-[#006c49]',
  },
];

const transactionsData: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Drain Work - Phase 1',
    location: 'Korei Market',
    date: '10 Sep 2025',
    amount: '- ₹ 12,40,000',
    type: 'disbursed',
    statusText: 'Disbursed',
  },
  {
    id: 'tx-2',
    title: 'Solar Light Procurement',
    location: 'Jajpur Road Div.',
    date: '05 Sep 2025',
    amount: '- ₹ 8,50,000',
    type: 'disbursed',
    statusText: 'Disbursed',
  },
  {
    id: 'tx-3',
    title: 'Balipatna Road Grant',
    location: 'Sanction Credit',
    date: '01 Sep 2025',
    amount: '+ ₹ 25,00,000',
    type: 'credited',
    statusText: 'Credited',
  },
  {
    id: 'tx-4',
    title: 'Nuagaon CHC Repair Grant',
    location: 'Nuagaon GP',
    date: '28 Aug 2025',
    amount: '- ₹ 5,20,000',
    type: 'disbursed',
    statusText: 'Disbursed',
  },
];

export default function Funds() {
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showAllTransactions, setShowAllTransactions] = useState<boolean>(false);

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  return (
    <>
      {/* MOBILE VIEW (BELOW 719px) */}
      <div className="min-[719px]:hidden min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col relative w-full pb-20">
        {/* Scrollable Mobile Body */}
        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto">
          <div className="flex flex-col w-full pb-8">
            {/* Sub-Header Status Bar */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#9f4200] text-lg">account_balance</span>
                <span className="font-bold text-xs text-[#131b2e]">Financial Year 2025 - 2026</span>
              </div>
              <div className="flex items-center gap-1 bg-[#e2e7ff] px-2.5 py-0.5 rounded-full text-[#584237] text-xs font-semibold">
                <span className="material-symbols-outlined text-xs text-[#9f4200]">location_on</span>
                <span>Korei (AC-53)</span>
              </div>
            </div>

            {/* Hero Budget Card in Rich Warm Saffron Gradient */}
            <div className="px-4 mb-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff7722] via-[#ea580c] to-[#9f4200] p-4 text-white shadow-lg shadow-orange-600/20">
                {/* Sunburst Backing SVG */}
                <svg className="absolute -right-8 -top-8 w-44 h-44 text-white/10 pointer-events-none" fill="currentColor" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="28"></circle>
                  <path d="M50 0 L54 20 L50 16 L46 20 Z"></path>
                  <path d="M50 100 L54 80 L50 84 L46 80 Z"></path>
                  <path d="M0 50 L20 54 L16 50 L20 46 Z"></path>
                  <path d="M100 50 L80 54 L84 50 L80 46 Z"></path>
                </svg>

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 opacity-90 mb-0.5">
                        <span className="material-symbols-outlined text-sm">monetization_on</span>
                        <span className="text-[10px] tracking-wider uppercase font-semibold">Total Available Balance</span>
                      </div>
                      <div className="text-3xl font-extrabold tracking-tight">₹ 1.8 Cr</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse"></span>
                      <span className="text-[10px] font-bold text-white">Active Grant</span>
                    </div>
                  </div>

                  {/* Progress Bar & Rate */}
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="flex justify-between items-center text-xs text-white/90">
                      <span>Overall Funds Disbursed</span>
                      <span className="font-bold">60%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-white rounded-full w-[60%] transition-all duration-500"></div>
                    </div>
                  </div>

                  {/* Metric Split Tiles */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white/15 backdrop-blur-xs rounded-xl p-2.5">
                      <span className="text-[10px] text-white/80 block">Total Sanctioned</span>
                      <span className="text-base font-bold">₹ 4.5 Cr</span>
                    </div>
                    <div className="bg-white/15 backdrop-blur-xs rounded-xl p-2.5">
                      <span className="text-[10px] text-white/80 block">Utilized / Spent</span>
                      <span className="text-base font-bold">₹ 2.7 Cr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fund Streams Breakdown Section */}
            <div className="px-4 flex flex-col gap-3 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#9f4200] text-xl">pie_chart</span>
                  <h2 className="font-bold text-sm text-[#131b2e]">Fund Streams Breakdown</h2>
                </div>
                <span className="text-[10px] text-[#584237] bg-[#e2e7ff] px-2 py-0.5 rounded-full font-semibold">
                  3 Active Heads
                </span>
              </div>

              {fundStreamsData.map((stream) => (
                <div key={stream.id} className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl ${stream.bgIconColor} flex items-center justify-center ${stream.iconColor}`}>
                        <span className="material-symbols-outlined text-xl">{stream.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-[#131b2e] leading-tight">{stream.name}</h3>
                        <p className="text-[10px] text-[#584237]">{stream.subtitle}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${stream.badgeClass}`}>
                      {stream.spentPercentage}% Spent
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#f2f3ff]/70 p-2.5 rounded-lg mb-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#584237] block">Allocated</span>
                      <span className="font-bold text-[#131b2e]">{stream.allocated}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#584237] block">Spent</span>
                      <span className="font-bold text-[#855300]">{stream.spent}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#584237] block">Balance</span>
                      <span className="font-bold text-[#006c49]">{stream.balance}</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#e2e7ff] h-1.5 rounded-full overflow-hidden">
                    <div className={`${stream.barColor} h-full rounded-full`} style={{ width: `${stream.spentPercentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Expenditure Transactions */}
            <div className="px-4 flex flex-col gap-3 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#9f4200] text-xl">receipt_long</span>
                  <h2 className="font-bold text-sm text-[#131b2e]">Recent Transactions</h2>
                </div>
                <button
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                  className="text-xs font-semibold text-[#9f4200] flex items-center"
                >
                  <span>{showAllTransactions ? 'Show Less' : 'View All'}</span>
                  <span className="material-symbols-outlined text-sm">
                    {showAllTransactions ? 'expand_less' : 'chevron_right'}
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {(showAllTransactions ? transactionsData : transactionsData.slice(0, 3)).map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="bg-white p-3.5 rounded-xl flex items-center justify-between shadow-xs border border-slate-100 cursor-pointer active:scale-[0.99] transition-transform"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === 'disbursed' ? 'bg-[#FEF2F2] text-[#ba1a1a]' : 'bg-[#ECFDF5] text-[#006c49]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {tx.type === 'disbursed' ? 'arrow_outward' : 'call_received'}
                        </span>
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-xs text-[#131b2e] truncate">{tx.title}</h4>
                        <p className="text-[10px] text-[#584237] flex items-center gap-1">
                          <span>{tx.location}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span
                        className={`font-bold text-xs block ${
                          tx.type === 'disbursed' ? 'text-[#ba1a1a]' : 'text-[#006c49]'
                        }`}
                      >
                        {tx.amount}
                      </span>
                      <span className="text-[10px] text-[#584237]">{tx.statusText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Download Button */}
            <div className="px-4 pt-1">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="w-full h-12 bg-[#ff7722] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 active:scale-[0.98] transition-transform hover:bg-[#ea580c]"
              >
                {downloading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    <span>Preparing Audit Dossier...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Statement Generated (PDF Downloaded)</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                    <span>Download Audit Statement &amp; UC (PDF)</span>
                  </>
                )}
              </button>
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
              <span>Financial Audit &amp; Budget Engine</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">Korei AC-53 FY 2025-26</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Fund Allocations &amp; Grant Utilization Desk
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              <span>Download Full Audit Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* Desktop Hero Summary Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">Available Balance</span>
              <div className="text-3xl font-extrabold mt-1">₹ 1.8 Cr</div>
            </div>
            <div className="mt-4 pt-2 border-t border-white/20 text-xs font-semibold">Active Grant Disbursed 60%</div>
          </div>

          <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Sanctioned</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">₹ 4.5 Cr</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined text-xl">account_balance</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500">State Budget Sanction</div>
          </div>

          <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Utilized / Spent</span>
                <div className="text-2xl font-extrabold text-amber-700 mt-1">₹ 2.7 Cr</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined text-xl">payments</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500">UC Submitted to AG</div>
          </div>

          <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Schemes</span>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">3 Schemes</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-xl">pie_chart</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-xs text-slate-500 font-semibold text-emerald-700">MLALAD, SPF, RIDF</div>
          </div>
        </div>

        {/* Desktop Breakdown & Transactions Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fund Streams */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Fund Streams Allocation Breakdown</h3>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                3 Major Schemes
              </span>
            </div>

            <div className="space-y-3">
              {fundStreamsData.map((stream) => (
                <div key={stream.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{stream.name}</h4>
                      <span className="text-xs text-slate-500">{stream.subtitle}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900">
                      {stream.spentPercentage}% Disbursed
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-center">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Allocated</span>
                      <span className="font-extrabold text-slate-900">{stream.allocated}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Disbursed</span>
                      <span className="font-extrabold text-amber-700">{stream.spent}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Unspent Balance</span>
                      <span className="font-extrabold text-emerald-700">{stream.balance}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-600 h-full rounded-full" style={{ width: `${stream.spentPercentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Recent Transactions Side Table */}
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Recent Expenditure</h3>
              <span className="text-xs font-bold text-orange-600">Disbursement Log</span>
            </div>

            <div className="space-y-3">
              {transactionsData.map((tx) => (
                <div key={tx.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                    <span className="text-[10px] text-slate-500">{tx.location} • {tx.date}</span>
                  </div>
                  <span className={`text-xs font-extrabold ${tx.type === 'disbursed' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl p-4 animate-in zoom-in-95 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900">Transaction Details</h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 text-[10px] block">Title</span>
                <span className="font-bold text-slate-900 text-sm">{selectedTx.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">Location</span>
                  <span className="font-semibold text-slate-800">{selectedTx.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Date</span>
                  <span className="font-semibold text-slate-800">{selectedTx.date}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Transaction Amount</span>
                <span className={`font-extrabold text-sm ${selectedTx.type === 'disbursed' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {selectedTx.amount}
                </span>
              </div>
            </div>

            <button onClick={() => setSelectedTx(null)} className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs">
              Close Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}
