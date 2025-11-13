# Migration to OpenNext

## Summary
Successfully migrated from `@cloudflare/next-on-pages` (deprecated) to `@opennextjs/cloudflare` (official Next.js adapter for Cloudflare).

## Key Changes

### 1. Dependencies
- **Removed:** `@cloudflare/next-on-pages@^1.11.0`, `vercel@^48.9.1`
- **Added:** `@opennextjs/cloudflare@^1.12.0`
- **Upgraded:** `wrangler` from `^3.0.0` to `^4.38.0` (required by OpenNext)

### 2. Configuration Files

#### `wrangler.toml`
```toml
# Changed from:
pages_build_output_dir = ".vercel/output/static"

# To:
main = ".open-next/worker.js"
```

#### `open-next.config.ts` (NEW)
Created configuration file for OpenNext with Cloudflare-specific settings:
- Uses `cloudflare-node` wrapper for server functions
- Uses `cloudflare-edge` wrapper for middleware
- Configured dummy cache handlers (can be upgraded to KV later)

### 3. App Router Changes
- **Removed** `export const runtime = 'edge';` from all pages and routes
- OpenNext automatically handles runtime configuration
- Affected files:
  - `app/page.tsx`
  - `app/map/page.tsx`
  - `app/properties/[slug]/page.tsx`
  - `app/sitemap.xml/route.ts`

### 4. Build Scripts
```json
{
  "pages:build": "opennextjs-cloudflare build",
  "pages:deploy": "npm run pages:build && wrangler pages deploy"
}
```

### 5. GitHub Actions
Added two-step build process:
1. Build Next.js app: `npm run build`
2. Build Cloudflare worker: `npm run pages:build`

## What OpenNext Does Better

1. **Official Support:** Recommended by Cloudflare (old adapter was deprecated)
2. **Node.js Runtime:** Full Node.js API support (not just Edge Runtime)
3. **Better Compatibility:** Works with more Next.js features out of the box
4. **No Middleware Hacks:** Handles async_hooks and other Node.js APIs properly
5. **Active Development:** Part of the OpenNext project, actively maintained

## Build Output

OpenNext generates `.open-next/` directory with:
- `worker.js` - Main Cloudflare Worker entry point
- `server-functions/` - Server-side functions
- `middleware/` - Middleware handlers
- `assets/` - Static assets
- `cache/` - Cache handlers

## Deployment

### Cloudflare Pages Dashboard Settings:
- **Build command:** `npm run pages:build`
- **Build output directory:** `.open-next` (managed by wrangler.toml)
- **Environment variables:** Same as before

### Local Development:
```bash
npm run dev          # Next.js dev server (same as before)
npm run build        # Build Next.js app
npm run pages:build  # Build Cloudflare worker with OpenNext
npm run pages:deploy # Deploy to Cloudflare Pages
```

## Notes

- `.open-next` is added to `.gitignore`
- No more complex patching scripts needed
- Middleware works out of the box (if needed in future)
- Can upgrade to KV-backed caching later by modifying `open-next.config.ts`

## References

- [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare)
- [GitHub Repository](https://github.com/opennextjs/opennextjs-cloudflare)
- [Cloudflare Workers Guide](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/)

