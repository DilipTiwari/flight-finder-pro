# Deployment Guide — Free MVP Mode

This project is ready for free-tier deployment on Vercel.

## Recommended first launch

Start with the demo provider so you do not pay for any flight API while validating the website.

```bash
FLIGHT_DATA_PROVIDER=mock
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_AFFILIATE_BASE_URL=https://example.com/affiliate-flight-search
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Local test

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Deploy to Vercel

1. Push the project to GitHub.
2. Go to Vercel.
3. Import the GitHub repo.
4. Add environment variables:

```bash
FLIGHT_DATA_PROVIDER=mock
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_AFFILIATE_BASE_URL=https://example.com/affiliate-flight-search
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

5. Click Deploy.

## After deployment

Check:

- Homepage loads on desktop and mobile
- Search form works
- Price/duration/layover/airline filters work
- Privacy page loads at `/privacy`
- Cookie consent banner appears
- Affiliate button opens a placeholder/partner URL

## Live supplier API later

When the site has traffic or affiliate clicks, connect a real provider by switching the provider layer in `lib/flight-search.ts`.

Do not add API secrets to frontend code. Keep supplier API tokens in server-side environment variables only.
