// lib/fetchListings.airtable.ts
import type { EnvSource } from "./env";
import { envFlag, readEnv } from "./env";
import type { Listing } from "./types";

// ---------- helpers ----------
function slugify(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function extractAttachmentUrls(value: unknown): string[] | undefined {
  if (!value) return undefined;
  const asArray = Array.isArray(value) ? value : [value];
  const urls = asArray
    .map((entry: any) => {
      if (entry && typeof entry.url === "string") return entry.url;
      if (typeof entry === "string") return entry;
      return undefined;
    })
    .filter((url): url is string => typeof url === "string" && url.trim().length > 0);
  return urls.length ? urls : undefined;
}

// ---------- airtable fetch ----------
type AirtableRecord = { id: string; fields: Record<string, any> };

export async function fetchListings(env: EnvSource = {}): Promise<Listing[]> {
  console.log("[fetchListings] Starting Airtable fetch...");
  
  try {
    const token = readEnv(env, "AIRTABLE_TOKEN");
    const baseId = readEnv(env, "AIRTABLE_BASE_ID");
    const table = readEnv(env, "AIRTABLE_INVENTORY_TABLE_NAME") || "Properties";
    const r2Field = readEnv(env, "AIRTABLE_R2_IMAGE_FIELD") || "R2 Images";
    const isCI = envFlag(env, "CI");
    const isProduction = readEnv(env, "NODE_ENV") === "production";
    
    console.log("[fetchListings] Environment check:", {
      hasToken: !!token,
      tokenPrefix: token ? `${token.substring(0, 8)}...` : "N/A",
      baseId: baseId || "N/A",
      table,
      r2Field,
      isCI,
      isProduction,
    });
    
    if (!token || !baseId) {
      // In CI/build environments, return empty array instead of throwing
      if (isCI || isProduction) {
        console.error("[fetchListings] ERROR: Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID - returning empty listings array");
        console.error("[fetchListings] token exists:", !!token, "baseId exists:", !!baseId);
        return [];
      }
      throw new Error("Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID");
    }

    // 拉取 100 条，可按需分页扩展
    const url =
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}` +
      `?pageSize=100&sort[0][field]=Title`;

    console.log("[fetchListings] Fetching from URL:", url.replace(baseId, `${baseId.substring(0, 8)}...`));

    // Cache Airtable data for 60 seconds
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("[fetchListings] Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("[fetchListings] ERROR: Airtable fetch failed");
      console.error("[fetchListings] Status:", res.status);
      console.error("[fetchListings] Status Text:", res.statusText);
      console.error("[fetchListings] Error body:", errorText);
      
      // In CI/build environments, return empty array instead of throwing
      if (isCI) {
        console.warn(`[fetchListings] Returning empty array due to CI environment`);
        return [];
      }
      throw new Error(`Airtable fetch failed: ${res.status} ${res.statusText} - ${errorText}`);
    }
    
    const json = await res.json();
    console.log("[fetchListings] Successfully fetched records:", json.records?.length || 0);

    // 先做基础字段映射
    const baseItems: Listing[] = (json.records as AirtableRecord[]).map(({ fields }, index) => {
      try {
        // 基础字段名完全按你截图里的列来取：
        const title: string = fields["Title"] ?? "";
        // Ensure slug is always a string
        const rawSlug = fields["Slug"];
        const slug: string = rawSlug != null ? String(rawSlug) : slugify(title);
        const price: number = toNum(fields["Monthly Rent"]);
        const bedrooms: number = toNum(fields["Bedrooms"]);
        const bathrooms: number = toNum(fields["Bathrooms"]);
        const status: string = fields["Status"] ?? "Available";
        const city: string = fields["City"] ?? "";
        const address: string = fields["Address"] ?? "";
        const description: string = fields["Description"] ?? "";
        const pets: string | undefined = fields["Pets"] ?? undefined;

        // Parking is always text - convert to string
        const rawParking = fields["Parking"];
        const parking = rawParking != null ? String(rawParking).trim() : undefined;

        // R2 attachment field provides the cover image and gallery
        const r2Images = extractAttachmentUrls(fields[r2Field]);
        const fallbackImages = ["/placeholder.jpg", "/placeholder2.jpg"];
        // Use R2 images if available, otherwise use fallbacks
        // If only 1 R2 image, use it alone (no placeholders)
        const images = r2Images && r2Images.length > 0 ? r2Images : fallbackImages;

        return {
          id: fields["ID"] ? String(fields["ID"]) : slug || crypto.randomUUID(),
          title,
          slug,
          price,
          city,
          address,
          status,
          bedrooms,
          bathrooms: bathrooms || undefined,
          parking,
          pets,
          description,
          imageUrl: images[0],
          images: images,
        };
      } catch (mapError) {
        console.error(`[fetchListings] ERROR: Failed to map record ${index}:`, mapError);
        console.error(`[fetchListings] Record fields:`, fields);
        throw mapError;
      }
    });

    console.log("[fetchListings] Successfully mapped", baseItems.length, "listings");
    return baseItems;
  } catch (error) {
    console.error("[fetchListings] FATAL ERROR:", error);
    console.error("[fetchListings] Error stack:", error instanceof Error ? error.stack : "N/A");
    throw error;
  }
}
