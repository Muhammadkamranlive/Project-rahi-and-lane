"use client";

import { Button, Card } from "@/components/ui";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function PrivacyCenterPage() {
  const { me, exportMyData, deleteMyAccount, updateConsent } = useStore();
  const router = useRouter();
  if (!me) return null;

  const download = () => {
    const blob = new Blob([exportMyData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raahi-gdpr-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-4xl">Privacy center</h1>
      <p className="text-sm leading-6 text-[var(--muted)]">
        UK GDPR / EU GDPR tools: access, portability, consent, and erasure. AML records may be retained even after erasure
        of the marketing profile.
      </p>
      <Card>
        <p className="font-semibold">Consent</p>
        <p className="text-sm text-[var(--muted)]">Policy {me.consent.version} · accepted {new Date(me.consent.acceptedAt).toLocaleDateString("en-GB")}</p>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={me.consent.marketing} onChange={(e) => updateConsent({ marketing: e.target.checked })} />
          Marketing emails
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={me.consent.profiling} onChange={(e) => updateConsent({ profiling: e.target.checked })} />
          Optional trust profiling beyond security
        </label>
      </Card>
      <Button onClick={download}>Download my data (JSON)</Button>
      <Button
        variant="danger"
        onClick={() => {
          if (confirm("Delete this account from the demo store? Production would queue a legal-hold check first.")) {
            deleteMyAccount();
            router.push("/");
          }
        }}
      >
        Delete account
      </Button>
    </div>
  );
}
