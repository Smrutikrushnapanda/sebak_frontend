'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LuFolder } from 'react-icons/lu';

export default function ProjectDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 sm:p-12">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
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
              Project Dashboard
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-base text-slate-500 leading-relaxed">
            Manage projects, tasks, progress and reports.
          </CardDescription>
        </Card>

        <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Project Portfolio</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Project card 1 */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 hover:hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <LuFolder className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">Balipatna Main Road</h3>
                  <p className="text-sm text-slate-500">Infrastructure development</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700">₹45.0 Lakhs</p>
                <div className="mt-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-l-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs font-medium text-violet-600 mt-1">75% Complete</p>
                </div>
              </div>
            </div>

            {/* Project card 2 */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 hover:hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <LuFolder className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">Korei Solar Tank</h3>
                  <p className="text-sm text-slate-500">Drinking water project</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700">₹18.5 Lakhs</p>
                <div className="mt-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-xs font-medium text-emerald-600 mt-1">90% Complete</p>
                </div>
              </div>
            </div>

            {/* Project card 3 */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 hover:hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                  <LuFolder className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">Community Hall</h3>
                  <p className="text-sm text-slate-500">Cultural center construction</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700">₹62.0 Lakhs</p>
                <div className="mt-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-l-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-xs font-medium text-rose-600 mt-1">40% Complete</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Project Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Projects</p>
                <p className="text-2xl font-bold text-slate-900">3</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Progress</p>
                <p className="text-2xl font-bold text-violet-600">68%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}