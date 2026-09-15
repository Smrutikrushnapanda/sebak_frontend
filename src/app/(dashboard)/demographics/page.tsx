'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useHierarchyStore } from '@/store/useHierarchyStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LuBuilding2,
  LuLandmark,
  LuUsers,
  LuArrowRight,
  LuTrendingUp,
  LuPlus,
  LuDownload,
  LuChartPie,
} from 'react-icons/lu';

export default function DemographicsOverviewPage() {
  const { wards, panchayats } = useHierarchyStore();

  const urbanWards = useMemo(() => wards.filter((w) => w.parentType === 'ULB'), [wards]);
  const urban2011 = useMemo(() => urbanWards.reduce((a, b) => a + (b.census2011Population || 0), 0), [urbanWards]);
  const urban2027 = useMemo(() => urbanWards.reduce((a, b) => a + (b.census2027Population || 0), 0), [urbanWards]);

  const rural2011 = useMemo(() => panchayats.reduce((a, b) => a + (b.totalPopulation || b.census2011Population || 0), 0), [panchayats]);
  const ruralST = useMemo(() => panchayats.reduce((a, b) => a + (b.stPopulation || 0), 0), [panchayats]);
  const ruralSC = useMemo(() => panchayats.reduce((a, b) => a + (b.scPopulation || 0), 0), [panchayats]);

  const totalConstituencyPop = urban2011 + rural2011;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600">
              <LuChartPie className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Constituency Demographics Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive census overview across Urban (Vyasanagar) and Rural (Korei & Rasulpur) regions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/demographics/add">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs h-9 gap-1.5 shadow-sm">
              <LuPlus className="w-4 h-4" />
              <span>Enter New Demographics</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Combined Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Population</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalConstituencyPop.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] font-semibold text-primary-700">Census 2011 Total</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <LuUsers className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Urban Population</p>
            <h3 className="text-2xl font-black text-primary-700 mt-1">{urban2011.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] font-semibold text-primary-600">26 Municipal Wards</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <LuBuilding2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rural Population</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">{rural2011.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] font-semibold text-emerald-600">{panchayats.length} Gram Panchayats</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <LuLandmark className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Projected 2027</p>
            <h3 className="text-2xl font-black text-orange-600 mt-1">
              {(urban2027 + Math.round(rural2011 * 1.44)).toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] font-semibold text-orange-700">~1.44x Projection</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <LuTrendingUp className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* 2 Big Dedicated Feature Sections (No Tabs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urban Section Card */}
        <Card className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <LuBuilding2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Urban Demographics
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Vyasanagar Municipality</p>
                </div>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
                {urbanWards.length} Wards
              </Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Complete demographic distribution for all 26 wards of Vyasanagar Municipality with male, female, Census 2011, and 2027 estimated projections.
            </p>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">2011 Census</span>
                <p className="font-black text-slate-900 text-base">{urban2011.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-orange-700 font-bold uppercase text-[10px]">2027 Approx</span>
                <p className="font-black text-orange-600 text-base">{urban2027.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/demographics/urban">
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs h-10 gap-2 shadow-sm">
                <span>Open Urban Demographics</span>
                <LuArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Rural Section Card */}
        <Card className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <LuLandmark className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Rural Demographics
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Korei & Rasulpur Blocks</p>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
                {panchayats.length} Gram Panchayats
              </Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Official Census 2011 statistics across all 28 Korei Block Gram Panchayats and Rasulpur GPs with ST, SC, and OC social category breakdowns.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-amber-700 font-bold uppercase text-[10px]">ST Pop</span>
                <p className="font-black text-amber-800 text-sm">{ruralST.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-blue-700 font-bold uppercase text-[10px]">SC Pop</span>
                <p className="font-black text-blue-800 text-sm">{ruralSC.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Total Pop</span>
                <p className="font-black text-slate-900 text-sm">{rural2011.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/demographics/rural">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 gap-2 shadow-sm">
                <span>Open Rural Demographics</span>
                <LuArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
