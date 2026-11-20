import { LegalShell } from "@/components/LegalShell";

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy notice">
      <p>Controller: Raahi (demo). For a live launch, name the UK/EU legal entity and Pakistan local representative.</p>
      <h2 className="font-serif text-2xl">What we process</h2>
      <p>
        Account data, KYC documents, liveness images, trip and parcel listings, chat, escrow references, OTP handover logs,
        and device data needed to secure the service.
      </p>
      <h2 className="font-serif text-2xl">Lawful bases (UK GDPR / EU GDPR)</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Contract — matching, messaging, consignment, delivery confirmation.</li>
        <li>Legal obligation — AML/KYC record keeping, tax, customs cooperation, fraud.</li>
        <li>Consent — marketing, non-essential cookies, optional profiling.</li>
        <li>Legitimate interests — platform security, abuse detection, limited trust scoring.</li>
      </ul>
      <h2 className="font-serif text-2xl">Special category / biometric</h2>
      <p>
        Liveness selfies may be biometric data. They are processed only for identity verification, stored encrypted, and
        deleted on the retention schedule unless a legal hold applies.
      </p>
      <h2 className="font-serif text-2xl">Retention</h2>
      <p>
        KYC and transaction records: up to 5–7 years where AML rules require. Chat and listings: for the life of the
        account plus a short wind-down. You can export or erase account data from Privacy Center, except records we must
        keep by law.
      </p>
      <h2 className="font-serif text-2xl">International transfers</h2>
      <p>
        Pakistan–UK corridors inherently involve cross-border data. Use SCCs or UK IDTA with Firebase/Google Cloud and any
        KYC vendor, plus a transfer assessment.
      </p>
      <p>
        Rights: access, rectification, erasure, restriction, portability, objection, and complaint to the ICO (UK) or your
        EEA DPA. Use <a className="underline" href="/app/me/privacy">Privacy Center</a>.
      </p>
    </LegalShell>
  );
}
