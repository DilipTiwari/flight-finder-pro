'use client';

export type SortKey = 'price' | 'duration' | 'layovers' | 'airline';

export type Filters = {
  sortBy: SortKey;
  maxPrice: number | 'any';
  maxDurationHours: number | 'any';
  maxLayovers: number | 'any';
  airlineCode: string | 'any';
};

export const defaultFilters: Filters = {
  sortBy: 'price',
  maxPrice: 'any',
  maxDurationHours: 'any',
  maxLayovers: 'any',
  airlineCode: 'any'
};

export default function FilterPanel({
  filters,
  onChange,
  airlines,
  highestPrice,
  resultCount
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  airlines: { code: string; name: string }[];
  highestPrice: number;
  resultCount: number;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });

  return (
    <aside className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Sort & filter</h2>
          <p className="text-sm text-slate-500">{resultCount} matching results</p>
        </div>
        <button
          className="focus-ring rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          onClick={() => onChange(defaultFilters)}
        >
          Reset
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label>
          <span className="text-sm font-semibold text-slate-700">Sort by</span>
          <select
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={filters.sortBy}
            onChange={(e) => set('sortBy', e.target.value as SortKey)}
          >
            <option value="price">Lowest price</option>
            <option value="duration">Shortest duration</option>
            <option value="layovers">Fewest layovers</option>
            <option value="airline">Airline A-Z</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Airline</span>
          <select
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={filters.airlineCode}
            onChange={(e) => set('airlineCode', e.target.value as Filters['airlineCode'])}
          >
            <option value="any">Any airline</option>
            {airlines.map((airline) => (
              <option key={airline.code} value={airline.code}>
                {airline.name} ({airline.code})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Max price</span>
          <select
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value === 'any' ? 'any' : Number(e.target.value))}
          >
            <option value="any">Any price</option>
            {[5000, 10000, 20000, 40000, 80000]
              .filter((value) => highestPrice === 0 || value <= highestPrice * 1.5)
              .map((value) => (
                <option key={value} value={value}>
                  Up to {value.toLocaleString('en-IN')}
                </option>
              ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Max duration</span>
          <select
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={filters.maxDurationHours}
            onChange={(e) => set('maxDurationHours', e.target.value === 'any' ? 'any' : Number(e.target.value))}
          >
            <option value="any">Any duration</option>
            <option value={2}>2 hours</option>
            <option value={4}>4 hours</option>
            <option value={8}>8 hours</option>
            <option value={16}>16 hours</option>
            <option value={24}>24 hours</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Max layovers</span>
          <select
            className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={filters.maxLayovers}
            onChange={(e) => set('maxLayovers', e.target.value === 'any' ? 'any' : Number(e.target.value))}
          >
            <option value="any">Any layovers</option>
            <option value={0}>Non-stop</option>
            <option value={1}>1 layover</option>
            <option value={2}>2 layovers</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
