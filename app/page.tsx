import LiveFlightWidget from '@/components/LiveFlightWidget';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
            Live flight comparison
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Search live flight fares, routes and booking options.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Compare real flight options through our trusted travel partner. Search by route,
            date and passengers, then continue to the partner website to complete booking.
          </p>
        </div>

        <LiveFlightWidget />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Data mode</p>
            <p className="mt-2 text-2xl font-bold">Live partner search</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Booking</p>
            <p className="mt-2 text-2xl font-bold">Partner redirect</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Currency</p>
            <p className="mt-2 text-2xl font-bold">INR</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Flight availability, fares and booking rules are provided by the travel partner and may change
          during final booking.
        </p>
      </section>
    </main>
  );
}
