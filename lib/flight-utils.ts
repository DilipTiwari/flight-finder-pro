import type { NormalizedFlightOffer } from './types';

export function parseIsoDurationToMinutes(duration: string | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  return days * 24 * 60 + hours * 60 + minutes;
}

export function formatDuration(minutes: number): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function formatDateTime(value: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export function buildAffiliateUrl(args: {
  baseUrl?: string;
  offer: Pick<NormalizedFlightOffer, 'id' | 'airlineCodes' | 'price' | 'currency'>;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}): string {
  const fallback = 'https://example.com/affiliate-flight-search';
  let url: URL;

  try {
    url = new URL(args.baseUrl || fallback);
  } catch {
    url = new URL(fallback);
  }

  url.searchParams.set('origin', args.origin);
  url.searchParams.set('destination', args.destination);
  url.searchParams.set('departureDate', args.departureDate);
  if (args.returnDate) url.searchParams.set('returnDate', args.returnDate);
  url.searchParams.set('airline', args.offer.airlineCodes.join(','));
  url.searchParams.set('price', String(args.offer.price));
  url.searchParams.set('currency', args.offer.currency);
  url.searchParams.set('offerId', args.offer.id);
  url.searchParams.set('utm_source', 'flight_finder_pro');
  url.searchParams.set('utm_medium', 'affiliate_placeholder');
  return url.toString();
}

export function uniqueSorted<T>(input: T[]): T[] {
  return Array.from(new Set(input)).sort((a, b) => String(a).localeCompare(String(b)));
}
