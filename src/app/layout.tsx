import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SettingsProvider } from '@/context/settings-context';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/sonner';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { PwaInstallButton } from '@/components/pwa/PwaInstallButton';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#EA580C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'କୋରେଇ ସେବକ | Korei Sevaka - MLA Akash Dasnayak',
  description: 'MLA & MP Constituency Organization and Citizen Services Management System',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Korei Sevaka',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/images/lotus-img.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SettingsProvider>
          <AuthProvider>
            <PwaRegister />
            {children}
            <PwaInstallButton />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
