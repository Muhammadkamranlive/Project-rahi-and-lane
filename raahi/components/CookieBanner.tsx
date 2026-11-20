"use client";

import { useStore } from "@/lib/store";
import { Button, Card } from "./ui";

export function CookieBanner() {
  const { ready, state, setCookieConsent } = useStore();
  if (!ready || state.cookieConsent !== "unknown") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <Card className="mx-auto max-w-lg border border-[var(--line)]">
        <p className="font-serif text-lg">Cookies and data</p>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          Raahi uses essential cookies to keep you signed in and to store KYC, escrow and handover records we must keep under
          AML and customs rules. Analytics cookies are optional. See the{" "}
          <a className="underline" href="/legal/cookies">
            cookie policy
          </a>
          .
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setCookieConsent("essential")}>
            Essential only
          </Button>
          <Button onClick={() => setCookieConsent("all")}>Accept all</Button>
        </div>
      </Card>
    </div>
  );
}
