import { z } from 'zod';
import { buildAffiliateUrl, parseIsoDurationToMinutes, uniqueSorted } from './flight-utils';
import type { NormalizedFlightOffer, SearchParams, SearchResponse } from './types';

const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
const isProductionApi = AMADEUS_BASE_URL.includes('api.amadeus.com') && !AMADEUS_BASE_URL.includes('test');

const SearchParamsSchema = z.object({
  origin: z.string().min(3).max(3).transform((value) => value.toUpperCase()),
  destination: z.string().min(3).max(3).transform((value) => value.toUpperCase()),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  adults: z.coerce.number().int().min(1).max(9).default(1),
  travelClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']).optional(),
  nonStop: z.preprocess((value) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  }, z.boolean().optional()),
  currencyCode: z.string().min(3).max(3).default('INR'),
  max: z.coerce.number().int().min(1).max(50).default(20)
});

let tokenCache: { token: string; expiresAt: number } | null = null;

export function validateSearchParams(input: unknown): SearchParams {
  const parsed = SearchParamsSchema.parse(input);
  return {
    ...parsed,
    returnDate: parsed.returnDate || undefined
  };
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Amadeus API credentials. Set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET.');
  }

  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amadeus authentication failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(1, Number(data.expires_in ?? 1500) - 60) * 1000
  };

  return tokenCache.token;
}

export async function searchFlightOffers(params: SearchParams): Promise<SearchResponse> {
  const token = await getAccessToken();

  const query = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: String(params.adults),
    currencyCode: params.currencyCode || 'INR',
    max: String(params.max || 20)
  });

  if (params.returnDate) query.set('returnDate', params.returnDate);
  if (params.travelClass) query.set('travelClass', params.travelClass);
  if (typeof params.nonStop === 'boolean') query.set('nonStop', String(params.nonStop));

  const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${query.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.errors?.[0]?.detail || payload?.errors?.[0]?.title || 'Flight search failed';
    throw new Error(message);
  }

  const carriers = payload?.dictionaries?.carriers ?? {};
  const aircraft = payload?.dictionaries?.aircraft ?? {};

  const flights: NormalizedFlightOffer[] = (payload?.data ?? []).map((offer: any) => {
    const itineraries = (offer.itineraries ?? []).map((itinerary: any) => {
      const segments = (itinerary.segments ?? []).map((segment: any) => {
        const carrierCode = segment.carrierCode || segment.operating?.carrierCode || '—';
        const durationMinutes = parseIsoDurationToMinutes(segment.duration);
        return {
          departureCode: segment.departure?.iataCode ?? '—',
          departureTime: segment.departure?.at ?? '',
          arrivalCode: segment.arrival?.iataCode ?? '—',
          arrivalTime: segment.arrival?.at ?? '',
          carrierCode,
          carrierName: carriers[carrierCode] || carrierCode,
          flightNumber: `${carrierCode}${segment.number ?? ''}`,
          aircraft: segment.aircraft?.code ? aircraft[segment.aircraft.code] || segment.aircraft.code : undefined,
          durationMinutes
        };
      });

      const computedDuration = parseIsoDurationToMinutes(itinerary.duration);
      return {
        durationMinutes: computedDuration || segments.reduce((sum: number, s: any) => sum + s.durationMinutes, 0),
        layovers: Math.max(0, segments.length - 1),
        segments
      };
    });

    const airlineCodes = uniqueSorted(
      itineraries.flatMap((itinerary: any) => itinerary.segments.map((segment: any) => segment.carrierCode))
    );

    const normalizedOffer: NormalizedFlightOffer = {
      id: offer.id,
      source: offer.source ?? 'AMADEUS',
      price: Number(offer.price?.grandTotal ?? offer.price?.total ?? 0),
      currency: offer.price?.currency ?? params.currencyCode ?? 'INR',
      totalDurationMinutes: itineraries.reduce((sum: number, itinerary: any) => sum + itinerary.durationMinutes, 0),
      maxLayovers: Math.max(...itineraries.map((itinerary: any) => itinerary.layovers), 0),
      totalLayovers: itineraries.reduce((sum: number, itinerary: any) => sum + itinerary.layovers, 0),
      airlines: airlineCodes.map((code) => carriers[code] || code),
      airlineCodes,
      validatingAirlineCodes: offer.validatingAirlineCodes ?? [],
      itineraries,
      affiliateUrl: '',
      lastTicketingDate: offer.lastTicketingDate
    };

    normalizedOffer.affiliateUrl = buildAffiliateUrl({
      baseUrl: process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL,
      offer: normalizedOffer,
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate
    });

    return normalizedOffer;
  });

  return {
    flights,
    carriers,
    currency: flights[0]?.currency || params.currencyCode || 'INR',
    meta: {
      count: flights.length,
      source: 'amadeus',
      apiMode: isProductionApi ? 'production' : 'test'
    }
  };
}
