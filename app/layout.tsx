import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import './globals.css';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: 'Flight Finder Pro',
  description: 'Compare flight prices, durations, layovers and airlines using real-time flight data.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <Analytics measurementId={gaId} />
        </Suspense>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
