"use client";

import { Button, Card, Field, inputClass } from "@/components/ui";
import { createEmptyKyc } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { KycDocumentType, KycProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function KycPage() {
  const { me, submitKyc } = useStore();
  const router = useRouter();
  const [profile, setProfile] = useState<KycProfile>(me?.kyc.status === "verified" ? me.kyc : { ...createEmptyKyc(), legalName: me?.displayName || "", countryOfResidence: me?.homeCountry || "", city: me?.homeCity || "" });

  if (!me) return null;

  if (me.kyc.status === "verified") {
    return (
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">Verified</p>
        <h1 className="mt-1 font-serif text-3xl">{me.kyc.legalName}</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {me.kyc.documentType.toUpperCase()} {me.kyc.documentNumberMasked} · {me.kyc.nationality} · AML {me.kyc.amlRisk} risk · selfie and address proof on file.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">In production this is issued by Veriff/Onfido + NADRA Verisys, not a self-declaration.</p>
        <div className="mt-4">
          <Button href="/app">Back home</Button>
        </div>
      </Card>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        submitKyc(profile);
        router.push("/app");
      }}
    >
      <h1 className="font-serif text-4xl">Identity check</h1>
      <p className="text-sm leading-6 text-[var(--muted)]">
        KYC/AML is mandatory before matching. We collect the minimum needed to identify you, screen PEP/sanctions, and keep
        records for 5–7 years where the law requires it.
      </p>
      <Field label="Legal name"><input className={inputClass} value={profile.legalName} onChange={(e) => setProfile({ ...profile, legalName: e.target.value })} required /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Date of birth"><input type="date" className={inputClass} value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} required /></Field>
        <Field label="Nationality"><input className={inputClass} value={profile.nationality} onChange={(e) => setProfile({ ...profile, nationality: e.target.value })} required /></Field>
      </div>
      <Field label="Residential address"><input className={inputClass} value={profile.addressLine} onChange={(e) => setProfile({ ...profile, addressLine: e.target.value })} required /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="City"><input className={inputClass} value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} required /></Field>
        <Field label="Postcode"><input className={inputClass} value={profile.postalCode} onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })} required /></Field>
      </div>
      <Field label="Document">
        <select className={inputClass} value={profile.documentType} onChange={(e) => setProfile({ ...profile, documentType: e.target.value as KycDocumentType })} required>
          <option value="">Choose</option>
          <option value="passport">Passport</option>
          <option value="cnic">Pakistan CNIC / NICOP</option>
          <option value="national_id">Other national ID</option>
          <option value="residence_permit">Residence permit</option>
        </select>
      </Field>
      <Field label="Document number" hint="Stored masked. Original stays in the KYC vendor vault.">
        <input className={inputClass} value={profile.documentNumberMasked} onChange={(e) => setProfile({ ...profile, documentNumberMasked: e.target.value })} required />
      </Field>
      <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
        <input type="checkbox" checked={profile.pepDeclaration} onChange={(e) => setProfile({ ...profile, pepDeclaration: e.target.checked })} required />
        I am not a politically exposed person, or I will declare PEP status to compliance.
      </label>
      <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
        <input type="checkbox" checked={profile.sanctionsDeclaration} onChange={(e) => setProfile({ ...profile, sanctionsDeclaration: e.target.checked })} required />
        I am not on a UK/EU/UN/Pakistan sanctions list.
      </label>
      <p className="text-xs text-[var(--muted)]">Demo auto-verifies. Production should call a KYC API and wait for a webhook before status = verified.</p>
      <Button type="submit">Submit KYC</Button>
    </form>
  );
}
