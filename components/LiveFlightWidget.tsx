'use client';

import { useEffect, useRef } from 'react';

export default function LiveFlightWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src =
      'https://tpemb.com/content?currency=inr&trs=534713&shmarker=734433.flight-finder-pro&show_hotels=false&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=12&plain=false&origin=DEL&promo_id=7879&campaign_id=100';

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
      <div ref={containerRef} />
    </div>
  );
}
