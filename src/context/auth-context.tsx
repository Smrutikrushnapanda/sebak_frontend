'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';

export interface UserRole {
  id: string;
  name: string;
  slug: string;
  isSystem: boolean;
  permissions?: { id: string; key: string }[];
  menus?: { id: string; label: string; path?: string }[];
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  roleId: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (tokenData: { accessToken: string; refreshToken: string; user: User }, redirectPath?: string) => void;
  logout: (redirectPath?: string | unknown) => Promise<void>;
  hasPermission: (permissionKey: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: async () => {},
  hasPermission: () => false,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    const token = ApiClient.getAccessToken();
    const refreshToken = ApiClient.getRefreshToken();
    if (!token && !refreshToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await ApiClient.get<User>('auth/me');
      setUser(data);
    } catch {
      setUser(null);
      ApiClient.clearAuthTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (
    tokenData: { accessToken: string; refreshToken: string; user: User },
    redirectPath?: string,
  ) => {
    ApiClient.setAuthTokens(tokenData.accessToken, tokenData.refreshToken);
    setUser(tokenData.user);
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      const isMobile = typeof window !== 'undefined' && window.location.pathname.startsWith('/mobile');
      router.push(isMobile ? '/mobile' : '/dashboard');
    }
  };

  const logout = async (redirectPath?: string | unknown) => {
    try {
      await ApiClient.post('auth/logout').catch(() => {});
    } finally {
      ApiClient.clearAuthTokens();
      setUser(null);
      if (typeof redirectPath === 'string') {
        router.push(redirectPath);
      } else {
        const isMobile = typeof window !== 'undefined' && window.location.pathname.startsWith('/mobile');
        router.push(isMobile ? '/mobile/login' : '/login');
      }
    }
  };

  const hasPermission = (permissionKey: string): boolean => {
    if (!user) return false;
    if (user.role?.isSystem || user.role?.slug === 'admin' || user.role?.slug === 'mla' || user.role?.slug === 'mla-admin') {
      return true;
    }
    const permissions = user.role?.permissions?.map((p) => p.key) || [];
    return permissions.includes(permissionKey);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
