"use client";

import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { me, ready } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !me) router.replace("/login");
  }, [ready, me, router]);

  if (!ready || !me) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--cream)] text-sm text-[var(--muted)]">
        Opening Raahi…
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
