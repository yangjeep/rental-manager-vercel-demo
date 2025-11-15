<!-- 95f7f1d3-5646-4317-9671-673ca3cf3a54 f78ddf0a-bf33-48d8-96ad-05b0b9f53da8 -->
# Migrate from Airtable to D1 and R2

## Overview

Replace Airtable data fetching with Cloudflare D1 database queries using the HTTP API. Images will be retrieved from the `image_folder_url_r2_urls` column in D1 instead of fetching from R2 by slug.

## Implementation Steps

### 1. Add Environment Variables

- Add to `env.example` and document:
- `D1_DATABASE_NAME` (default: `rio-baserow-core`)
- `D1_TABLE_NAME` (default: `table_740124`)
- `CLOUDFLARE_ACCOUNT_ID` (required for D1 HTTP API)
- `CLOUDFLARE_API_TOKEN` (required for D1 HTTP API)

### 2. Create D1 Client Utility

- Create `lib/d1Client.ts`:
- Implement D1 HTTP API client using Cloudflare REST API
- Support SQL queries via POST to `/accounts/{account_id}/d1/database/{database_id}/query`
- Handle authentication with API token
- Add error handling and logging

### 3. Update fetchListings Function

- Modify `lib/fetchListings.ts`:
- Replace Airtable API calls with D1 queries
- Query D1 table using `SELECT * FROM {table_name} ORDER BY title`
- Map D1 columns to Listing type (assume similar field names: Title, Monthly Rent, Bedrooms, Bathrooms, City, Address, Status, Slug, etc.)
- Parse `image_folder_url_r2_urls` column (JSON array or comma-separated) to populate `images` array
- Set `imageUrl` to first image from the array
- Keep existing helper functions (slugify, toNum, parseBoolish)
- Remove Airtable-specific code (fetchImagesFromR2 by slug, since images come from D1 column)
- Keep placeholder fallback logic for missing images

### 4. Update Types

- Update `lib/types.ts`:
- Remove `airtableRecordId` field (or keep for backward compatibility)
- Ensure `imageUrl` and `images` fields remain

### 5. Update API Route

- Modify `app/api/properties/route.ts`:
- Remove `airtableRecordId` reference or use D1 row ID instead
- Ensure it works with new D1-based listings

### 6. Testing Considerations

- Ensure backward compatibility during migration
- Handle cases where `image_folder_url_r2_urls` is null/empty
- Verify image URLs from D1 are accessible
- Test with environment variables

## Files to Modify

- `lib/fetchListings.ts` - Replace Airtable logic with D1 queries
- `lib/types.ts` - Update if needed
- `app/api/properties/route.ts` - Update record ID reference
- `env.example` - Add D1 and Cloudflare API credentials
- `lib/d1Client.ts` - New file for D1 HTTP API client

## Notes

- The `image_folder_url_r2_urls` column should contain an array of R2 image URLs
- If the column format is JSON string, parse it; if comma-separated, split it
- Keep existing R2 image fetching logic as fallback if D1 column is empty
- Maintain same Listing type structure for minimal component changes

### To-dos

- [ ] Add D1 and Cloudflare API environment variables to env.example
- [ ] Create lib/d1Client.ts with D1 HTTP API client implementation
- [ ] Replace Airtable API calls in lib/fetchListings.ts with D1 queries and parse image_folder_url_r2_urls
- [ ] Update app/api/properties/route.ts to work with D1 row IDs
- [ ] Review and update lib/types.ts if needed for D1 migration