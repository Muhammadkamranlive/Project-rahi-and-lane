"use client";

import { Button, Card, Field, inputClass } from "@/components/ui";
import { screenItem } from "@/lib/compliance";
import { categoryLabel, useStore } from "@/lib/store";
import type { ItemCategory, ParcelItem } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const emptyItem = (): ParcelItem => ({
  name: "",
  category: "gift",
  qty: 1,
  weightKg: 1,
  declaredValueGbp: 40,
});

export default function SendPage() {
  const { me, createParcel, state } = useStore();
  const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    originCity: me?.homeCity || "London",
    originCountry: me?.homeCountry || "United Kingdom",
    destCity: "Gujranwala",
    destCountry: "Pakistan",
    destVillage: "",
    recipientName: "",
    recipientPhoneMasked: "",
    preferredFrom: "2026-09-15",
    preferredTo: "2026-10-15",
    notes: "",
    isGift: true,
    personalUseOnly: true,
    customsReady: true,
    items: [emptyItem()],
  });

  const screening = useMemo(() => form.items.map((item) => screenItem(item.name, item.category, item.declaredValueGbp, item.qty)), [form.items]);

  const myParcels = state.parcels.filter((parcel) => parcel.senderId === me?.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-4xl">Send with a traveler</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Describe the gift honestly. The app blocks courier-like cargo before anyone is put at risk.</p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const result = createParcel(form);
          if (result.error) setError(result.error);
          else router.push("/app/trips");
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Field label="From city"><input className={inputClass} value={form.originCity} onChange={(e) => setForm({ ...form, originCity: e.target.value })} required /></Field>
          <Field label="From country"><input className={inputClass} value={form.originCountry} onChange={(e) => setForm({ ...form, originCountry: e.target.value })} required /></Field>
          <Field label="To city"><input className={inputClass} value={form.destCity} onChange={(e) => setForm({ ...form, destCity: e.target.value })} required /></Field>
          <Field label="Village / mohalla"><input className={inputClass} placeholder="Qila Didar Singh" value={form.destVillage} onChange={(e) => setForm({ ...form, destVillage: e.target.value })} required /></Field>
        </div>
        <Field label="Recipient legal name">
          <input className={inputClass} value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} required />
        </Field>
        <Field label="Recipient phone" hint="Masked until escrow is funded.">
          <input className={inputClass} value={form.recipientPhoneMasked} onChange={(e) => setForm({ ...form, recipientPhoneMasked: e.target.value })} required />
        </Field>

        {form.items.map((item, index) => (
          <Card key={index}>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">Item {index + 1}</p>
            <div className="mt-2 space-y-2">
              <input className={inputClass} placeholder="What is it?" value={item.name} onChange={(e) => {
                const items = [...form.items];
                items[index] = { ...item, name: e.target.value };
                setForm({ ...form, items });
              }} required />
              <div className="grid grid-cols-2 gap-2">
                <select className={inputClass} value={item.category} onChange={(e) => {
                  const items = [...form.items];
                  items[index] = { ...item, category: e.target.value as ItemCategory };
                  setForm({ ...form, items });
                }}>
                  {(["gift", "clothes", "documents", "electronics", "food_dry", "medicine_otc", "other"] as ItemCategory[]).map((category) => (
                    <option key={category} value={category}>{categoryLabel(category)}</option>
                  ))}
                </select>
                <input className={inputClass} placeholder="IMEI / serial" value={item.serialOrImei || ""} onChange={(e) => {
                  const items = [...form.items];
                  items[index] = { ...item, serialOrImei: e.target.value };
                  setForm({ ...form, items });
                }} />
                <input type="number" step="0.1" className={inputClass} value={item.weightKg} onChange={(e) => {
                  const items = [...form.items];
                  items[index] = { ...item, weightKg: Number(e.target.value) };
                  setForm({ ...form, items });
                }} />
                <input type="number" className={inputClass} value={item.declaredValueGbp} onChange={(e) => {
                  const items = [...form.items];
                  items[index] = { ...item, declaredValueGbp: Number(e.target.value) };
                  setForm({ ...form, items });
                }} />
              </div>
              {screening[index] && item.name && (
                <p className={`text-xs leading-5 ${screening[index].level === "block" ? "text-[#9b2c1f]" : screening[index].level === "warn" ? "text-[var(--gold)]" : "text-[var(--green)]"}`}>
                  {screening[index].title} {screening[index].detail}
                </p>
              )}
            </div>
          </Card>
        ))}
        <button type="button" className="text-sm font-semibold text-[var(--green)]" onClick={() => setForm({ ...form, items: [...form.items, emptyItem()] })}>
          + Add another item
        </button>

        <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={form.isGift} onChange={(e) => setForm({ ...form, isGift: e.target.checked })} />
          These are personal gifts / used belongings, not for resale.
        </label>
        <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={form.customsReady} onChange={(e) => setForm({ ...form, customsReady: e.target.checked })} />
          I warrant the description and value are true and I will pay any duty or PTA charges.
        </label>
        {error && <p className="text-sm text-[#9b2c1f]">{error}</p>}
        <Button type="submit">Save parcel and find travelers</Button>
      </form>

      {myParcels.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-serif text-2xl">Your listings</h2>
          {myParcels.map((parcel) => (
            <Card key={parcel.id}>
              <p className="font-semibold">{parcel.destVillage}, {parcel.destCity}</p>
              <p className="text-sm text-[var(--muted)]">{parcel.items.map((item) => item.name).join(" · ")}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
