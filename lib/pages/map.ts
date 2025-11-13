import type { Listing, GeocodedListing } from "../types";
import { renderLayout } from "./layout";
import { SITE_TITLE, escapeAttribute, escapeHtml, formatPrice, renderFilters, serializeForScript } from "./shared";

type MapPageOptions = {
  filteredListings: Listing[];
  allListings: Listing[];
  filters: Record<string, string>;
  markers: GeocodedListing[];
  activePath?: string;
};

export function renderMapPage({ filteredListings, allListings, filters, markers, activePath = "/map" }: MapPageOptions): string {
  const markerPayload = markers.map(marker => ({
    title: marker.title,
    slug: marker.slug,
    latitude: marker.latitude,
    longitude: marker.longitude,
    price: marker.price,
    address: marker.address,
    city: marker.city,
    status: marker.status,
  }));
  const mapDataScript = `<script type="application/json" id="map-data">${serializeForScript(markerPayload)}</script>`;
  const filterControls = renderFilters(allListings, filters, { resetHref: "/map" });
  const listItems = filteredListings.map(listing => {
    const label = listing.address ? `${listing.address}, ${listing.city}` : listing.city || "Location coming soon";
    const query = encodeURIComponent(listing.address || listing.city || listing.title);
    const statusClass = (listing.status || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `<li>
      <div class="listing-stack">
        <span class="listing-name">${escapeHtml(listing.title)}</span>
        <span class="listing-address">${escapeHtml(label)}</span>
        <span class="listing-price">${formatPrice(listing.price)}</span>
        <span class="listing-status ${statusClass}">${escapeHtml(listing.status)}</span>
      </div>
      <div class="listing-actions">
        <a class="button ghost" href="/properties/${encodeURIComponent(listing.slug)}">View</a>
        <a class="button ghost" href="https://maps.google.com/?q=${query}" target="_blank" rel="noopener noreferrer">Directions</a>
      </div>
    </li>`;
  }).join("");

  const body = `
    <section class="page-hero">
      <h1>Explore Properties on the Map</h1>
      <p>Use filters to refine the list and explore available homes with a birds-eye view.</p>
    </section>
    <section class="filters">${filterControls}</section>
    <section class="map-grid">
      <div id="map" role="region" aria-label="Rental property map"></div>
      <ul class="map-list">
        ${listItems || `<li class="muted">No listings available for the selected filters.</li>`}
      </ul>
    </section>
    ${mapDataScript}
  `;

  const extraHead = `
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha512-sA+e2EN0CdmMGcVxXbkqIDgf/mBlC9ZwTe74MkRUYw35vj50IadB1iKsFcfoTmya4A1NVZ4Zs46aPjSkN3jtWQ=="
      crossorigin=""
    />
  `;

  const extraScripts = `
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha512-lInM/ap+5DyoM7g1P53EtJtRRo3qQnsaT5vZebPnnwQOVx0VIykFZ6VwBZE0X0FQIV0Fp1ZpOEdl6glpLH0w2Q==" crossorigin=""></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        var container = document.getElementById("map");
        var dataEl = document.getElementById("map-data");
        if (!container || !dataEl) return;
        var markers = [];
        try {
          markers = JSON.parse(dataEl.textContent || "[]");
        } catch (error) {
          console.error("Failed to parse map markers", error);
        }
        var map = L.map(container, { scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);
        var currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
        function htmlEscape(value) {
          return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        }
        if (markers.length) {
          var bounds = L.latLngBounds();
          markers.forEach(function (marker) {
            var point = L.latLng(marker.latitude, marker.longitude);
            var popupLines = [
              "<strong>" + htmlEscape(marker.title) + "</strong>",
            ];
            if (marker.address) popupLines.push(htmlEscape(marker.address));
            if (marker.city) popupLines.push(htmlEscape(marker.city));
            if (marker.price) popupLines.push("<em>" + currency.format(marker.price) + "</em>");
            var listingUrl = "/properties/" + encodeURIComponent(marker.slug);
            popupLines.push('<a href="' + listingUrl + '">View listing</a>');
            L.marker(point)
              .addTo(map)
              .bindPopup(popupLines.join("<br />"));
            bounds.extend(point);
          });
          map.fitBounds(bounds, { padding: [24, 24] });
        } else {
          map.setView([39.5, -98.35], 4);
        }
      });
    </script>
  `;

  return renderLayout({
    title: `Map · ${SITE_TITLE}`,
    body,
    extraHead,
    extraScripts,
    activePath,
  });
}

