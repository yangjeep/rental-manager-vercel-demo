# Rentals Demo (Next.js + Airtable)

A ready-to-deploy demo environment for a rental listings website.

## Quick Start

```bash
npm install
cp env.example .env.local
# Edit AIRTABLE_TOKEN, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_NAME (optional)
npm run dev
```

Deploy to Vercel and set the same env vars in Project Settings.

## Datasource (Airtable)

Table name: `Properties` (default, configurable via `AIRTABLE_TABLE_NAME`)

### Required Fields

- `ID` — Unique identifier (string)
- `Title` — Property title
- `Monthly Rent` — Monthly rental price (number)
- `Bedrooms` — Number of bedrooms (number)
- `Bathrooms` — Number of bathrooms (number)
- `Status` — Availability status (e.g., "Available")
- `City` — City name
- `Address` — Full address
- `Description` — Property description

### Optional Fields

- `Slug` — URL-friendly identifier (auto-generated from Title if not provided)
- `Pets` — Pet policy (e.g., "Allowed", "Not Allowed", "Conditional")
- `Parking` — Parking information (accepts "Yes/No", "True/False", "1/0", or free text like "1 spot", "Street")
- `Image Folder URL` — Google Drive folder URL or folder ID for property images

## Security / Demo

- Basic Auth is enabled via `middleware.ts` using `DEMO_USER`/`DEMO_PASS`.
- `DEMO_NOINDEX=true` adds `X-Robots-Tag: noindex, nofollow`.
- For production, remove `robots.txt` block and set `DEMO_NOINDEX=false`.

## Revalidate

- ISR is set via `REVALIDATE_SECONDS` (default 60 for preview).
- Manual revalidate endpoint: `/api/revalidate?secret=...` with env `REVALIDATE_SECRET`.

## Tech

- Next.js App Router
- Tailwind CSS
- No backend server needed

### Environment Variables

- `AIRTABLE_TOKEN` — Airtable API token (required)
- `AIRTABLE_BASE_ID` — Airtable base ID (required)
- `AIRTABLE_TABLE_NAME` — Table name (optional, defaults to "Properties")
- `DRIVE_LIST_ENDPOINT` — Optional endpoint for fetching images from Google Drive folders
