'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = 'flight_finder_pro_analytics_consent';

export default function Analytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(CONSENT_KEY);
    setEnabled(consent === 'granted' && Boolean(measurementId));

    const handler = () => setEnabled(window.localStorage.getItem(CONSENT_KEY) === 'granted' && Boolean(measurementId));
    window.addEventListener('analytics-consent-updated', handler);
    return () => window.removeEventListener('analytics-consent-updated', handler);
  }, [measurementId]);

  useEffect(() => {
    if (!enabled || !measurementId || !window.gtag) return;
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    window.gtag('config', measurementId, {
      page_path: url,
      anonymize_ip: true
    });
  }, [enabled, measurementId, pathname, searchParams]);

  if (!measurementId || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
