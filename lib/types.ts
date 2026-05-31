export type SearchParams = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
};

export type NormalizedSegment = {
  departureCode: string;
  departureTime: string;
  arrivalCode: string;
  arrivalTime: string;
  carrierCode: string;
  carrierName: string;
  flightNumber: string;
  aircraft?: string;
  durationMinutes: number;
};

export type NormalizedItinerary = {
  durationMinutes: number;
  layovers: number;
  segments: NormalizedSegment[];
};

export type NormalizedFlightOffer = {
  id: string;
  source: string;
  price: number;
  currency: string;
  totalDurationMinutes: number;
  maxLayovers: number;
  totalLayovers: number;
  airlines: string[];
  airlineCodes: string[];
  validatingAirlineCodes: string[];
  itineraries: NormalizedItinerary[];
  affiliateUrl: string;
  lastTicketingDate?: string;
};

export type SearchResponse = {
  flights: NormalizedFlightOffer[];
  carriers: Record<string, string>;
  currency: string;
  meta: {
    count: number;
    source: 'mock' | 'amadeus';
    apiMode: 'free-demo' | 'test' | 'production';
  };
};
