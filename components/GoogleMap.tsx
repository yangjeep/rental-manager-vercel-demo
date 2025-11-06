"use client";
import type { Listing } from "@/lib/types";

type GoogleMapProps = {
  listings?: Listing[];
  listing?: Listing;
  height?: string;
};

export default function GoogleMapComponent({ listings, listing, height = "500px" }: GoogleMapProps) {
  // Get the Google My Maps map ID from environment variable
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "1FjdzczdBlhZ5gV1nAh7IBLpomib8Abg";
  
  // Build the iframe URL
  const mapUrl = `https://www.google.com/maps/d/embed?mid=${mapId}&ehbc=2E312F`;

  if (!mapId) {
    return (
      <div className="card p-6 text-center">
        <p className="opacity-70">
          Google Maps not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_ID in your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ height }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

