import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { searchFlightOffers, validateSearchParams } from '@/lib/flight-search';

export const dynamic = 'force-dynamic';

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = validateSearchParams(Object.fromEntries(searchParams.entries()));

    if (params.origin === params.destination) {
      return errorResponse('Origin and destination cannot be the same.');
    }

    const result = await searchFlightOffers(params);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse('Please enter valid IATA airport codes, dates, and passenger count.');
    }

    const message = error instanceof Error ? error.message : 'Unknown server error';
    const status = message.includes('Missing Amadeus') ? 500 : 502;
    return errorResponse(message, status);
  }
}
