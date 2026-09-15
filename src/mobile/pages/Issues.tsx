'use client';

import React from 'react';
import { MobileBottomNav } from '@/mobile/components/MobileBottomNav';


const appStats = [
  { label: 'Overdue', value: '8', top: 'bg-[#b91c1c]', text: 'text-[#b91c1c]' },
  { label: 'Due Soon', value: '12', top: 'bg-[#f59e0b]', text: 'text-[#9a5b00]' },
  { label: 'In Review', value: '5', top: 'bg-[#ff7119]', text: 'text-[#ff7119]' },
  { label: 'Closed', value: '23', top: 'bg-[#047857]', text: 'text-[#047857]' },
];

const desktopStats = [
  ['Critical Action', '08', 'SLA Breached > 24 hrs', 'Needs MLA Intervention', 'running_with_errors', 'bg-[#ffdad6] text-[#ba1a1a]'],
  ['High Priority', '12', 'Expiring within 24h', 'Automated Alert Sent', 'hourglass_top', 'bg-[#ffedd5] text-[#ff7119]'],
  ['Department Review', '05', 'With BDO & Tahasildar', 'Investigation', 'assignment_turned_in', 'bg-[#eaedff] text-[#ff7119]'],
  ['Resolved in November', '23', '96.4% Satisfaction Rate', 'Audited', 'verified', 'bg-[#f2f3ff] text-[#047857]'],
];

const filters = [
  { label: 'All', count: 48, className: 'bg-[#ff7119] text-white shadow-sm shadow-orange-500/25' },
  { label: 'Overdue', count: 8, className: 'bg-[#eceefe] text-[#23151c]' },
  { label: 'Due Soon', count: 12, className: 'bg-[#eceefe] text-[#23151c]' },
  { label: 'In Review', count: 5, className: 'bg-[#eceefe] text-[#23151c]' },
];

const appIssues = [
  {
    id: '#KS-2025-089',
    alert: '2 DAYS OVERDUE',
    alertClassName: 'bg-[#ffe0df] text-[#a40d0d]',
    category: 'Roads & Transport',
    title: 'New road issue reported in Ward 12',
    location: 'Balipatna GP',
    detail: 'Culvert washed out near High School',
    initials: 'RS',
    citizen: 'Ramesh Sahu',
    role: 'Ward Member - Ward 12',
    priority: 'Priority: High',
    date: '12 Sep 2025',
    footer: 'SLA Breached (48h)',
    footerIcon: 'schedule',
    primaryAction: 'Escalate to BDO',
    secondaryAction: 'Call',
    progress: null,
  },
  {
    id: '#KS-2025-074',
    alert: 'ASSIGNED TO JE RWSS',
    alertClassName: 'bg-[#ffedd5] text-[#9a3412]',
    category: 'Public Health & Water',
    title: 'Water supply pipeline leakage at Nuagaon chowk',
    location: 'Nuagaon GP',
    detail: 'Main line valve burst, low pressure',
    initials: 'MJ',
    citizen: 'Smt. Minati Jena',
    role: 'Citizen - Nuagaon',
    priority: 'Priority: Medium',
    date: '11 Sep 2025',
    footer: 'Spares dispatched by RWSS',
    footerIcon: 'check_circle',
    primaryAction: 'View Log',
    secondaryAction: null,
    progress: 60,
  },
  {
    id: '#KS-2025-061',
    alert: 'DUE IN 24 HRS',
    alertClassName: 'bg-[#fde68a] text-[#92400e]',
    category: 'Education & Infrastructure',
    title: 'Primary School Boundary Wall Repair',
    location: 'Korei Town GP',
    detail: 'Safety hazard near playground',
    initials: 'SM',
    citizen: 'SMC Committee Head',
    role: 'Govt. UG High School',
    priority: 'Priority: Normal',
    date: '10 Sep 2025',
    footer: 'Tender approval pending',
    footerIcon: 'timer',
    primaryAction: 'Send Reminder',
    secondaryAction: null,
    progress: null,
  },
];

const desktopRows = [
  ['#KS-2025-089', 'Roads & Culvert Collapse', 'Balipatna GP', 'Pramod Rout', 'Rural Works Department', 'Breached by 18 hrs', 'Escalate'],
  ['#KS-2025-077', 'Drinking Water Pipeline Leakage', 'Nuagaon GP', 'Mamata Jena', 'JE RWSS Korei Section', 'Due in 6 hrs', 'Notify JE'],
  ['#KS-2025-061', 'School Boundary Wall Structural Crack', 'Tulati GP', 'Ashok Mohanty', 'Block Education Officer', 'Field Inspection 60%', 'View Report'],
  ['#KS-2025-045', 'TPCODL Phase Failure & Streetlight Pole', 'Jakhapura GP', 'Debendra Sahu', 'TPCODL SDO Vyasanagar', 'Due in 14 hrs', 'Alert Feeder'],
  ['#KS-2025-038', 'Madhu Babu Pension Direct Disbursal Delay', 'Barundei GP', 'Basanti Dei', 'BSSO Korei & Tahasildar', 'Bank Re-Verification 90%', 'Direct Credit'],
];

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined leading-none ${className}`}>{name}</span>;
}

function AppIssueCard({ issue }: { issue: (typeof appIssues)[number] }) {
  return (
    <article className="rounded-[14px] bg-white p-4 shadow-[0_4px_18px_rgba(19,27,46,0.08)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${issue.alertClassName}`}>{issue.alert}</span>
          <span className="rounded-full bg-[#e7e8f7] px-2.5 py-1 text-[10px] text-[#4b445f]">{issue.category}</span>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-[#21151d]">{issue.id}</span>
      </div>

      <h2 className="text-[20px] font-semibold leading-[25px] text-[#0d0b15]">{issue.title}</h2>
      <div className="mt-2 flex items-center gap-2 text-[14px] text-[#3b2b28]">
        <Icon name="location_on" className="text-[18px] text-[#ff7119]" />
        <span className="font-semibold">{issue.location}</span>
        <span className="text-[#e5b7a4]">-</span>
        <span className="truncate">{issue.detail}</span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[10px] bg-[#f0f1ff] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffdaca] text-xs font-semibold text-[#b84213]">
            {issue.initials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-[#16121f]">{issue.citizen}</div>
            <div className="truncate text-[11px] text-[#3b2b28]">{issue.role}</div>
          </div>
        </div>
        <div className="shrink-0 text-right text-[11px] leading-tight text-[#1f1724]">
          <div>{issue.priority}</div>
          <div>{issue.date}</div>
        </div>
      </div>

      {issue.progress !== null && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="text-[#3b2b28]">Field Verification Complete</span>
            <span className="font-medium text-[#ff7119]">In Progress ({issue.progress}%)</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#dfe1fa]">
            <div className="h-full rounded-full bg-[#ff7119]" style={{ width: `${issue.progress}%` }} />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[12px] font-medium text-[#9a3412]">
          <Icon name={issue.footerIcon} className="text-[18px]" />
          <span className="truncate">{issue.footer}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {issue.secondaryAction && (
            <button className="flex h-10 items-center gap-1.5 rounded-[10px] bg-[#e5e8ff] px-4 text-[13px] font-semibold text-[#11101a]" type="button">
              <Icon name="phone" className="text-[17px]" />
              <span>{issue.secondaryAction}</span>
            </button>
          )}
          <button className="flex h-10 items-center gap-1.5 rounded-[10px] bg-[#ff7119] px-4 text-[13px] font-semibold text-white shadow-sm" type="button">
            <span>{issue.primaryAction}</span>
            {issue.primaryAction !== 'Escalate to BDO' && <Icon name="chevron_right" className="text-[17px]" />}
          </button>
        </div>
      </div>
    </article>
  );
}

function AppIssuesView() {
  return (
    <div className="min-[719px]:hidden min-h-screen bg-[#f8f6ff] pb-28 font-['Plus_Jakarta_Sans'] text-[#17111c]">
      <header className="sticky top-0 z-20 flex h-[80px] items-center justify-between border-b border-[#edeaf8] bg-[#fbf9ff]/95 px-5 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
        </div>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-full bg-[#e9eaff] p-0.5 text-[11px] font-semibold">
            <span className="rounded-full bg-[#ff7119] px-2.5 py-1 text-white">EN</span>
            <span className="px-2.5 py-1 text-[#3b2b28]">ଓଡ଼ିଆ</span>
          </div>
          <div className="relative">
            <Icon name="notifications" className="text-[25px]" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-[#b91c1c]" />
          </div>
          <div className="relative h-11 w-11 rounded-full border-2 border-[#ff7119] bg-[#ffe1d2]">
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#047857]" />
          </div>
        </div>
      </header>

      <main className="px-5 pt-4">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[23px] font-bold leading-7 tracking-tight">Citizen Grievances</h1>
            <p className="text-[14px] text-[#3b2b28]">Korei Assembly Constituency - 48 Open</p>
          </div>
          <div className="mt-1 flex shrink-0 items-center gap-2 rounded-full bg-[#e8eaff] px-3 py-2 text-[13px] font-medium shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#b91c1c]" />
            <span>Live Queue</span>
          </div>
        </div>

        <section className="mb-4 rounded-[16px] bg-white p-3 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
          <div className="relative mb-3">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[24px] text-[#3b2b28]" />
            <input className="h-12 w-full rounded-[10px] bg-[#f0f1ff] px-11 text-[15px] text-[#3b2b28] outline-none" placeholder="Search grievance ID, reporter, GP..." type="text" />
            <Icon name="mic" className="absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#3b2b28]" />
          </div>
          <div className="flex items-center gap-3">
            <Icon name="location_on" className="text-[20px] text-[#3b2b28]" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6b5551]">Territory:</span>
            <select className="ml-auto h-10 min-w-[180px] rounded-[9px] bg-[#dfe2fb] px-4 text-right text-[16px] outline-none">
              <option>Balipatna GP</option>
              <option>Nuagaon GP</option>
              <option>Korei Town GP</option>
            </select>
          </div>
        </section>

        <section className="mb-4 grid grid-cols-4 gap-2">
          {appStats.map((item) => (
            <div key={item.label} className="relative overflow-hidden rounded-[13px] bg-white px-2 py-3 text-center shadow-[0_6px_18px_rgba(19,27,46,0.08)]">
              <span className={`absolute inset-x-0 top-0 h-1 ${item.top}`} />
              <div className={`text-[25px] font-bold leading-7 ${item.text}`}>{item.value}</div>
              <div className="mt-1 text-[12px] text-[#17111c]">{item.label}</div>
            </div>
          ))}
        </section>

        <section className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter, index) => (
            <button key={filter.label} className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-semibold ${filter.className}`} type="button">
              {index > 0 && <span className={`h-2 w-2 rounded-full ${index === 1 ? 'bg-[#b91c1c]' : index === 2 ? 'bg-[#f59e0b]' : 'bg-[#ffc199]'}`} />}
              <span>{filter.label} ({filter.count})</span>
            </button>
          ))}
        </section>

        <section className="space-y-4">
          {appIssues.map((issue) => (
            <AppIssueCard key={issue.id} issue={issue} />
          ))}
        </section>

        <section className="mt-5 rounded-[14px] bg-[#f0f1ff] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffdaca] text-[#ff7119]">
              <Icon name="campaign" className="text-[25px]" />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold">Prompt Redressal Guarantee</h2>
              <p className="text-[14px] leading-5 text-[#3b2b28]">Average grievance resolution speed in Korei is 3.2 days under Mo Sarkar norms.</p>
            </div>
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}

function DesktopIssuesView() {
  return (
    <div className="max-[718px]:hidden -m-5 min-h-screen bg-[#faf8ff] px-4 py-4 font-['Plus_Jakarta_Sans'] text-[#131b2e] sm:-m-7 sm:px-6 sm:py-5">
      <div className="flex w-full flex-col pb-6">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
              <span>Grievance Monitoring Engine</span>
              <span>-</span>
              <span className="font-bold text-[#006c49]">5T Citizen Portal Connected</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold leading-8 tracking-tight text-[#131b2e]">Citizen Grievances & Redressal Desk</h1>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ffdad6] px-2.5 py-1 text-[11px] font-bold text-[#93000a]">
                <span className="h-2 w-2 rounded-full bg-[#ba1a1a] animate-ping" />
                <span>Live Queue: 48 Open Issues</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['Mo Sarkar 5T Sync', 'Export CSV'].map((label) => (
              <button key={label} className="flex h-10 items-center gap-1 rounded-xl bg-white px-3.5 text-[13px] font-bold text-[#131b2e] shadow-sm transition-colors hover:bg-[#eaedff]" type="button">
                <Icon name={label === 'Export CSV' ? 'download' : 'sync'} className={`text-[18px] ${label === 'Export CSV' ? 'text-[#6b7280]' : 'text-[#006c49]'}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {desktopStats.map(([label, value, detail, badge, icon, className]) => (
            <div key={label} className={`relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-xl p-4 shadow-sm ${className}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  <div className="mt-0.5 text-[22px] font-extrabold leading-[26px] tracking-tight">{value}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                  <Icon name={icon} className="text-[24px]" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/10 pt-2">
                <span className="text-xs font-medium">{detail}</span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold">{badge}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-col items-start justify-between gap-3 rounded-xl bg-gradient-to-r from-[#ffedd5] via-[#fed7aa]/50 to-[#f2f3ff] p-4 shadow-sm lg:flex-row lg:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff7119] text-white shadow-md shadow-orange-500/20">
              <Icon name="replace_video" className="text-[26px]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="rounded-full bg-[#ffdad6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a]">Red Escalation #KS-2025-014</span>
                <span className="text-[10px] font-bold text-[#ff7119]">Nuagaon GP - Ward 04</span>
                <span className="text-[10px] text-[#6b7280]">Reported 32h ago</span>
              </div>
              <h2 className="mt-1 text-base font-bold leading-6 text-[#131b2e]">Acute Potable Water Pipeline Rupture affecting 1,400+ Residents at Nuagaon Harijan Sahi</h2>
              <p className="mt-0.5 text-xs leading-4 text-[#584237]">Requires immediate MLA D.O. Letter to Jajpur District Collector for emergency water tanker deployment and transformer replacement.</p>
            </div>
          </div>
          <button className="flex h-10 items-center gap-1 rounded-xl bg-[#ff7119] px-4 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#ea580c]" type="button">
            <Icon name="forward_to_inbox" className="text-[18px]" />
            <span>Dispatch D.O. Letter</span>
          </button>
        </div>

        <div className="mb-3 flex flex-col justify-between gap-3 rounded-xl bg-white p-3 shadow-sm xl:flex-row xl:items-center">
          <div className="relative min-w-[240px] flex-1">
            <Icon name="filter_alt" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6b7280]" />
            <input className="h-10 w-full rounded-xl bg-[#f2f3ff] pl-9 pr-4 text-xs text-[#131b2e] transition-colors focus:bg-[#eaedff] focus:outline-none" placeholder="Search grievance ID, citizen name, GP, or keyword..." type="text" />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-[#f2f3ff] p-1">
            {filters.map((filter) => (
              <button key={filter.label} className={`flex whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-bold ${filter.className}`} type="button">
                <span>{filter.label} ({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f2f3ff] text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                  <th className="px-4 py-3.5">Grievance ID & Category</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Citizen</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">SLA / Status</th>
                  <th className="px-4 py-3.5 text-right">Rapid Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff] text-[13px] text-[#131b2e]">
                {desktopRows.map(([id, title, location, citizen, department, sla, action], index) => (
                  <tr key={id} className="transition-colors hover:bg-[#f2f3ff]/50">
                    <td className="px-4 py-4 align-top">
                      <span className="block text-[11px] font-bold text-[#ff7119]">{id}</span>
                      <div className="mt-0.5 text-sm font-bold leading-5 text-[#131b2e]">{title}</div>
                      <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${index === 0 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#ffedd5] text-[#9a3412]'}`}>
                        {index === 0 ? 'Tier-1 Urgent' : 'Tier-2 High'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold align-top">{location}</td>
                    <td className="px-4 py-4 text-xs align-top">{citizen}</td>
                    <td className="px-4 py-4 text-xs align-top">{department}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff7119]">
                        <Icon name="schedule" className="text-[16px]" />
                        <span>{sla}</span>
                      </div>
                      <div className="mt-2 h-2 w-36 overflow-hidden rounded-full bg-[#eaedff]">
                        <div className="h-full w-3/5 rounded-full bg-[#ff7119]" />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right align-top">
                      <button className="rounded-lg bg-[#eaedff] px-2.5 py-2 text-[10px] font-bold text-[#131b2e] transition-colors hover:bg-[#fed7aa]" type="button">{action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ff7119]">
                  <Icon name="pin_drop" className="text-[16px]" />
                  <span>Spatial Incident Heatmap</span>
                </div>
                <h3 className="mt-0.5 text-base font-bold leading-6 text-[#131b2e]">Korei AC-53 Grievance Concentration</h3>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-[#e2e7ff] px-2.5 py-1 text-[10px] font-semibold text-[#131b2e]">
                <span className="h-2 w-2 rounded-full bg-[#ba1a1a]" />
                <span>High Cluster: Korei Block North</span>
              </div>
            </div>
            <div className="relative flex h-72 w-full flex-col justify-end overflow-hidden rounded-xl bg-[#283044] p-3 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-[#283044] via-[#374151] to-[#ff7119]/70" />
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[#eef0ff]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff7119] text-white">
                    <Icon name="hub" className="text-[18px]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold">22 GPs Geotagged</div>
                    <div className="text-[10px] text-[#d2d9f4]">GPS-verified photo evidence on 42 of 48 cases</div>
                  </div>
                </div>
                <button className="rounded-lg bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#131b2e]" type="button">Open Full GeoGIS Layer</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff7119]">Secretariat Desk</span>
                <span className="rounded bg-[#f2f3ff] px-2 py-0.5 text-[10px] font-bold text-[#006c49]">Active Shift</span>
              </div>
              <h3 className="text-base font-bold leading-6 text-[#131b2e]">Administrative Hotline</h3>
              <p className="mt-1 text-xs leading-4 text-[#584237]">Direct escalation pipelines to nodal officers across Jajpur District administration.</p>
            </div>
            <button className="mt-4 flex h-9 w-full items-center justify-center gap-1 rounded-lg bg-[#ff7119] text-[11px] font-bold text-white transition-colors hover:bg-[#ea580c]" type="button">
              <span>Draft Citizen Bulletin</span>
              <Icon name="arrow_forward" className="text-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Issues() {
  return (
    <>
      <AppIssuesView />
      <DesktopIssuesView />
    </>
  );
}
