import { formatDateTime, formatDuration, formatPrice } from '@/lib/flight-utils';
import type { NormalizedFlightOffer } from '@/lib/types';

export default function FlightCard({ flight }: { flight: NormalizedFlightOffer }) {
  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {flight.airlines.map((airline) => (
              <span key={airline} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {airline}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            {formatPrice(flight.price, flight.currency)}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Total duration {formatDuration(flight.totalDurationMinutes)} · {flight.totalLayovers === 0 ? 'Non-stop' : `${flight.totalLayovers} total layover${flight.totalLayovers > 1 ? 's' : ''}`}
          </p>
        </div>

        <a
          href={flight.affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="focus-ring inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Book via partner
        </a>
      </div>

      <div className="mt-5 space-y-4">
        {flight.itineraries.map((itinerary, itineraryIndex) => (
          <div key={`${flight.id}-${itineraryIndex}`} className="rounded-3xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <p className="text-sm font-bold text-slate-800">
                {itineraryIndex === 0 ? 'Outbound' : 'Return'} · {formatDuration(itinerary.durationMinutes)}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {itinerary.layovers === 0 ? 'Non-stop' : `${itinerary.layovers} layover${itinerary.layovers > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="mt-3 space-y-3">
              {itinerary.segments.map((segment, index) => (
                <div key={`${segment.flightNumber}-${segment.departureTime}-${index}`} className="grid gap-3 text-sm md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div>
                    <p className="font-black text-slate-950">{segment.departureCode}</p>
                    <p className="text-slate-500">{formatDateTime(segment.departureTime)}</p>
                  </div>
                  <div className="rounded-full bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 md:text-center">
                    {segment.flightNumber} · {formatDuration(segment.durationMinutes)}
                  </div>
                  <div className="md:text-right">
                    <p className="font-black text-slate-950">{segment.arrivalCode}</p>
                    <p className="text-slate-500">{formatDateTime(segment.arrivalTime)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Offer ID {flight.id}. Demo-mode fares are sample prices. Replace the affiliate partner URL in environment variables before launch.
      </p>
    </article>
  );
}
