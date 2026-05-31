'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'flight_finder_pro_analytics_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    setVisible(!stored);
  }, []);

  const updateConsent = (value: 'granted' | 'denied') => {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event('analytics-consent-updated'));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 shadow-soft md:flex md:items-center md:justify-between md:gap-6">
      <div>
        <p className="text-sm font-semibold text-slate-950">Analytics consent</p>
        <p className="mt-1 text-sm text-slate-600">
          We use optional Google Analytics to understand usage. Flight searches are not stored by this app. You can reject analytics and still use all features.
        </p>
      </div>
      <div className="mt-4 flex shrink-0 gap-3 md:mt-0">
        <button
          className="focus-ring rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => updateConsent('denied')}
        >
          Reject
        </button>
        <button
          className="focus-ring rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          onClick={() => updateConsent('granted')}
        >
          Accept analytics
        </button>
      </div>
    </div>
  );
}
