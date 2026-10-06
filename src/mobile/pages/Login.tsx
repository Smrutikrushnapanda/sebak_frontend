'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { toast } from 'sonner';
import {
  LuSmartphone,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuShieldCheck,
  LuSparkles,
} from 'react-icons/lu';

export default function MobileLogin() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { lang, setLang } = useLanguage();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isOd = lang === 'OD';

  // Prevent login-page access after authentication
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/mobile');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedMobile = mobile.trim();
    const trimmedPassword = password.trim();

    if (!trimmedMobile || !trimmedPassword) {
      setErrorMessage(
        isOd
          ? 'ଦୟାକରି ମୋବାଇଲ୍ ନମ୍ବର ଏବଂ ପାସୱାର୍ଡ ଦିଅନ୍ତୁ'
          : 'Please enter your mobile number and password'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const data = await ApiClient.post('auth/login', {
        mobile: trimmedMobile,
        password: trimmedPassword,
      });

      toast.success(isOd ? 'ସଫଳତାର ସହ ଲଗଇନ୍ ହୋଇଛି!' : 'Logged in successfully!');
      login(data, '/mobile');
    } catch (err: any) {
      const msg = err.message || (isOd ? 'ପ୍ରବେଶ ବିଫଳ ହେଲା' : 'Invalid credentials. Please check your username and password.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-[#f97316] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] flex flex-col justify-between max-w-md mx-auto relative overflow-hidden px-4 py-6">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Language Selector */}
      <header className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#fff5ee] border border-orange-200 flex items-center justify-center shadow-2xs">
            <img src="/images/lotus-img.png" alt="Emblem" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ea580c]">Korei AC-53</span>
            <p className="text-xs font-black text-slate-900 leading-none">SEVAKA</p>
          </div>
        </div>

        {/* Language Pill Switcher */}
        <div className="flex items-center bg-white border border-slate-200 rounded-full p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setLang('EN')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              lang === 'EN'
                ? 'bg-[#f97316] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ENG
          </button>
          <button
            type="button"
            onClick={() => setLang('OD')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              lang === 'OD'
                ? 'bg-[#f97316] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ଓଡ଼ିଆ
          </button>
        </div>
      </header>

      {/* Hero Welcome Box */}
      <div className="my-auto py-4 z-10 space-y-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff7722] via-[#f97316] to-[#ea580c] p-5 text-white shadow-lg shadow-orange-500/20 border border-orange-400/40">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
              <LuSparkles className="w-3 h-3 text-amber-200" />
              {isOd ? 'ମୋବାଇଲ୍ ଆଡମିନ୍ ଲଗଇନ୍' : 'Mobile Authentication'}
            </span>
            <h1 className="text-2xl font-black mt-2 leading-tight tracking-tight drop-shadow-xs">
              {isOd ? 'କୋରେଇ ସେବକ' : 'Korei Sevaka'}
            </h1>
            <p className="text-xs font-medium text-orange-100 mt-1">
              {isOd
                ? 'ପ୍ରଶାସନିକ ଆକାଉଣ୍ଟ ସହିତ ସୁରକ୍ଷିତ ଲଗଇନ୍ କରନ୍ତୁ'
                : 'Sign in to access mobile constituency governance'}
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Main Authentication Form */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username / Mobile Number Input */}
            <div className="space-y-1">
              <label htmlFor="mobile" className="block text-xs font-bold text-slate-700">
                {isOd ? 'ମୋବାଇଲ୍ ନମ୍ବର / ୟୁଜରନେମ୍' : 'Mobile Number / Username'}
              </label>
              <div className="relative">
                <LuSmartphone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="mobile"
                  type="text"
                  placeholder={isOd ? 'ମୋବାଇଲ୍ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ' : 'Enter your mobile number'}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setErrorMessage(null);
                  }}
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                {isOd ? 'ପାସୱାର୍ଡ' : 'Password'}
              </label>
              <div className="relative">
                <LuLock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 pl-10 pr-10 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#f97316] focus:ring-[#f97316]"
                />
                <span className="font-semibold text-slate-600">
                  {isOd ? 'ମନେରଖନ୍ତୁ' : 'Remember me'}
                </span>
              </label>
              <button
                type="button"
                onClick={() => toast.info('Please contact administrator for password assistance.')}
                className="font-bold text-[#ea580c] hover:underline"
              >
                {isOd ? 'ସହାୟତା' : 'Forgot Password?'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-orange-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isOd ? 'ଯାଞ୍ଚ ହେଉଛି...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{isOd ? 'ପ୍ରବେଶ କରନ୍ତୁ' : 'Sign In to Mobile'}</span>
                  <LuArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Assurance Badge */}
        <div className="p-3 rounded-2xl bg-[#f0fdf4] border border-emerald-100 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-[10.5px] font-bold text-slate-700">
            {isOd
              ? 'ସୁରକ୍ଷିତ ଏନକ୍ରିପ୍ଟେଡ୍ ପ୍ରଶାସନିକ ପ୍ରବେଶ'
              : 'Secured with Official Encrypted Authentication'}
          </p>
        </div>
      </div>

      {/* Footer Helpline */}
      <footer className="pt-2 text-center text-[10.5px] text-slate-500 z-10">
        <p>
          {isOd ? 'ସହାୟତା ପାଇଁ ଯୋଗାଯୋଗ:' : 'Admin Helpline:'}{' '}
          <span className="font-bold text-[#ea580c]">+91 94371 44810</span>
        </p>
      </footer>
    </div>
  );
}
