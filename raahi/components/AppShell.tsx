"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Plane, ShieldCheck, UserRound } from "lucide-react";
import { Brand } from "./ui";

const tabs = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/trips", label: "Travelers", icon: Plane },
  { href: "/app/send", label: "Send", icon: Package },
  { href: "/app/activity", label: "Jobs", icon: ShieldCheck },
  { href: "/app/me", label: "Me", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[#132018] md:flex md:items-center md:justify-center md:py-6">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[var(--cream)] md:min-h-[860px] md:max-h-[860px] md:overflow-hidden md:rounded-[2.4rem] md:border-[8px] md:border-[#0c1610] md:shadow-[0_40px_80px_rgba(0,0,0,.35)]">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-[var(--cream)]/95 px-4 py-3 backdrop-blur">
          <Brand compact={false} />
          <Link href="/legal/trust" className="text-[11px] font-semibold uppercase tracking-wide text-[var(--gold)]">
            Trust
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto px-4 pb-28 pt-1">{children}</main>
        <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-[var(--line)] bg-white/95 px-2 py-2 backdrop-blur md:rounded-b-[1.9rem]">
          <ul className="grid grid-cols-5">
            {tabs.map((tab) => {
              const active = tab.href === "/app" ? pathname === "/app" : pathname.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-semibold ${
                      active ? "text-[var(--green)]" : "text-[var(--muted)]"
                    }`}
                  >
                    <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
