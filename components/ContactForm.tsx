"use client";
import { useEffect } from "react";

export default function ContactForm({ listingTitle }: { listingTitle: string }) {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "";
  const formId   = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID || "";

  useEffect(() => {
    if (!portalId || !formId) return;
    const s = document.createElement("script");
    s.src = "https://js.hsforms.net/forms/embed/v2.js";
    s.async = true;
    s.onload = () => {
      (window as any).hbspt?.forms?.create?.({
        region: "na1",
        portalId, formId,
        target: "#hs-form",
        onFormReady: ($form: any) => {
          try {
            const hidden = $form.find('input[name="listing"]');
            if (hidden.length) hidden.val(listingTitle);
          } catch {}
        }
      });
    };
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, [portalId, formId, listingTitle]);

  if (!portalId || !formId) {
    return (
      <section className="card p-4">
        <h2 className="mb-2 text-xl font-semibold">Apply / Inquire</h2>
        <p className="opacity-80 text-sm">
          HubSpot form not configured. Set NEXT_PUBLIC_HUBSPOT_PORTAL_ID and NEXT_PUBLIC_HUBSPOT_FORM_ID to enable.
        </p>
      </section>
    );
  }

  return (
    <section className="card p-4">
      <h2 className="mb-2 text-xl font-semibold">Apply / Inquire</h2>
      <div id="hs-form" />
    </section>
  );
}
