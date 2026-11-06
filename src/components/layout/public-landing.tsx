'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LuLogIn,
  LuChevronDown,
  LuShield,
  LuBuilding2,
  LuArrowRight,
  LuPhone,
  LuMapPin,
} from 'react-icons/lu';

export function PublicLandingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const goAdminLogin = () => router.push('/login');
  const goDepartmentLogin = () => router.push('/department-login');

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-900 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <LinkComponent
              href="/"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-slate-900">
                  SEBAKA
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Korei Sevaka
                </p>
              </div>
            </LinkComponent>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <a
                href="#"
                className="text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/');
                }}
              >
                Home
              </a>
              <a
                href="#features"
                className="hover:text-orange-600 transition-colors cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                Services
              </a>
              <a
                href="#about"
                className="hover:text-orange-600 transition-colors cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                About
              </a>
              <a
                href="#contact"
                className="hover:text-orange-600 transition-colors cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                Contact
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+919437144810"
                className="hidden md:flex items-center gap-2 rounded-xl border border-orange-200 bg-[#fff5ee] px-3 py-1.5 text-xs font-bold text-[#ea580c] hover:bg-orange-100 transition-colors flex items-center gap-1.5"
              >
                <LuPhone className="w-3.5 h-3.5" />
                <span>Helpline</span>
              </a>

              {/* Login Dropdown (click or hover to open) */}
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    onMouseEnter={() => setOpen(true)}
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer"
                  >
                    <LuLogIn className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Login</span>
                    <LuChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2 rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <DropdownMenuItem
                    onClick={goAdminLogin}
                    className="flex items-center space-x-2 px-2.5 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg cursor-pointer font-medium"
                  >
                    <LuShield className="w-4 h-4 text-orange-500" />
                    Admin Login
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={goDepartmentLogin}
                    className="flex items-center space-x-2 px-2.5 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg cursor-pointer font-medium"
                  >
                    <LuBuilding2 className="w-4 h-4 text-orange-500" />
                    Department Login
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={goAdminLogin}
                className="md:hidden rounded-xl border border-orange-200 bg-[#ea580c] px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LuLogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 px-6 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
            <span className="text-xs font-bold text-orange-700 tracking-wide">
              Public Portal
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Serve Your Constituency
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            One portal for the MLA &amp; constituency network. Sign in as an
            administrator or as a department to manage services, grievances, and
            operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goAdminLogin}
              className="flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 hover:from-[#ea580c] hover:to-[#c2410c] transition-all cursor-pointer"
            >
              <LuShield className="w-5 h-5" />
              Admin Login
            </button>
            <button
              onClick={goDepartmentLogin}
              className="flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-slate-900 font-extrabold text-sm shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer"
            >
              <LuBuilding2 className="w-5 h-5 text-orange-600" />
              Department Login
            </button>
          </div>
        </div>
      </section>

      {/* Features / Role Cards */}
      <section id="features" className="py-20 border-y border-slate-200/50 bg-white px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">
              Choose your access
            </h3>
            <p className="text-slate-500">
              Select the login that matches your role within the constituency
              portal.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-orange-50 p-8 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm">
                <LuShield className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Admin Login</h4>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Full access to dashboards, member management, constituencies,
                roles, and permissions.
              </p>
              <button
                onClick={goAdminLogin}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
              >
                Go to Admin Login <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mb-5 shadow-sm">
                <LuBuilding2 className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                Department Login
              </h4>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Department-level access to handle grievances, tasks, and service
                delivery for your department.
              </p>
              <button
                onClick={goDepartmentLogin}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
              >
                Go to Department Login{' '}
                <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">
            Need help?
          </h3>
          <p className="text-slate-500 mb-8">
            Contact the MLA office for access or support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919437144810"
              className="flex items-center gap-2 rounded-xl border border-orange-200 bg-[#fff5ee] px-4 py-2 text-sm font-bold text-[#ea580c] hover:bg-orange-100 transition-colors"
            >
              <LuPhone className="w-4 h-4" />
              <span>+91 94371 44810</span>
            </a>
            <a
              href="mailto:korei.sevaka@gov.in"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <LuMapPin className="w-4 h-4" />
              <span>korei.sevaka@gov.in</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 sm:px-8 lg:px-12 py-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>
            © {new Date().getFullYear()} Korei Sevaka — MLA Constituency
            Portal. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span>Helpline: +91 94371 44810</span>
            <span>korei.sevaka@gov.in</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LinkComponent({
  children,
  href,
  onClick,
  className,
}: {
  children: React.ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={className}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </a>
  );
}
