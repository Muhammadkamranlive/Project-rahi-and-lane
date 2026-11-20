"use client";

import { SOLUTIONS } from "@/lib/marketing";
import { useLane } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/coverage", label: "Coverage" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Journal" },
  { href: "/track", label: "Track" }
];

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solutions, setSolutions] = useState(false);
  const lane = useLane();
  const footer = lane.list("settings/content").filter((row) => row.values.menu === "Footer" && row.values.status === "Published");
  useEffect(() => { setOpen(false); setSolutions(false); }, [pathname]);
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="font-serif text-2xl">Lane</Link>
          <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold lg:flex" aria-label="Primary">
            {LINKS.slice(0, 1).map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            <div className="relative">
              <button type="button" className="font-semibold" aria-expanded={solutions} onClick={() => setSolutions((value) => !value)}>Solutions</button>
              {solutions && (
                <ul className="absolute left-0 top-8 w-56 rounded-2xl border border-line bg-white p-2 shadow-xl">
                  {SOLUTIONS.map((item) => (
                    <li key={item.slug}><Link className="block rounded-xl px-3 py-2 hover:bg-paper" href={`/solutions/${item.slug}`}>{item.title}</Link></li>
                  ))}
                </ul>
              )}
            </div>
            {LINKS.slice(1).map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            <Link href="/login">Sign in</Link>
            <Link href="/demo" className="rounded-full bg-ink px-4 py-2 text-paper">Book a demo</Link>
          </nav>
          <button type="button" className="ml-auto rounded-xl border border-line px-3 py-2 text-sm font-semibold lg:hidden" aria-label="Menu" onClick={() => setOpen((value) => !value)}>Menu</button>
        </div>
        {open && (
          <nav className="space-y-2 border-t border-line px-4 py-3 text-sm font-semibold lg:hidden" aria-label="Mobile">
            {LINKS.map((link) => <Link key={link.href} className="block py-1" href={link.href}>{link.label}</Link>)}
            {SOLUTIONS.map((item) => <Link key={item.slug} className="block py-1" href={`/solutions/${item.slug}`}>{item.title}</Link>)}
            <Link className="block py-1" href="/login">Sign in</Link>
            <Link className="block py-1" href="/contact">Contact</Link>
          </nav>
        )}
      </header>
      <div id="content">{children}</div>
      <footer className="mt-16 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-2xl">Lane</p>
            <p className="mt-2 text-sm leading-6 text-muted">The operating desk for companies that move freight and store other people's goods.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Company</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/demo">Book a demo</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Solutions</p>
            <ul className="mt-2 space-y-1 text-sm">
              {SOLUTIONS.slice(0, 4).map((item) => <li key={item.slug}><Link href={`/solutions/${item.slug}`}>{item.title}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Legal</p>
            <ul className="mt-2 space-y-1 text-sm">
              {(footer.length ? footer : [{ id: "p", values: { label: "Privacy", href: "/legal/privacy" } }]).map((row) => (
                <li key={row.id}><Link href={row.values.href}>{row.values.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(localStorage.getItem("lane.cookie") !== "1"); }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-line bg-white p-4 shadow-xl sm:inset-x-auto sm:right-4 sm:max-w-sm">
      <p className="text-sm leading-6">Lane stores a session cookie when you sign in, and remembers this choice on this browser.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper" onClick={() => { localStorage.setItem("lane.cookie", "1"); setShow(false); }}>Accept</button>
        <Link href="/legal/cookies" className="rounded-full px-4 py-2 text-sm font-semibold">Read</Link>
      </div>
    </div>
  );
}
