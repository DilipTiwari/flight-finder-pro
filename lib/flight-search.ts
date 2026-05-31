import { searchFlightOffers as searchAmadeusFlightOffers, validateSearchParams } from './amadeus';
import { searchMockFlightOffers } from './mock-flights';
import type { SearchParams, SearchResponse } from './types';

export { validateSearchParams };

export async function searchFlightOffers(params: SearchParams): Promise<SearchResponse> {
  const provider = (process.env.FLIGHT_DATA_PROVIDER || 'mock').toLowerCase();

  if (provider === 'amadeus') {
    return searchAmadeusFlightOffers(params);
  }

  return searchMockFlightOffers(params);
}
