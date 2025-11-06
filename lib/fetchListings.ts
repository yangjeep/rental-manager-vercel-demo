import { slugify } from "./utils";
import type { Listing } from "./types";
import fs from "node:fs/promises";
import path from "node:path";

export async function fetchListings(): Promise<Listing[]> {
  const url = process.env.NEXT_PUBLIC_LISTINGS_URL;
  const revalidate = Number(process.env.REVALIDATE_SECONDS || 3600);

  try {
    if (!url) throw new Error("NEXT_PUBLIC_LISTINGS_URL not set");
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`Failed to fetch listings: ${res.status}`);
    const rows = await res.json();
    return normalize(rows);
  } catch (e) {
    // Fallback to sample data
    const p = path.join(process.cwd(), "data", "listings.sample.json");
    const raw = await fs.readFile(p, "utf-8");
    const rows = JSON.parse(raw);
    return normalize(rows);
  }
}

function normalize(rows: any[]): Listing[] {
  return rows.map((r: any) => ({
    id: r.ID || crypto.randomUUID(),
    title: r.Title,
    slug: r.Slug || slugify(r.Title),
    price: Number(r.Price || 0),
    city: r.City || "",
    bedrooms: Number(r.Bedrooms || 0),
    status: r.Status || "Available",
    imageUrl: r.ImageURL || "/placeholder.jpg",
    description: r.Description || "",
    address: r.Address || "",
  }));
}
