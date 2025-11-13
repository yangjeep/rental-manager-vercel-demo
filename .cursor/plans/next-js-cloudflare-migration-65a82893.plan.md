<!-- 65a82893-a696-4658-8b17-91751738abc0 18804aaf-2786-4060-aadc-772afd72fe91 -->
# Next.js Migration Plan for Cloudflare Pages

## Overview

Migrate from custom TypeScript template functions to Next.js App Router with Tailwind CSS, maintaining all existing functionality while leveraging Next.js features for better developer experience and performance.

## Architecture Changes

### Current Structure

- `functions/[[path]].ts` - Single catch-all route handler
- `lib/pages/*.ts` - Template rendering functions
- `public/` - Static assets
- Manual HTML string concatenation

### Target Structure

- `app/` - Next.js App Router pages
- `components/` - React components
- `lib/` - Shared utilities (fetchListings, geocode, etc.)
- `public/` - Static assets (unchanged)
- `workers/r2-sync/` - Keep separate (unchanged)

## Implementation Steps

### 1. Setup Next.js and Dependencies

- Install Next.js, React, React DOM
- Install `@cloudflare/next-on-pages` for Cloudflare Pages support
- Install Tailwind CSS and dependencies
- Update `package.json` scripts
- Create `next.config.js` with Cloudflare adapter configuration

### 2. Project Structure Migration

- Create `app/` directory with App Router structure:
- `app/layout.tsx` - Root layout (replaces `lib/pages/layout.ts`)
- `app/page.tsx` - Home page (replaces home route)
- `app/map/page.tsx` - Map page
- `app/apply/page.tsx` - Application page
- `app/about/page.tsx` - About page
- `app/properties/[slug]/page.tsx` - Dynamic property detail page
- `app/sitemap.xml/route.ts` - Sitemap API route
- `app/not-found.tsx` - 404 page
- Create `components/` directory for reusable React components

### 3. Convert Template Functions to React Components

- **Layout Component** (`app/layout.tsx`):
- Convert `renderLayout()` to Next.js root layout
- Include navigation, header, footer
- Handle metadata and head tags

- **Home Page** (`app/page.tsx`):
- Convert `renderHomePage()` to Server Component
- Fetch listings using `fetchListings()` in Server Component
- Create `ListingCard` component
- Create `FilterControls` component (client component for interactivity)

- **Map Page** (`app/map/page.tsx`):
- Convert `renderMapPage()` to Server Component
- Create `MapView` client component for Google Maps
- Handle geocoding and map markers

- **Property Detail** (`app/properties/[slug]/page.tsx`):
- Convert `renderPropertyPage()` to dynamic route
- Create `PropertyGallery` component
- Create `PropertyMeta` component

- **Static Pages**:
- `app/apply/page.tsx` - Airtable embed iframe
- `app/about/page.tsx` - Static content

- **Sitemap** (`app/sitemap.xml/route.ts`):
- Convert to Next.js Route Handler
- Generate XML dynamically

### 4. Convert Shared Utilities

- Keep `lib/fetchListings.ts` (works as-is)
- Keep `lib/geocode.ts` (works as-is)
- Keep `lib/types.ts` (works as-is)
- Update `lib/env.ts` to work with Next.js environment variables
- Convert `lib/auth.ts` to Next.js middleware for Basic Auth

### 5. Styling Migration

- Install and configure Tailwind CSS
- Convert `public/styles.css` to Tailwind utility classes
- Create component-level styles where needed
- Preserve dark theme and design system
- Update `app/globals.css` with Tailwind directives and custom CSS variables

### 6. Authentication & Security

- Create `middleware.ts` for Basic Auth (DEMO_USER/DEMO_PASS)
- Handle X-Robots-Tag headers via Next.js metadata API
- Preserve DEMO_NOINDEX functionality

### 7. Data Fetching & Caching

- Use Next.js Server Components for data fetching
- Implement `fetch()` with `next: { revalidate: 60 }` for Airtable data
- Leverage Next.js built-in caching

### 8. Client-Side Interactivity

- Convert filter form to client component with `'use client'`
- Convert gallery image switcher to client component
- Convert Google Maps integration to client component
- Use React state management instead of inline JavaScript

### 9. Configuration Updates

- Update `wrangler.toml` for Next.js build output
- Update `tsconfig.json` for Next.js paths and includes
- Create `tailwind.config.js`
- Create `postcss.config.js` (if needed)
- Update `.gitignore` for Next.js build artifacts

### 10. Environment Variables

- Update environment variable access to use Next.js patterns
- Keep Cloudflare Pages environment variable compatibility
- Update `env.example` with Next.js-specific vars if needed

### 11. Build & Deployment

- Update `package.json` build script
- Ensure `@cloudflare/next-on-pages` build works
- Test local development with `npm run dev`
- Verify Cloudflare Pages deployment compatibility

## Files to Create

- `app/layout.tsx`
- `app/page.tsx`
- `app/map/page.tsx`
- `app/apply/page.tsx`
- `app/about/page.tsx`
- `app/properties/[slug]/page.tsx`
- `app/sitemap.xml/route.ts`
- `app/not-found.tsx`
- `app/globals.css`
- `middleware.ts`
- `next.config.js`
- `tailwind.config.js`
- `components/ListingCard.tsx`
- `components/FilterControls.tsx`
- `components/MapView.tsx`
- `components/PropertyGallery.tsx`
- `components/Navigation.tsx`

## Files to Modify

- `package.json` - Add dependencies and update scripts
- `tsconfig.json` - Update for Next.js
- `wrangler.toml` - Update build configuration
- `lib/env.ts` - Adapt for Next.js env access
- `lib/auth.ts` - Convert to middleware or route handler

## Files to Keep Unchanged

- `workers/r2-sync/` - Entire directory
- `public/placeholder*.jpg` - Static assets
- `public/robots.txt` - Keep as-is
- `lib/fetchListings.ts` - Core logic unchanged
- `lib/geocode.ts` - Core logic unchanged
- `lib/types.ts` - Type definitions unchanged

## Files to Remove (After Migration)

- `functions/[[path]].ts` - Replaced by App Router
- `lib/pages/*.ts` - Replaced by React components
- `public/_routes.json` - Not needed with Next.js

## Key Considerations

- Maintain exact same functionality and routes
- Preserve Basic Auth behavior
- Preserve X-Robots-Tag for DEMO_NOINDEX
- Keep all existing environment variables
- Ensure edge runtime compatibility
- Maintain type safety throughout
- Preserve dark theme styling
- Keep Google Maps integration working
- Maintain Airtable data fetching patterns

### To-dos

- [ ] Install Next.js, React, @cloudflare/next-on-pages, Tailwind CSS and configure project structure
- [ ] Create app/layout.tsx with navigation, header, footer (replaces lib/pages/layout.ts)
- [ ] Convert home page to app/page.tsx with ListingCard and FilterControls components
- [ ] Convert property detail page to app/properties/[slug]/page.tsx with PropertyGallery component
- [ ] Convert map page to app/map/page.tsx with MapView client component for Google Maps
- [ ] Convert apply and about pages to Next.js App Router pages
- [ ] Convert sitemap to app/sitemap.xml/route.ts API route handler
- [ ] Create middleware.ts for Basic Auth (DEMO_USER/DEMO_PASS) and X-Robots-Tag headers
- [ ] Convert public/styles.css to Tailwind CSS utility classes in components and globals.css
- [ ] Update wrangler.toml, tsconfig.json, package.json for Next.js build and deployment
- [ ] Update lib/env.ts to work with Next.js environment variables while maintaining Cloudflare compatibility
- [ ] Remove old functions/[[path]].ts and lib/pages/*.ts files after migration is complete