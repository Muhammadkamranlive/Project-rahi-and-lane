"use client";

import { navEntries } from "@/lib/catalog";
import { MODULES, type ModuleKey, isModule } from "@/lib/model";
import { useLane } from "@/lib/store";
import { cx } from "@/components/ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const TONE: Record<string, string> = {
  dashboard: "#0f6e6a",
  network: "#1d4e89",
  parties: "#7a4e2d",
  catalog: "#5c4d7a",
  bookings: "#0f6e6a",
  rating: "#9a6b12",
  dispatch: "#1d4e89",
  visibility: "#8c3a32",
  fleet: "#3f5c49",
  warehouse: "#6b4f2a",
  forwarding: "#214e6d",
  customs: "#6d3b55",
  documents: "#3d4c63",
  billing: "#0f5c4c",
  service: "#8a4b2f",
  sales: "#1f6b4a",
  reports: "#3e4c7a",
  settings: "#243044"
};

export function Shell({ children, mode }: { children: React.ReactNode; mode: "app" | "portal" }) {
  const lane = useLane();
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [bell, setBell] = useState(false);
  const moduleKey = pathname.split("/")[2] || "";
  const active = isModule(moduleKey) ? moduleKey : "dashboard";

  useEffect(() => {
    setCollapsed(localStorage.getItem("lane.nav.collapsed") === "1");
  }, []);

  useEffect(() => {
    if (!lane.ready) return;
    if (!lane.session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (lane.account?.mfa && !lane.session.mfaOk) router.replace("/mfa");
  }, [lane.ready, lane.session, lane.account, pathname, router]);

  useEffect(() => {
    if (!lane.session) return;
    const minutes = Number(lane.system().idleMinutes || 30);
    let timer = window.setTimeout(() => lane.logout(), Math.max(1, minutes) * 60 * 1000);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => lane.logout(), Math.max(1, minutes) * 60 * 1000);
    };
    window.addEventListener("pointerdown", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", reset);
    };
  }, [lane, lane.session, lane.tenantId]);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);

  const links = useMemo(() => {
    if (!isModule(active)) return [];
    return navEntries(active).filter((link) => lane.rightsFor(link.screenKey).view || link.screenKey.endsWith("/overview"));
  }, [active, lane]);

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return MODULES.flatMap((mod) =>
      lane.canModule(mod.key)
        ? navEntries(mod.key)
            .filter((link) => lane.rightsFor(link.screenKey).view && link.label.toLowerCase().includes(q))
            .map((link) => ({ ...link, module: mod.label }))
        : []
    ).slice(0, 8);
  }, [query, lane]);

  const unread = lane.notices.filter((item) => !item.read).length;
  const groups = links.reduce<{ group: string; items: typeof links }[]>((acc, link) => {
    const found = acc.find((item) => item.group === link.group);
    if (found) found.items.push(link);
    else acc.push({ group: link.group, items: [link] });
    return acc;
  }, []);

  if (!lane.ready || !lane.session) {
    return <div className="grid min-h-dvh place-items-center text-sm text-muted">Opening the desk…</div>;
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="no-print sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-white/10 bg-[#0e1c2c] px-3 text-white lg:px-4">
        <button type="button" className="grid size-10 place-items-center rounded-xl hover:bg-white/10 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
          <MenuIcon />
        </button>
        <Link href="/apps" className="font-serif text-xl tracking-tight">Lane</Link>
        <label className="relative ml-2 hidden min-w-0 flex-1 md:block">
          <span className="sr-only">Search menus</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menus" className="h-10 w-full max-w-md rounded-xl border border-white/10 bg-white/10 px-3 text-sm outline-none placeholder:text-white/50" />
          {hits.length > 0 && (
            <ul className="absolute top-12 z-20 w-full max-w-md overflow-hidden rounded-2xl bg-white text-ink shadow-xl">
              {hits.map((hit) => (
                <li key={hit.href}>
                  <Link href={hit.href} className="block px-3 py-2 text-sm hover:bg-paper">
                    <span className="text-xs uppercase tracking-wide text-muted">{hit.module}</span>
                    <span className="block font-semibold">{hit.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </label>
        <select
          aria-label="Company"
          value={lane.tenantId}
          onChange={(event) => lane.switchTenant(event.target.value)}
          className="ml-auto h-10 max-w-[10rem] rounded-xl border border-white/10 bg-white/10 px-2 text-sm md:max-w-none"
        >
          {lane.tenants().map((tenant) => (
            <option key={tenant.id} value={tenant.values.code}>{tenant.values.name}</option>
          ))}
        </select>
        <div className="relative">
          <button type="button" className="grid size-10 place-items-center rounded-xl hover:bg-white/10" aria-label="Notifications" onClick={() => setBell((value) => !value)}>
            <BellIcon />
            {unread > 0 && <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-amber-400 text-[10px] font-bold text-ink">{unread}</span>}
          </button>
          {bell && (
            <div className="absolute right-0 top-12 z-20 w-80 rounded-2xl bg-white p-3 text-ink shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <button type="button" className="text-xs font-semibold text-sea" onClick={() => lane.markAllRead()}>Mark read</button>
              </div>
              <ul className="max-h-80 space-y-2 overflow-auto">
                {lane.notices.slice(0, 8).map((notice) => (
                  <li key={notice.id}>
                    <Link href={notice.href} onClick={() => lane.markRead(notice.id)} className={cx("block rounded-xl px-2 py-2 text-sm", !notice.read && "bg-sand/50")}>
                      <span className="font-semibold">{notice.title}</span>
                      <span className="block text-xs text-muted">{notice.body}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Link href="/console/dashboard/profile" className="hidden text-sm font-semibold sm:inline">{lane.account?.name}</Link>
        <button type="button" className="rounded-xl px-2 py-2 text-sm hover:bg-white/10" onClick={() => { lane.logout(); router.replace("/login"); }}>Sign out</button>
      </header>

      <div className="flex">
        {mode === "app" && (
          <>
            <button type="button" className={cx("no-print fixed inset-0 z-40 bg-ink/40 lg:hidden", open ? "block" : "hidden")} aria-label="Close menu" onClick={() => setOpen(false)} />
            <aside className={cx("no-print fixed inset-y-14 z-40 flex flex-col bg-[#0e1c2c] text-white transition lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:translate-x-0", collapsed ? "w-[4.5rem]" : "w-72", open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
              <div className={cx("flex items-center gap-2 border-b border-white/10 px-3 py-3", collapsed && "justify-center")}>
                <Link href="/apps" title="All apps" className="grid size-10 place-items-center rounded-xl bg-white/10">▦</Link>
                {!collapsed && <span className="text-sm font-semibold">All apps</span>}
                <button
                  type="button"
                  className="ml-auto hidden size-10 place-items-center rounded-xl hover:bg-white/10 lg:grid"
                  aria-label={collapsed ? "Expand menu" : "Collapse menu"}
                  onClick={() => {
                    const next = !collapsed;
                    setCollapsed(next);
                    localStorage.setItem("lane.nav.collapsed", next ? "1" : "0");
                  }}
                >
                  {collapsed ? "›" : "‹"}
                </button>
              </div>
              <div className={cx("px-3 py-3", collapsed && "px-2")}>
                <Link href={`/console/${active}`} className={cx("flex items-center gap-3 rounded-2xl bg-white px-2 py-2 text-ink", collapsed && "justify-center px-0")} title={MODULES.find((item) => item.key === active)?.label}>
                  <span className="grid size-10 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: TONE[active] }}>{MODULES.find((item) => item.key === active)?.label.slice(0, 1)}</span>
                  {!collapsed && (
                    <span>
                      <span className="block text-sm font-semibold">{MODULES.find((item) => item.key === active)?.label}</span>
                      <span className="block text-xs text-muted">This module</span>
                    </span>
                  )}
                </Link>
              </div>
              <nav aria-label="Module menu" className="flex-1 overflow-y-auto px-2 pb-6">
                {groups.map((group) => (
                  <div key={group.group} className="mt-3">
                    {!collapsed && <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{group.group}</p>}
                    <ul className="mt-1 space-y-1">
                      {group.items.map((link) => {
                        const on = pathname === link.href;
                        return (
                          <li key={link.href}>
                            <Link href={link.href} title={link.label} className={cx("flex min-h-10 items-center rounded-xl px-2 text-sm", on ? "bg-white text-ink" : "text-white/80 hover:bg-white/10", collapsed && "justify-center")}>
                              {collapsed ? link.label.slice(0, 1) : link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>
          </>
        )}
        <main id="content" className="min-w-0 flex-1 px-4 py-5 lg:px-8 lg:py-7">{children}</main>
      </div>
    </div>
  );
}

export function AppsGrid() {
  const lane = useLane();
  const visible = MODULES.filter((mod) => lane.canModule(mod.key));
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">Workspace</p>
      <h1 className="mt-2 font-serif text-4xl">All apps</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Signed in as {lane.account?.name}, {lane.roleLabel(lane.account?.role || "")}. Menus you cannot use are not shown.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((mod) => (
          <li key={mod.key}>
            <Link href={`/console/${mod.key}`} className="flex h-full gap-3 rounded-3xl border border-line bg-white p-4 hover:border-sea">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white" style={{ background: TONE[mod.key as ModuleKey] }}>{mod.label.slice(0, 1)}</span>
              <span>
                <span className="block font-semibold">{mod.label}</span>
                <span className="mt-1 block text-sm leading-5 text-muted">{mod.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}
