"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function Filters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [city, setCity] = useState(sp.get("city") || "");
  const [bedrooms, setBedrooms] = useState(sp.get("bedrooms") || "");
  const [min, setMin] = useState(sp.get("min") || "");
  const [max, setMax] = useState(sp.get("max") || "");
  const [status, setStatus] = useState(sp.get("status") || "");

  useEffect(() => {
    setCity(sp.get("city") || "");
    setBedrooms(sp.get("bedrooms") || "");
    setMin(sp.get("min") || "");
    setMax(sp.get("max") || "");
    setStatus(sp.get("status") || "");
  }, [sp]);

  const apply = useCallback(() => {
    const p = new URLSearchParams();
    if (city) p.set("city", city);
    if (bedrooms) p.set("bedrooms", bedrooms);
    if (min) p.set("min", min);
    if (max) p.set("max", max);
    if (status) p.set("status", status);
    router.push(`/?${p.toString()}`);
  }, [router, city, bedrooms, min, max, status]);

  const reset = useCallback(() => {
    setCity(""); setBedrooms(""); setMin(""); setMax(""); setStatus("");
    router.push(`/`);
  }, [router]);

  return (
    <section className="card p-4">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div>
          <div className="label mb-1">City</div>
          <input className="input w-full" value={city} onChange={e => setCity(e.target.value)} placeholder="Ottawa" />
        </div>
        <div>
          <div className="label mb-1">Bedrooms ≥</div>
          <input className="input w-full" value={bedrooms} onChange={e => setBedrooms(e.target.value)} inputMode="numeric" placeholder="2" />
        </div>
        <div>
          <div className="label mb-1">Min $</div>
          <input className="input w-full" value={min} onChange={e => setMin(e.target.value)} inputMode="numeric" placeholder="1200" />
        </div>
        <div>
          <div className="label mb-1">Max $</div>
          <input className="input w-full" value={max} onChange={e => setMax(e.target.value)} inputMode="numeric" placeholder="3000" />
        </div>
        <div>
          <div className="label mb-1">Status</div>
          <select className="input w-full" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Available only</option>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Rented">Rented</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button className="btn" onClick={apply}>Apply</button>
          <button className="btn" onClick={reset}>Reset</button>
        </div>
      </div>
    </section>
  );
}
