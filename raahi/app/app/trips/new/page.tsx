"use client";

import { Button, Card, Field, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTripPage() {
  const { me, createTrip } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    fromCity: me?.homeCity || "",
    fromCountry: me?.homeCountry || "United Kingdom",
    fromAirport: "LHR",
    toCity: "Lahore",
    toCountry: "Pakistan",
    toAirport: "LHE",
    villageStops: "Gujranwala, Sialkot",
    departDate: "2026-10-10",
    arriveDate: "2026-10-11",
    airline: "PK",
    flightNoMasked: "",
    itineraryVerified: true,
    capacityKg: 6,
    feePerKgGbp: 9,
    notes: "",
  });

  if (me && me.kyc.status !== "verified") {
    return (
      <Card>
        <h1 className="font-serif text-3xl">Verify identity first</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Travelers must complete KYC and a ticket check before listing spare baggage.</p>
        <div className="mt-4">
          <Button href="/app/kyc">Go to KYC</Button>
        </div>
      </Card>
    );
  }

  return (
    <form
      className="space-y-3 pb-4"
      onSubmit={(event) => {
        event.preventDefault();
        const id = createTrip({
          ...form,
          villageStops: form.villageStops.split(",").map((item) => item.trim()).filter(Boolean),
          itineraryVerified: Boolean(form.flightNoMasked),
        });
        router.push(`/app/trips/${id}`);
      }}
    >
      <h1 className="font-serif text-4xl">Post a trip</h1>
      <p className="text-sm text-[var(--muted)]">Only list towns you will personally visit. That is the whole product.</p>
      <div className="grid grid-cols-2 gap-2">
        <Field label="From city">
          <input className={inputClass} value={form.fromCity} onChange={(e) => setForm({ ...form, fromCity: e.target.value })} required />
        </Field>
        <Field label="From country">
          <input className={inputClass} value={form.fromCountry} onChange={(e) => setForm({ ...form, fromCountry: e.target.value })} required />
        </Field>
        <Field label="To city">
          <input className={inputClass} value={form.toCity} onChange={(e) => setForm({ ...form, toCity: e.target.value })} required />
        </Field>
        <Field label="To country">
          <input className={inputClass} value={form.toCountry} onChange={(e) => setForm({ ...form, toCountry: e.target.value })} required />
        </Field>
        <Field label="From airport">
          <input className={inputClass} value={form.fromAirport} onChange={(e) => setForm({ ...form, fromAirport: e.target.value })} />
        </Field>
        <Field label="To airport">
          <input className={inputClass} value={form.toAirport} onChange={(e) => setForm({ ...form, toAirport: e.target.value })} />
        </Field>
      </div>
      <Field label="Village / town drops" hint="Comma separated. Example: Qila Didar Singh, Wazirabad">
        <input className={inputClass} value={form.villageStops} onChange={(e) => setForm({ ...form, villageStops: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Depart">
          <input type="date" className={inputClass} value={form.departDate} onChange={(e) => setForm({ ...form, departDate: e.target.value })} />
        </Field>
        <Field label="Arrive">
          <input type="date" className={inputClass} value={form.arriveDate} onChange={(e) => setForm({ ...form, arriveDate: e.target.value })} />
        </Field>
        <Field label="Spare kg">
          <input type="number" min={1} max={15} className={inputClass} value={form.capacityKg} onChange={(e) => setForm({ ...form, capacityKg: Number(e.target.value) })} />
        </Field>
        <Field label="Fee £ / kg">
          <input type="number" min={1} className={inputClass} value={form.feePerKgGbp} onChange={(e) => setForm({ ...form, feePerKgGbp: Number(e.target.value) })} />
        </Field>
      </div>
      <Field label="Ticket / PNR (masked after save)" hint="In production this is a secure upload to Firebase Storage, reviewed before the trip goes live.">
        <input className={inputClass} placeholder="PK304 or booking ref" value={form.flightNoMasked} onChange={(e) => setForm({ ...form, flightNoMasked: e.target.value })} required />
      </Field>
      <Field label="Notes">
        <textarea className={inputClass} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </Field>
      <Button type="submit">Publish verified trip</Button>
    </form>
  );
}
