import Filters from "@/components/Filters";
import ListingCard from "@/components/ListingCard";
import { fetchListings } from "@/lib/fetchListings";
import type { Listing } from "@/lib/types";

export default async function Home({ searchParams }: { searchParams: any }) {
  const all = await fetchListings();
  const filtered = applyFilters(all, searchParams);
  return (
    <div className="space-y-6">
      <Filters />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l: Listing) => <ListingCard key={l.id} listing={l} />)}
      </div>
      {filtered.length === 0 && (
        <div className="opacity-70">No listings match your filters.</div>
      )}
    </div>
  );
}

function applyFilters(list: Listing[], q: Record<string, string>) {
  return list.filter(l => {
    const okCity = q?.city ? l.city?.toLowerCase() === String(q.city).toLowerCase() : true;
    const okBed  = q?.bedrooms ? Number(l.bedrooms) >= Number(q.bedrooms) : true;
    const min = q?.min ? Number(l.price) >= Number(q.min) : true;
    const max = q?.max ? Number(l.price) <= Number(q.max) : true;
    const status = q?.status ? l.status === q.status : l.status !== "Rented";
    return okCity && okBed && min && max && status;
  });
}
