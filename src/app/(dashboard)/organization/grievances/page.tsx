'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LuShieldAlert, LuFileText } from 'react-icons/lu';

export default function GrievanceDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 sm:p-12">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className="stroke-2" d="M12 6.252a5.73 5.73 0 0 1 2.19 5.097l-2.515 2.33 1.978 4.525a1.51 1.51 0 0 1-1.137 1.045H14.832l-1.971-4.462a1.51 1.51 0 0 1-1.138-1.05L12 4.25a6.37 6.37 0 0 0-3.498 1.1l.285.334-.939-2.618.087-.068a1.51 1.51 0 0 1-1.148-1.043L2.3 8.384a1.51 1.51 0 0 1 .032-1.217L4.26 2.313a6.35 6.35 0 0 1 1.173-4.087L12 6.252Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                SEBAKA
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                MLA Constituency Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">
              Welcome back!
            </span>
            <span className="font-extrabold text-slate-900">
              Admin
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center shrink-0"
            >
              <svg
                fill="none"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  className="stroke-2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="mt-8 max-w-3xl mx-auto">
        <Card className="p-6 space-y-3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Grievance Dashboard
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-base text-slate-500 leading-relaxed">
            Track and manage public grievances and their resolution.
          </CardDescription>
        </Card>

        <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Grievance Tracker</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Grievances</p>
              <p className="text-3xl font-bold text-slate-900">128</p>
            </div>
            <div className="white-bg rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Resolved</p>
              <p className="text-3xl font-bold text-emerald-600">92</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Recent Grievances</h3>

            <div className="space-y-3">
              {/* Grievance item 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">Road damage reported in Ward 12</p>
                    <p className="text-[10px] text-slate-400">Balipatna GP · 2h ago</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                    Resolved
                  </span>
                </div>
              </div>

              {/* Grievance item 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">Water pipeline leak</p>
                    <p className="text-[10px] text-slate-400">Nuagaon · 5h ago</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
                    Pending
                  </span>
                </div>
              </div>

              {/* Grievance item 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">Street light not working</p>
                    <p className="text-[10px] text-slate-400">Korei Market · 1d ago</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600">
                    In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}