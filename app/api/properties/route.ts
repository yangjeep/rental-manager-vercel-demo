import { NextResponse } from "next/server";
import { fetchListings } from "@/lib/fetchListings";

export async function GET() {
  try {
    const listings = await fetchListings();
    // Return titles and record IDs for the dropdown
    const properties = listings.map((listing) => ({
      title: listing.title,
      recordId: listing.airtableRecordId,
    }));
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

