import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import Script from 'next/script';
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
        <Script
          id="travelpayouts-drive"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://tp-em.com/NTM0NzEz.js?t=534713';
                document.head.appendChild(script);
              })();
            `
          }}
        />

        <Suspense fallback={null}>
          <Analytics measurementId={gaId} />
        </Suspense>

        {children}

        <CookieConsent />
      </body>
    </html>
  );
}