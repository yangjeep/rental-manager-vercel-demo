import Link from "next/link";
import type { Listing } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/properties/${listing.slug}`} className="card overflow-hidden hover:border-white/30">
      <img src={listing.imageUrl} alt={listing.title} className="h-48 w-full object-cover" />
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{listing.title}</h3>
          <span className="text-sm opacity-70">{badge(listing.status)}</span>
        </div>
        <div className="opacity-80">${listing.price} / mo · {listing.bedrooms} BR · {listing.city}</div>
      </div>
    </Link>
  );
}

function badge(status: Listing['status']) {
  if (status === "Rented") return "Rented";
  if (status === "Pending") return "Pending";
  return "Available";
}
