'use client';

import { useMemo, useState } from 'react';
import FilterPanel, { defaultFilters, type Filters } from '@/components/FilterPanel';
import FlightCard from '@/components/FlightCard';
import SearchForm, { defaultSearch, type SearchFormState } from '@/components/SearchForm';
import { formatDuration, formatPrice } from '@/lib/flight-utils';
import type { NormalizedFlightOffer, SearchResponse } from '@/lib/types';

function applyFilters(flights: NormalizedFlightOffer[], filters: Filters) {
  const filtered = flights.filter((flight) => {
    if (filters.maxPrice !== 'any' && flight.price > filters.maxPrice) return false;
    if (filters.maxDurationHours !== 'any' && flight.totalDurationMinutes > filters.maxDurationHours * 60) return false;
    if (filters.maxLayovers !== 'any' && flight.maxLayovers > filters.maxLayovers) return false;
    if (filters.airlineCode !== 'any' && !flight.airlineCodes.includes(filters.airlineCode)) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'duration':
        return a.totalDurationMinutes - b.totalDurationMinutes;
      case 'layovers':
        return a.totalLayovers - b.totalLayovers || a.price - b.price;
      case 'airline':
        return (a.airlines[0] || '').localeCompare(b.airlines[0] || '');
      case 'price':
      default:
        return a.price - b.price;
    }
  });
}

export default function HomePage() {
  const [search, setSearch] = useState<SearchFormState>(defaultSearch);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => applyFilters(data?.flights || [], filters), [data, filters]);
  const cheapest = useMemo(() => (data?.flights || []).reduce<NormalizedFlightOffer | null>((best, flight) => (!best || flight.price < best.price ? flight : best), null), [data]);
  const shortest = useMemo(() => (data?.flights || []).reduce<NormalizedFlightOffer | null>((best, flight) => (!best || flight.totalDurationMinutes < best.totalDurationMinutes ? flight : best), null), [data]);
  const highestPrice = useMemo(() => Math.max(...(data?.flights || []).map((flight) => flight.price), 0), [data]);
  const airlines = useMemo(() => {
    const pairs = new Map<string, string>();
    data?.flights.forEach((flight) => {
      flight.airlineCodes.forEach((code, index) => pairs.set(code, flight.airlines[index] || code));
    });
    return Array.from(pairs.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const submitSearch = async () => {
    setLoading(true);
    setError(null);
    setFilters(defaultFilters);

    try {
      const params = new URLSearchParams({
        origin: search.origin,
        destination: search.destination,
        departureDate: search.departureDate,
        adults: String(search.adults),
        currencyCode: search.currencyCode || 'INR',
        max: String(search.max || 20)
      });

      if (search.returnDate) params.set('returnDate', search.returnDate);
      if (search.travelClass) params.set('travelClass', search.travelClass);
      if (search.nonStop) params.set('nonStop', 'true');

      const response = await fetch(`/api/flights/search?${params.toString()}`, { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || 'Could not fetch flights.');
      setData(payload);
    } catch (caught) {
      setData(null);
      setError(caught instanceof Error ? caught.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 px-4 py-12 text-white md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.25),_transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-100 ring-1 ring-white/15">
              Free flight comparison MVP
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Compare flights by price, duration, layovers and airline.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Built with Next.js, free demo flight data mode, affiliate placeholders, consent-based Google Analytics and a mobile-first interface. Upgrade to a live supplier API only after you validate traffic.
            </p>
          </div>
          <div className="mt-8">
            <SearchForm value={search} onChange={setSearch} onSubmit={submitSearch} loading={loading} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>Search error:</strong> {error}
          </div>
        )}

        {data && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-500">Cheapest</p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {cheapest ? formatPrice(cheapest.price, cheapest.currency) : '—'}
              </p>
            </div>
            <div className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-500">Shortest</p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {shortest ? formatDuration(shortest.totalDurationMinutes) : '—'}
              </p>
            </div>
            <div className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-500">Data mode</p>
              <p className="mt-2 text-2xl font-black capitalize text-slate-950">{data.meta.apiMode}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <FilterPanel filters={filters} onChange={setFilters} airlines={airlines} highestPrice={highestPrice} resultCount={results.length} />

          <div className="space-y-5">
            {!data && !loading && (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center">
                <h2 className="text-xl font-black text-slate-950">Start with an airport-code search</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Example: BLR to DEL, BOM to DXB, HYD to CCU. The default setup uses free demo data so you can launch first and connect a paid/live API later.
                </p>
              </div>
            )}

            {loading && (
              <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft ring-1 ring-slate-200">
                <p className="text-lg font-black text-slate-950">Searching fares...</p>
                <p className="mt-2 text-sm text-slate-500">In free-demo mode these are sample fares for validating the product; connect a live API later for real availability.</p>
              </div>
            )}

            {data && !loading && results.length === 0 && (
              <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft ring-1 ring-slate-200">
                <p className="text-lg font-black text-slate-950">No flights match your filters.</p>
                <p className="mt-2 text-sm text-slate-500">Try widening price, layover or duration filters.</p>
              </div>
            )}

            {results.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
        <p>
          Flight Finder Pro · <a className="font-semibold text-slate-700 underline" href="/privacy">Privacy & GDPR</a>
        </p>
      </footer>
    </main>
  );
}
