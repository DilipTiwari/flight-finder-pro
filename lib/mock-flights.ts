import { buildAffiliateUrl, uniqueSorted } from './flight-utils';
import type { NormalizedFlightOffer, SearchParams, SearchResponse } from './types';

const AIRLINES = [
  { code: 'AI', name: 'Air India' },
  { code: '6E', name: 'IndiGo' },
  { code: 'UK', name: 'Vistara' },
  { code: 'QP', name: 'Akasa Air' },
  { code: 'SG', name: 'SpiceJet' }
];

function hash(input: string): number {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) % 100000;
  }
  return value;
}

function addMinutes(date: Date, minutes: number): string {
  return new Date(date.getTime() + minutes * 60_000).toISOString();
}

function makeFlight(params: SearchParams, index: number): NormalizedFlightOffer {
  const seed = hash(`${params.origin}-${params.destination}-${params.departureDate}-${index}`);
  const airline = AIRLINES[(seed + index) % AIRLINES.length];
  const layovers = index % 3;
  const segmentCount = layovers + 1;
  const baseDepart = new Date(`${params.departureDate}T06:00:00.000Z`);
  baseDepart.setMinutes(baseDepart.getMinutes() + index * 95);
  const segmentDuration = 75 + ((seed + index * 17) % 120);
  const connectionMinutes = layovers > 0 ? 55 + ((seed + index * 11) % 80) : 0;
  const totalDuration = segmentCount * segmentDuration + layovers * connectionMinutes;
  const price = 4200 + ((seed + index * 913) % 8500) + layovers * 700;
  const connectionCodes = ['HYD', 'BOM', 'DEL', 'MAA', 'CCU'];

  const segments = Array.from({ length: segmentCount }).map((_, segmentIndex) => {
    const departureCode = segmentIndex === 0 ? params.origin : connectionCodes[(seed + segmentIndex) % connectionCodes.length];
    const arrivalCode = segmentIndex === segmentCount - 1 ? params.destination : connectionCodes[(seed + segmentIndex + 1) % connectionCodes.length];
    const departOffset = segmentIndex * (segmentDuration + connectionMinutes);
    const departureTime = addMinutes(baseDepart, departOffset);
    const arrivalTime = addMinutes(baseDepart, departOffset + segmentDuration);

    return {
      departureCode,
      departureTime,
      arrivalCode,
      arrivalTime,
      carrierCode: airline.code,
      carrierName: airline.name,
      flightNumber: `${airline.code}${100 + ((seed + segmentIndex * 37) % 899)}`,
      aircraft: 'Demo aircraft',
      durationMinutes: segmentDuration
    };
  });

  const offer: NormalizedFlightOffer = {
    id: `demo-${params.origin}-${params.destination}-${index + 1}`,
    source: 'DEMO',
    price,
    currency: params.currencyCode || 'INR',
    totalDurationMinutes: totalDuration,
    maxLayovers: layovers,
    totalLayovers: layovers,
    airlines: uniqueSorted([airline.name]),
    airlineCodes: uniqueSorted([airline.code]),
    validatingAirlineCodes: [airline.code],
    itineraries: [
      {
        durationMinutes: totalDuration,
        layovers,
        segments
      }
    ],
    affiliateUrl: '',
    lastTicketingDate: params.departureDate
  };

  if (params.returnDate) {
    const returnSeed = hash(`${params.destination}-${params.origin}-${params.returnDate}-${index}`);
    const returnAirline = AIRLINES[(returnSeed + index) % AIRLINES.length];
    const returnDepart = new Date(`${params.returnDate}T08:30:00.000Z`);
    returnDepart.setMinutes(returnDepart.getMinutes() + index * 95);
    const returnDuration = 90 + ((returnSeed + index * 23) % 120);

    offer.price += 3500 + ((returnSeed + index * 541) % 7500);
    offer.totalDurationMinutes += returnDuration;
    offer.airlines = uniqueSorted([...offer.airlines, returnAirline.name]);
    offer.airlineCodes = uniqueSorted([...offer.airlineCodes, returnAirline.code]);
    offer.validatingAirlineCodes = offer.airlineCodes;
    offer.itineraries.push({
      durationMinutes: returnDuration,
      layovers: 0,
      segments: [
        {
          departureCode: params.destination,
          departureTime: returnDepart.toISOString(),
          arrivalCode: params.origin,
          arrivalTime: addMinutes(returnDepart, returnDuration),
          carrierCode: returnAirline.code,
          carrierName: returnAirline.name,
          flightNumber: `${returnAirline.code}${100 + (returnSeed % 899)}`,
          aircraft: 'Demo aircraft',
          durationMinutes: returnDuration
        }
      ]
    });
  }

  offer.affiliateUrl = buildAffiliateUrl({
    baseUrl: process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL,
    offer,
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    returnDate: params.returnDate
  });

  return offer;
}

export async function searchMockFlightOffers(params: SearchParams): Promise<SearchResponse> {
  const count = Math.min(params.max || 12, 20);
  const flights = Array.from({ length: count }, (_, index) => makeFlight(params, index));
  const carriers = Object.fromEntries(AIRLINES.map((airline) => [airline.code, airline.name]));

  return {
    flights,
    carriers,
    currency: params.currencyCode || 'INR',
    meta: {
      count: flights.length,
      source: 'mock',
      apiMode: 'free-demo'
    }
  };
}
