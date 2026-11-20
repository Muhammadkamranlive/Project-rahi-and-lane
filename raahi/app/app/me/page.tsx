"use client";

import { Avatar, Badge, Button, Card } from "@/components/ui";
import { firebaseConfigured } from "@/lib/firebase";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function MePage() {
  const { me, logout } = useStore();
  const router = useRouter();
  if (!me) return null;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={me.displayName} size="lg" />
          <div>
            <h1 className="font-serif text-3xl">{me.displayName}</h1>
            <p className="text-sm text-[var(--muted)]">{me.homeCity}, {me.homeCountry}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          <Badge tone={me.kyc.status === "verified" ? "ok" : "gold"}>{me.kyc.status === "verified" ? "KYC verified" : "KYC needed"}</Badge>
          <Badge>Trust {me.trustScore}</Badge>
          <Badge tone="sage">{me.completedDeliveries} carries</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{me.bio || "Add a short bio after KYC so families know who is coming to the village."}</p>
      </Card>
      <Button href="/app/kyc" variant="ghost">Identity & AML</Button>
      <Button href="/app/me/privacy" variant="ghost">GDPR privacy center</Button>
      <Button href="/legal/trust" variant="ghost">Legal trust model</Button>
      <Card>
        <p className="text-xs uppercase tracking-wide text-[var(--gold)]">Backend</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {firebaseConfigured
            ? "Firebase keys detected. Wire Auth/Firestore in production."
            : "Running in secure demo mode (local device). Add Firebase keys in .env.local to go live."}
        </p>
      </Card>
      <Button
        variant="secondary"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
