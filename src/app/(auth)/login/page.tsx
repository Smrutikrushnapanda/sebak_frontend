'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { useConstituencySettings } from '@/context/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  LuSparkles,
  LuPhone,
  LuLock,
  LuArrowRight,
  LuShieldCheck,
  LuEye,
  LuEyeOff,
  LuBuilding2,
  LuUsers,
  LuLayers,
  LuMapPin,
  LuCheck,
  LuVote,
  LuKeyRound,
} from 'react-icons/lu';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { settings, label, representativeType, portalName, isMP } = useConstituencySettings();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/40 to-orange-50/30 p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background Decorative Rings & Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Hero / Brand Showcase Card */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 text-white shadow-2xl shadow-primary-950/20 border border-primary-700/50 relative overflow-hidden min-h-[580px]">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/15 rounded-full blur-2xl" />

          {/* Top Header & Emblem */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/30 font-extrabold text-xl">
                <LuVote className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-orange-400">
                    Constituency Administration
                  </span>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-[10px] uppercase font-extrabold">
                    {representativeType} Portal
                  </Badge>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                  {portalName}
                </h2>
              </div>
            </div>

            {/* Representative Details Badge */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-blue-200 uppercase font-semibold tracking-wider">Elected Representative</p>
                  <p className="text-lg font-bold text-white mt-0.5">{settings?.representativeName || 'Honorable Representative'}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-200">
                    <LuMapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>{settings?.constituencyName} · {settings?.stateName || 'Odisha'}</span>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold flex items-center gap-1.5">
                  <LuSparkles className="w-3.5 h-3.5" />
                  <span>Phase 1 Live</span>
                </div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-2.5 text-orange-300 mb-1.5">
                  <LuLayers className="w-4 h-4" />
                  <span className="font-semibold text-xs text-white">Hierarchy Mapping</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  District, Blocks, Gram Panchayats, Villages, Wards & Polling Booths.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-2.5 text-orange-300 mb-1.5">
                  <LuUsers className="w-4 h-4" />
                  <span className="font-semibold text-xs text-white">Cadre Directory</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Party workers, booth presidents, coordinators & influential key persons.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Security & Role Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <LuShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Role-Based Access Control & JWT Auth</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">v1.0.0 Production</span>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <Card className="w-full shadow-2xl border-slate-200/80 bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500" />
            
            <CardHeader className="space-y-1.5 text-center pt-6 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 mx-auto mb-2 shadow-sm">
                <LuKeyRound className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Sign In to Portal
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Enter your registered mobile number and secure password
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-1">
                {/* Mobile Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="mobile" className="text-xs font-bold text-slate-700">
                    Registered Mobile Number
                  </Label>
                  <div className="relative">
                    <LuPhone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      className="pl-10 h-10 text-sm bg-slate-50/60 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500/20 rounded-xl"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <LuLock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-10 text-sm bg-slate-50/60 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500/20 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 pt-2 pb-6">
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/25 transition-all active:scale-[0.99]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Session...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign In to Dashboard</span>
                      <LuArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <p className="text-[11px] text-center text-slate-400 font-medium">
                  Protected System · Authorized Representative Personnel Only
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}
