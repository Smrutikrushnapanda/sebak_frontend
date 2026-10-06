import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('mla_access_token')?.value;
  const refreshToken = request.cookies.get('mla_refresh_token')?.value;
  const hasAuth = !!(accessToken || refreshToken);

  // 1. Mobile Entry & Login Protection
  if (pathname === '/mobile/login') {
    if (hasAuth) {
      return NextResponse.redirect(new URL('/mobile/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/mobile') {
    if (hasAuth) {
      return NextResponse.redirect(new URL('/mobile/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/mobile/login', request.url));
  }

  if (pathname.startsWith('/mobile')) {
    if (!hasAuth) {
      return NextResponse.redirect(new URL('/mobile/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Admin Web Routes Protection
  if (pathname === '/login') {
    if (hasAuth) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  const protectedAdminPrefixes = [
    '/dashboard',
    '/settings',
    '/organization',
    '/demographics',
    '/roles',
    '/users',
  ];

  if (protectedAdminPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    if (!hasAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/mobile',
    '/mobile/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/organization/:path*',
    '/demographics/:path*',
    '/roles/:path*',
    '/users/:path*',
    '/login',
  ],
};
