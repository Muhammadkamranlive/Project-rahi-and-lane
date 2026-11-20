import { LegalShell } from "@/components/LegalShell";

export default function GdprPage() {
  return (
    <LegalShell title="GDPR and UK GDPR controls">
      <p>
        Raahi is built for a UK–Pakistan corridor, so UK GDPR applies to UK users and EU GDPR to EEA users. Pakistan
        Personal Data Protection legislation should be mapped before a Karachi or Lahore entity goes live.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Consent capture at account creation and cookie banner.</li>
        <li>Data minimisation: document numbers stored masked in the app layer.</li>
        <li>Access and portability: JSON export in Privacy Center (Articles 15 and 20).</li>
        <li>Erasure: account deletion with AML retention exceptions (Article 17).</li>
        <li>Purpose limitation: KYC images are not used for marketing.</li>
        <li>Security: Firebase Auth, Firestore rules, Storage rules, and escrow with a licensed partner in production.</li>
      </ul>
    </LegalShell>
  );
}
