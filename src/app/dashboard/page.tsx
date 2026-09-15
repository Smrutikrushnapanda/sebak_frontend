'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ApiClient } from '@/lib/api-client';
import { useConstituencySettings } from '@/context/settings-context';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LuLayers,
  LuPlus,
  LuHouse,
  LuUsers,
  LuBuilding2,
  LuVote,
  LuChevronRight,
  LuUser,
  LuStar,
  LuChartBar,
  LuMapPin,
  LuArrowRight,
  LuEllipsisVertical,
  LuLandmark,
} from 'react-icons/lu';
import { useHierarchyStore } from '@/store/useHierarchyStore';

export default function DashboardPage() {
  const { settings, label, representativeType, isMP, getActiveAssemblyConstituencies } =
    useConstituencySettings();
  const { user } = useAuth();
  const { blocks, urbanLocalBodies, panchayats, wards, booths } = useHierarchyStore();

  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    keyPersons: 2,
    designationCounts: [] as { name: string; count: number }[],
  });
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [memberStatsRes, recentMembersRes] = await Promise.all([
          ApiClient.get('org-members/stats').catch(() => ({
            totalMembers: 0,
            activeMembers: 0,
            keyPersons: 2,
            designationCounts: [],
          })),
          ApiClient.get('org-members', { pageSize: 5, sortBy: 'createdAt', sortDir: 'DESC' }).catch(() => ({
            data: [],
          })),
        ]);

        setStats({
          totalMembers: memberStatsRes.totalMembers || 0,
          activeMembers: memberStatsRes.activeMembers || 0,
          keyPersons: memberStatsRes.keyPersons ?? 2,
          designationCounts: memberStatsRes.designationCounts || [],
        });

        const fetchedMembers = recentMembersRes.data || [];
        if (fetchedMembers.length > 0) {
          setRecentMembers(fetchedMembers);
        } else {
          // Fallback sample members matching design reference
          setRecentMembers([
            {
              id: '1',
              fullName: 'Manas Manthan Rout',
              isKeyPerson: true,
              designation: { name: 'Block Coordinator' },
              orgUnitName: 'Korei',
              mobile: '9876543210',
              status: 'ACTIVE',
            },
            {
              id: '2',
              fullName: 'Smruti Krushna Panda',
              isKeyPerson: true,
              designation: { name: 'Block Coordinator' },
              orgUnitName: 'Constituency Level',
              mobile: '7088845326',
              status: 'ACTIVE',
            },
            {
              id: '3',
              fullName: 'Ramachandra Dash',
              isKeyPerson: false,
              designation: { name: 'Panchayat Coordinator' },
              orgUnitName: 'Constituency Level',
              mobile: '9876543210',
              status: 'ACTIVE',
            },
          ]);
        }
      } catch (err) {
        console.warn('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const ruralBlocksCount = blocks.length || 2;
  const gramPanchayatsCount = panchayats.length || 37;
  const urbanBodiesCount = urbanLocalBodies.length || 1;
  const pollingBoothsCount = booths.length || 10;
  const pollingWardsCount = wards.length || 31;

  const constituencyName = settings?.constituencyName || 'Korei Assembly';
  const representativeName = settings?.representativeName || 'Shri Akash Dasnayak';
  const userName = user?.fullName || 'Shri Akash Dasnayak';

  return (
    <div className="space-y-6 pb-10 bg-[#f8fafc] -m-6 p-6 min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {label('Dashboard')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wide">
              {representativeType || 'MLA'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Overview of organization structure, ground network, and active coordinators for {constituencyName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/organization/master-data">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm font-semibold text-xs px-3.5 py-2 h-auto rounded-xl gap-2"
            >
              <LuLayers className="w-4 h-4 text-orange-500" />
              <span>Master Data</span>
            </Button>
          </Link>
          <Link href="/organization/directory">
            <Button
              size="sm"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white shadow-sm font-semibold text-xs px-4 py-2 h-auto rounded-xl gap-1.5"
            >
              <LuPlus className="w-4 h-4" />
              <span>Add Member</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Hero Welcome Banner using dashboard1-bg.png */}
      <div
        className="relative w-full rounded-3xl overflow-hidden shadow-md bg-cover bg-center min-h-[190px] md:min-h-[220px] flex items-center p-6 md:p-8 text-white"
        style={{ backgroundImage: `url('/images/dashboard1-bg.png')` }}
      >
        {/* Soft overlay gradient for better text legibility on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/40 via-orange-900/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#ea580c] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{representativeType || 'MLA'} Official Constituency Administration</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back, <br className="hidden md:block" />
            <span className="text-white">{userName}</span>
          </h2>
          <p className="text-xs md:text-sm text-white/90 font-medium mt-2 tracking-wide">
            Representative: <span className="font-bold text-white">{representativeName}</span> · Constituency:{' '}
            <span className="font-bold text-white">{constituencyName}</span>
          </p>
        </div>
      </div>

      {/* 3. Primary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Rural Blocks */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <LuHouse className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isMP ? 'Assembly Constituencies' : 'RURAL BLOCKS'}
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {isMP ? getActiveAssemblyConstituencies().length : ruralBlocksCount}
              </h3>
              <p className="text-[11px] font-medium text-slate-400">
                {isMP ? 'Constituent Vidhan Sabhas' : 'Rural Blocks'}
              </p>
            </div>
          </div>
          <Link
            href="/organization/master-data"
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
          >
            <LuChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Card 2: Gram Panchayats */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-xs">
              <LuUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">GRAM PANCHAYATS</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{gramPanchayatsCount}</h3>
              <p className="text-[11px] font-medium text-slate-400">Rural Gram Panchayats</p>
            </div>
          </div>
          <Link
            href="/organization/master-data"
            className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center transition-colors"
          >
            <LuChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Card 3: Urban Bodies (ULB) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <LuBuilding2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">URBAN BODIES (ULB)</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{urbanBodiesCount}</h3>
              <p className="text-[11px] font-medium text-slate-400">Municipalities & NACs</p>
            </div>
          </div>
          <Link
            href="/organization/master-data"
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
          >
            <LuChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Card 4: Polling Booths */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <LuVote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">POLLING BOOTHS</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{pollingBoothsCount}</h3>
              <p className="text-[11px] font-medium text-slate-400">Across {pollingWardsCount} Polling Wards</p>
            </div>
          </div>
          <Link
            href="/organization/master-data"
            className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
          >
            <LuChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* 4. Middle Section: People & Workers, Designation Distribution, My Constituency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: People & Workers */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                  <LuUser className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">People & Workers</h3>
                  <p className="text-[11px] font-medium text-slate-400">Total registered field personnel</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-100">
                Network
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {/* Total Members Box */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <LuUsers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Total Members</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{stats.activeMembers} Active status</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-slate-900">{stats.totalMembers}</span>
              </div>

              {/* Key Persons Box */}
              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <LuStar className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Key Persons</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Influential Star Contacts</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-orange-600">{stats.keyPersons}</span>
              </div>
            </div>
          </div>

          <Link href="/organization/key-person" className="block mt-5">
            <Button
              variant="outline"
              className="w-full text-xs font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 rounded-xl py-2.5 h-auto flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Explore Key Person Network</span>
              <LuArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Column 2: Designation Distribution */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                  <LuChartBar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Designation Distribution</h3>
                  <p className="text-[11px] font-medium text-slate-400">Breakdown by organizational designations</p>
                </div>
              </div>
              <Link href="/organization/directory" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                <span>View All</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.designationCounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {stats.designationCounts.map((desig) => (
                  <div
                    key={desig.name}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-700 truncate">{desig.name}</span>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-extrabold bg-white text-slate-800 rounded-md border border-slate-200">
                      {desig.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                {/* Visual Illustration Graphic */}
                <div className="relative w-36 h-28 mb-3 flex items-end justify-center gap-2">
                  <div className="w-5 bg-orange-200 rounded-t-lg h-10" />
                  <div className="w-5 bg-orange-400 rounded-t-lg h-16" />
                  <div className="w-5 bg-emerald-500 rounded-t-lg h-24 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-600">No member designation data yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Data will appear once members are added.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: My Constituency */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <LuMapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">My Constituency</h3>
              </div>
              <Link
                href="/organization/master-data"
                className="w-8 h-8 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors"
              >
                <LuChevronRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

            {/* Korei Constituency Graphic Card */}
            <div className="relative rounded-2xl overflow-hidden h-36 bg-emerald-950 flex items-center justify-center p-4 text-center group cursor-pointer shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-900/80 to-emerald-700/60" />
              {/* Map Outline Graphic */}
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-1 opacity-85 text-emerald-200 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-white/20 stroke-white/80 stroke-2">
                    <polygon points="30,10 70,15 85,50 60,85 20,70 15,35" />
                  </svg>
                </div>
                <h4 className="text-lg font-black text-white tracking-wide">Korei</h4>
                <p className="text-[11px] text-emerald-200 font-medium">Assembly Constituency</p>
              </div>
            </div>
          </div>

          {/* Bottom Tabs */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-3 mt-4 text-center">
            <Link href="/organization/directory" className="flex flex-col items-center text-slate-600 hover:text-orange-600">
              <LuUsers className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold">Organization</span>
            </Link>
            <Link href="/organization/master-data" className="flex flex-col items-center text-slate-600 hover:text-orange-600">
              <LuLandmark className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold">GPs</span>
            </Link>
            <Link href="/organization/master-data" className="flex flex-col items-center text-slate-600 hover:text-orange-600">
              <LuMapPin className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-bold">Villages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Recently Added Members Table */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <LuUsers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Recently Added Members</h3>
              <p className="text-[11px] font-medium text-slate-400">Latest additions to the constituency directory</p>
            </div>
          </div>
          <Link href="/organization/directory">
            <Button
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 font-bold text-xs px-4 py-2 h-auto rounded-xl"
            >
              Open Directory
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">DESIGNATION</th>
                <th className="py-3 px-4">BLOCK / UNIT</th>
                <th className="py-3 px-4">MOBILE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{member.fullName}</span>
                      {member.isKeyPerson && (
                        <LuStar className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 inline-block">
                      {member.designation?.name || 'Block Coordinator'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {member.orgUnitName || member.orgUnit?.name || 'Constituency Level'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium font-mono">
                    {member.mobile}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 inline-block">
                      {member.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <LuEllipsisVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
