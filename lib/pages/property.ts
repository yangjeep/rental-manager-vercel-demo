import type { Listing } from "../types";
import { renderLayout } from "./layout";
import { SITE_TITLE, escapeAttribute, escapeHtml, formatPrice } from "./shared";

type PropertyPageOptions = {
  listing: Listing;
};

export function renderPropertyPage({ listing }: PropertyPageOptions): string {
  const gallery = renderGallery(listing);
  const meta = `
    <ul class="meta">
      <li><span>Monthly rent</span><strong>${formatPrice(listing.price)}</strong></li>
      <li><span>Bedrooms</span><strong>${escapeHtml(String(listing.bedrooms || "—"))}</strong></li>
      <li><span>Bathrooms</span><strong>${escapeHtml(listing.bathrooms ? String(listing.bathrooms) : "—")}</strong></li>
      <li><span>Status</span><strong class="status ${listing.status.toLowerCase()}">${escapeHtml(listing.status)}</strong></li>
    </ul>
  `;
  const description = listing.description
    ? `<div class="prose">${escapeHtml(listing.description).replace(/\n/g, "<br>")}</div>`
    : `<p class="muted">No description yet.</p>`;

  const body = `
    <a class="back" href="/">← Back to all listings</a>
    <article class="property">
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(listing.city)}</p>
          <h1>${escapeHtml(listing.title)}</h1>
          <p class="address">${escapeHtml(listing.address || "")}</p>
        </div>
        <div class="cta">
          <span class="price">${formatPrice(listing.price)} / mo</span>
          <a class="button" href="mailto:rentals@example.com?subject=${encodeURIComponent(`Inquiry: ${listing.title}`)}">Contact</a>
        </div>
      </header>
      ${gallery}
      ${meta}
      ${description}
    </article>
  `;

  return renderLayout({
    title: `${listing.title} · ${SITE_TITLE}`,
    body,
  });
}

function renderGallery(listing: Listing): string {
  const image = listing.imageUrl || "/placeholder.jpg";
  return `<div class="gallery">
    <img src="${escapeAttribute(image)}" alt="${escapeAttribute(listing.title)} photo" loading="lazy" />
  </div>`;
}

