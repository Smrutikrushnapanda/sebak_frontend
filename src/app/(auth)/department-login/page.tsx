'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import {
  LuSmartphone,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuBuilding2,
  LuShieldCheck,
  LuHeadphones,
} from 'react-icons/lu';

export default function DepartmentLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !password || !department) {
      toast.error('Please enter department, mobile number and password');
      return;
    }

    setIsLoading(true);
    try {
      const data = await ApiClient.post('auth/login', {
        mobile,
        password,
        department,
        role: 'department',
      });
      toast.success('Logged in successfully!');
      login(data);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactAdmin = () => {
    toast.info('Contact Admin: +91 94371 44810 | korei.sevaka@gov.in');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans select-none">
      {/* Soft Ambient Radial Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <a
        href="/login"
        className="absolute top-6 left-6 z-10 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <LuArrowRight className="w-3.5 h-3.5" />
        <span>Back to Admin Login</span>
      </a>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/90 overflow-hidden relative z-10 flex flex-col">
        {/* Top Department Helpline Option */}
        <div className="flex items-center justify-end mb-4 px-6">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Need help?</span>
            <button
              type="button"
              onClick={handleContactAdmin}
              className="px-3.5 py-1 rounded-full border border-orange-200 bg-[#fff5ee] text-[#ea580c] font-bold text-xs hover:bg-orange-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LuHeadphones className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Contact Admin</span>
            </button>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="w-full max-w-sm mx-auto my-auto py-1 px-6">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center">
                <LuBuilding2 className="w-5 h-5 text-orange-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Department Login
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
              Login to your department account
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage grievances, tasks and service delivery for your department.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Department Input */}
            <div className="space-y-1">
              <label htmlFor="department" className="block text-xs font-bold text-slate-700">
                Department
              </label>
              <div className="relative">
                <LuBuilding2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="department"
                  type="text"
                  placeholder="e.g. Health, PWD, Revenue"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full h-10 pl-10 pr-4 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
                />
              </div>
            </div>

            {/* Mobile Input */}
            <div className="space-y-1">
              <label htmlFor="mobile" className="block text-xs font-bold text-slate-700">
                Mobile Number
              </label>
              <div className="relative">
                <LuSmartphone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your registered mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full h-10 pl-10 pr-4 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <LuLock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-10 pl-10 pr-10 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <LuEyeOff className="w-4 h-4" />
                  ) : (
                    <LuEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <LuArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure & Trusted Green Box */}
          <div className="mt-4 p-3 rounded-2xl bg-[#f0fdf4] border border-emerald-100 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                Secure &amp; Trusted
              </p>
              <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed mt-0.5">
                Your data is safe with us. We use industry-standard encryption to protect your information.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Card Footer */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-400 px-6 pb-6">
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                router.push('/login');
              }}
              className="hover:text-slate-600 cursor-pointer"
            >
              Admin Login
            </Link>
            <span>|</span>
            <button type="button" onClick={() => toast.info('Help & Support')} className="hover:text-slate-600">
              Help & Support
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <img src="/images/lotus-img.png" alt="Lotus Logo" className="h-4 w-auto object-contain" />
            <span>Korei Assembly</span>
          </div>
        </div>
      </div>
    </div>
  );
}
