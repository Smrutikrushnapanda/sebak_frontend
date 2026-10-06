'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function MobileIndexPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/mobile/dashboard');
      } else {
        router.replace('/mobile/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#faf8ff]">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-[#f97316] rounded-full animate-spin" />
    </div>
  );
}
