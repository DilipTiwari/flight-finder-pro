'use client';

import type { FormEvent } from 'react';
import type { SearchParams } from '@/lib/types';

export type SearchFormState = SearchParams;

const defaultTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
};

export const defaultSearch: SearchFormState = {
  origin: 'BLR',
  destination: 'DEL',
  departureDate: defaultTomorrow(),
  adults: 1,
  travelClass: 'ECONOMY',
  nonStop: false,
  currencyCode: 'INR',
  max: 20
};

export default function SearchForm({
  value,
  onChange,
  onSubmit,
  loading
}: {
  value: SearchFormState;
  onChange: (next: SearchFormState) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const update = <K extends keyof SearchFormState>(key: K, nextValue: SearchFormState[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-200 md:p-6">
      <div className="grid gap-4 md:grid-cols-6">
        <label className="md:col-span-1">
          <span className="text-sm font-semibold text-slate-700">From</span>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-950 placeholder:text-slate-400"
            placeholder="BLR"
            maxLength={3}
            value={value.origin}
            onChange={(e) => update('origin', e.target.value.toUpperCase())}
            required
          />
        </label>

        <label className="md:col-span-1">
          <span className="text-sm font-semibold text-slate-700">To</span>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-950 placeholder:text-slate-400"
            placeholder="DEL"
            maxLength={3}
            value={value.destination}
            onChange={(e) => update('destination', e.target.value.toUpperCase())}
            required
          />
        </label>

        <label className="md:col-span-1">
          <span className="text-sm font-semibold text-slate-700">Depart</span>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400"
            type="date"
            value={value.departureDate}
            onChange={(e) => update('departureDate', e.target.value)}
            required
          />
        </label>

        <label className="md:col-span-1">
          <span className="text-sm font-semibold text-slate-700">Return</span>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400"
            type="date"
            value={value.returnDate || ''}
            onChange={(e) => update('returnDate', e.target.value || undefined)}
          />
        </label>

        <label className="md:col-span-1">
          <span className="text-sm font-semibold text-slate-700">Adults</span>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400"
            type="number"
            min={1}
            max={9}
            value={value.adults}
            onChange={(e) => update('adults', Number(e.target.value))}
            required
          />
        </label>

        <label className="md:col-span-1">
          <span className="text-sm font-semibold text-slate-700">Class</span>
          <select
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400"
            value={value.travelClass}
            onChange={(e) => update('travelClass', e.target.value as SearchFormState['travelClass'])}
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label>
          <span className="text-sm font-semibold text-slate-700">Currency</span>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-950 placeholder:text-slate-400"
            maxLength={3}
            value={value.currencyCode || 'INR'}
            onChange={(e) => update('currencyCode', e.target.value.toUpperCase())}
          />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Results limit</span>
          <select
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400"
            value={value.max || 20}
            onChange={(e) => update('max', Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 md:items-end">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(value.nonStop)}
              onChange={(e) => update('nonStop', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Non-stop only
          </label>
          <button
            className="focus-ring w-full rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Searching...' : 'Search flights'}
          </button>
        </div>
      </div>
    </form>
  );
}
