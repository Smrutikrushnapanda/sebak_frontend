'use client';

import React, { useState } from 'react';
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
  LuShieldCheck,
  LuHeadphones,
  LuQrCode,
} from 'react-icons/lu';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !password) {
      toast.error('Please enter mobile number and password');
      return;
    }

    setIsLoading(true);
    try {
      const data = await ApiClient.post('auth/login', { mobile, password });
      toast.success('Logged in successfully!');
      login(data);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrLogin = () => {
    toast.info('QR Code login is initiating. Please scan with your Sevaka App.');
  };

  const handleContactAdmin = () => {
    toast.info('Contact Admin: +91 94371 44810 | korei.sevaka@gov.in');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans select-none">
      {/* Soft Ambient Radial Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/90 overflow-hidden relative z-10 flex flex-col lg:flex-row">
        
        {/* Left Hero Graphic Section */}
        <div className="w-full lg:w-[54%] bg-[#fcf8f3] border-b lg:border-b-0 lg:border-r border-slate-200/80 flex items-stretch overflow-hidden relative">
          <img
            src="/images/login-left-artwork.png"
            alt="Korei Sevaka - Shri Akash Dasnayak MLA"
            className="w-full h-full object-cover block select-none"
          />
        </div>

        {/* Right Authentication Form Section */}
        <div className="w-full lg:w-[46%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          {/* Top Admin Helpline Option */}
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">New here?</span>
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
          <div className="w-full max-w-sm mx-auto my-auto py-1">
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                Login to your Korei Sevaka account
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Continue your journey of service and development.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
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
                    {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#f97316] focus:ring-[#f97316]"
                  />
                  <span className="text-xs font-medium text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Please contact your administrator to reset your password.')}
                  className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
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

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-2.5">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative">
                  OR
                </span>
              </div>

              {/* QR Code Login Button */}
              <button
                type="button"
                onClick={handleQrLogin}
                className="w-full h-10 bg-white hover:bg-[#fff5ee]/60 border border-slate-200/90 hover:border-orange-200 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LuQrCode className="w-4 h-4 text-[#ea580c]" />
                <span>Login with QR Code</span>
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
          <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-400">
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={() => toast.info('Privacy Policy')} className="hover:text-slate-600">Privacy Policy</button>
              <span>|</span>
              <button type="button" onClick={() => toast.info('Terms of Use')} className="hover:text-slate-600">Terms of Use</button>
              <span>|</span>
              <button type="button" onClick={() => toast.info('Help & Support')} className="hover:text-slate-600">Help & Support</button>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <img src="/images/lotus-img.png" alt="Lotus Logo" className="h-4 w-auto object-contain" />
              <span>Korei Assembly</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
