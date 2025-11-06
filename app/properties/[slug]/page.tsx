import { fetchListings } from "@/lib/fetchListings";
import ContactForm from "@/components/ContactForm";
import type { Listing } from "@/lib/types";

export async function generateStaticParams() {
  const list = await fetchListings();
  return list.map((l: Listing) => ({ slug: l.slug }));
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const list: Listing[] = await fetchListings();
  const item = list.find(l => l.slug === params.slug);
  if (!item) return <div className="opacity-70">Not found.</div>;
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold">{item.title}</h1>
      <img src={item.imageUrl} alt={item.title} className="w-full rounded-2xl border border-white/10" />
      <p className="text-lg">${item.price} / month · {item.bedrooms} BR · {item.city}</p>
      <div className="opacity-90 whitespace-pre-line">{item.description}</div>
      <div className="opacity-70 text-sm">Address: {item.address}</div>
      <ContactForm listingTitle={item.title} />
    </article>
  );
}
