"use client";

import { Brand, Button, Card, Field, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { DEMO_SENDER_ID, DEMO_TRAVELER_ID } from "@/lib/seed";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login, register } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    role: "sender" as "sender" | "traveler" | "both",
    homeCity: "",
    homeCountry: "United Kingdom",
    accept: false,
  });

  const enter = (id: string) => {
    login(id);
    router.push("/app");
  };

  return (
    <div className="min-h-dvh bg-[var(--cream)] px-4 py-8">
      <div className="mx-auto max-w-md space-y-5">
        <Brand />
        <div>
          <h1 className="font-serif text-4xl">Enter Raahi</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Demo accounts are fully KYC-verified so you can walk the escrow and village-handover flow immediately.
          </p>
        </div>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">One-tap demo</p>
          <div className="mt-3 space-y-2">
            <Button onClick={() => enter(DEMO_SENDER_ID)}>Continue as Ayesha · sender in London</Button>
            <Button variant="secondary" onClick={() => enter(DEMO_TRAVELER_ID)}>
              Continue as Bilal · traveler to Gujranwala
            </Button>
          </div>
        </Card>

        <Card>
          <p className="font-serif text-2xl">Create an account</p>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.accept) return;
              register(form);
              router.push("/app/kyc");
            }}
          >
            <Field label="Full name">
              <input className={inputClass} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required />
            </Field>
            <Field label="Email">
              <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label="I mostly want to">
              <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as typeof form.role })}>
                <option value="sender">Send parcels</option>
                <option value="traveler">Carry as a traveler</option>
                <option value="both">Both</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="City">
                <input className={inputClass} value={form.homeCity} onChange={(e) => setForm({ ...form, homeCity: e.target.value })} required />
              </Field>
              <Field label="Country">
                <select className={inputClass} value={form.homeCountry} onChange={(e) => setForm({ ...form, homeCountry: e.target.value })}>
                  <option>United Kingdom</option>
                  <option>Pakistan</option>
                  <option>Canada</option>
                  <option>United Arab Emirates</option>
                  <option>United States</option>
                </select>
              </Field>
            </div>
            <label className="flex items-start gap-2 text-sm leading-5 text-[var(--muted)]">
              <input type="checkbox" className="mt-1" checked={form.accept} onChange={(e) => setForm({ ...form, accept: e.target.checked })} />
              I am 18+, I accept the terms, privacy notice and KYC/AML checks, and I will only move personal/gift items that can legally travel as accompanying baggage.
            </label>
            <Button type="submit" disabled={!form.accept || !form.displayName || !form.email}>
              Create account and start KYC
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
