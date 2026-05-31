# Flight Finder Pro — Free MVP Starter

A ready-to-host responsive flight comparison website built with **Next.js + TypeScript + Tailwind CSS**.

This version is designed for your current goal: **launch free first, validate the idea, then invest in a live paid flight API later**.

By default it uses **free demo flight data** so the website can run without any paid supplier API. Users can still test search, sorting, filtering and affiliate button flow. When your site gets traffic, you can switch to a live supplier such as Duffel/Amadeus/affiliate API by replacing the server-side provider.

## Features

- Search form with airport codes, dates, passengers and class
- Sort/filter by:
  - Price
  - Duration
  - Layovers
  - Airline
- Mobile and desktop responsive UI
- Affiliate link placeholders
- Consent-based Google Analytics 4 loading
- GDPR-friendly privacy page and cookie consent banner
- Free-tier Vercel deployment path
- Future roadmap for price alerts and user accounts

> Important: In `mock` mode, fares are sample/demo prices. They are not real live flight prices. Use this mode to launch and validate the product without spending money.

---

## 1. Tech stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Default flight data:** Free demo/mock provider
- **Optional later provider:** Amadeus or another live supplier API
- **Hosting:** Vercel free tier recommended
- **Analytics:** Google Analytics 4, loaded only after consent

---

## 2. Project structure

```txt
flight-finder-pro/
├── app/
│   ├── api/flights/search/route.ts    # Server API route for flight search
│   ├── privacy/page.tsx                # GDPR/privacy page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                        # Main flight search page
├── components/
│   ├── Analytics.tsx                   # Consent-gated GA4 loader
│   ├── CookieConsent.tsx
│   ├── FilterPanel.tsx
│   ├── FlightCard.tsx
│   └── SearchForm.tsx
├── docs/
│   ├── DEPLOYMENT.md
│   ├── GDPR-CHECKLIST.md
│   └── ROADMAP.md
├── lib/
│   ├── flight-search.ts                # Provider selector: mock or live API
│   ├── mock-flights.ts                 # Free demo data provider
│   ├── amadeus.ts                      # Optional Amadeus provider
│   ├── flight-utils.ts
│   └── types.ts
├── .env.example
└── package.json
```

---

## 3. Local setup

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

For free startup mode, keep this:

```bash
FLIGHT_DATA_PROVIDER=mock
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_AFFILIATE_BASE_URL=https://example.com/affiliate-flight-search
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You do not need Duffel, Amadeus or any paid API for this free mode.

### Step 3: Run locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Try a search like:

```txt
From: BLR
To: DEL
Date: any future date
Adults: 1
```

---

## 4. Free launch plan

Use this order:

1. Launch with `FLIGHT_DATA_PROVIDER=mock`.
2. Deploy on Vercel free tier.
3. Add Google Analytics only after you create GA4.
4. Add affiliate links/widgets when you get partner approval.
5. Promote the site and check whether users search routes.
6. Invest in a live flight API only after you see real traffic or affiliate clicks.

---

## 5. Affiliate placeholders

The app generates outbound booking buttons using:

```txt
NEXT_PUBLIC_AFFILIATE_BASE_URL
```

Example generated link:

```txt
https://example.com/affiliate-flight-search?origin=BLR&destination=DEL&departureDate=2026-06-10&airline=AI&utm_source=flight_finder_pro&utm_medium=affiliate_placeholder
```

Before going live with real monetization:

- Replace the URL with your approved affiliate partner URL.
- Add required affiliate disclosures.
- Confirm the partner accepts your query parameters.

---

## 6. Optional live API later

The code still includes an optional Amadeus provider:

```bash
FLIGHT_DATA_PROVIDER=amadeus
AMADEUS_CLIENT_ID=your_key
AMADEUS_CLIENT_SECRET=your_secret
AMADEUS_BASE_URL=https://test.api.amadeus.com
```

However, you should only switch to a live/paid provider after you validate the site.

For Duffel or any other provider, create a new file in `lib/`, normalize the response to `NormalizedFlightOffer`, then route it through `lib/flight-search.ts`.

---

## 7. Google Analytics

Google Analytics is optional. Add your GA4 Measurement ID:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Analytics loads only after the visitor clicks **Accept analytics** in the cookie banner. If rejected, the app still works normally.

---

## 8. GDPR notes

Current app behavior:

- Does not create user accounts
- Does not store flight searches in a database
- Does not collect names, emails, phone numbers or payment data
- Uses optional analytics only after consent
- Includes `/privacy` page

If you add price alerts or user accounts later, complete the checklist in `docs/GDPR-CHECKLIST.md`.

---

## 9. Deployment

See `docs/DEPLOYMENT.md` for Vercel deployment steps.

Recommended free MVP architecture:

```txt
Browser
  ↓
Next.js UI on Vercel Edge/CDN
  ↓
Next.js serverless API route /api/flights/search
  ↓
Mock/demo provider now; live supplier API later
```

---

## 10. Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Run production server locally
npm run lint       # Lint project
npm run typecheck  # TypeScript check
```
