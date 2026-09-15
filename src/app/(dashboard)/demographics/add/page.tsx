'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LuBuilding2,
  LuLandmark,
  LuPlus,
  LuArrowRight,
  LuUsers,
  LuFileSpreadsheet,
  LuSparkles,
  LuMapPin,
} from 'react-icons/lu';

export default function DemographicsDataEntryHubPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-2 border border-primary-100">
          <LuSparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Demographics Data Entry
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto">
          Choose whether you want to enter Urban Municipality Ward census data or Rural Gram Panchayat & Village demographic figures.
        </p>
      </div>

      {/* 2 Big Clear Cards for Non-Tech Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urban Municipality Entry */}
        <Card className="p-6 rounded-2xl border-2 border-primary-200 bg-white shadow-sm hover:shadow-md hover:border-primary-400 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200 group-hover:scale-105 transition-transform">
                <LuBuilding2 className="w-6 h-6" />
              </div>
              <Badge className="bg-primary-50 text-primary-700 border-primary-200 font-bold text-xs">
                Urban Wing
              </Badge>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                Urban Municipality Wards
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter population and voter census data for Vyasanagar Municipality Wards (Census 2011 & 2027 Projected).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Target Body:</span>
                <span className="font-bold text-slate-800">Vyasanagar Municipality</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Fields:</span>
                <span className="font-semibold text-slate-700">Ward No, Male, Female, 2011, 2027</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/demographics/urban/add">
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs h-10 gap-2 shadow-sm">
                <span>Enter Urban Ward Data</span>
                <LuArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Rural GP Entry */}
        <Card className="p-6 rounded-2xl border-2 border-emerald-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                <LuLandmark className="w-6 h-6" />
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
                Rural Wing
              </Badge>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Rural Gram Panchayats
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter demographic and community census data (Male, Female, ST, SC, OC) for Korei & Rasulpur Block Gram Panchayats.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Target Blocks:</span>
                <span className="font-bold text-slate-800">Korei & Rasulpur Blocks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Fields:</span>
                <span className="font-semibold text-slate-700">GP Name, Male, Female, ST, SC, OC</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/demographics/rural/add">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 gap-2 shadow-sm">
                <span>Enter Rural GP Data</span>
                <LuArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Access to View Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Link href="/demographics/urban" className="block">
          <Card className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LuBuilding2 className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">View All 26 Urban Wards</p>
                <p className="text-[11px] text-slate-500">Vyasanagar Municipality Population List</p>
              </div>
            </div>
            <LuArrowRight className="w-4 h-4 text-slate-400" />
          </Card>
        </Link>

        <Link href="/demographics/rural" className="block">
          <Card className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LuLandmark className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">View All Rural Gram Panchayats</p>
                <p className="text-[11px] text-slate-500">Korei (28 GPs) & Rasulpur Census Data</p>
              </div>
            </div>
            <LuArrowRight className="w-4 h-4 text-slate-400" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
