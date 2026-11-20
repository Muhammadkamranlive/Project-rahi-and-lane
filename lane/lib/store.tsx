"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SCREENS } from "@/lib/catalog";
import {
  ACCOUNTS,
  DEMO_MFA,
  DEMO_PASSWORD,
  INVITE_TOKEN,
  MODULE_KEYS,
  ROLE_BLURBS,
  ROLE_LABELS,
  defaultRights,
  emptyRights,
  homeFor,
  modulesForRole,
  roleLabel,
  type Account,
  type Field,
  type ModuleKey,
  type Right,
  type Rights
} from "@/lib/model";

const STORAGE = "lane.db.v1";

export type Entity = {
  id: string;
  screen: string;
  tenantId: string;
  values: Record<string, string>;
  notes: string;
  attachment: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditRow = {
  id: string;
  tenantId: string;
  at: string;
  actor: string;
  action: string;
  screen: string;
  record: string;
  detail: string;
};

export type Notice = {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href: string;
};

export type Rule = {
  id: string;
  tenantId: string;
  module: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
};

export type Session = { email: string; mfaOk: boolean; tenantId: string };

type Db = {
  entities: Entity[];
  audit: AuditRow[];
  notices: Notice[];
  rules: Rule[];
  accounts: Account[];
  acl: Record<string, Record<string, Rights>>;
  session: Session | null;
};

const PUBLIC_WRITE = new Set(["bookings/quotes", "sales/leads"]);
const BUILTIN_ROLES = new Set(Object.keys(ROLE_LABELS));

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

function now() {
  return new Date().toISOString();
}

function clean(values: Record<string, string>) {
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (key !== "_tenant") next[key] = value ?? "";
  }
  return next;
}

function entity(screen: string, values: Record<string, string>, index: number): Entity {
  const tenantId = values._tenant || "alpha";
  return {
    id: `${screen.replace("/", "-")}-${index}`,
    screen,
    tenantId,
    values: clean(values),
    notes: "",
    attachment: "",
    deletedAt: "",
    createdAt: "2026-09-12T08:00:00.000Z",
    updatedAt: "2026-09-26T08:00:00.000Z"
  };
}

export function initialDb(): Db {
  const entities: Entity[] = [];
  SCREENS.forEach((def) => {
    (def.rows ?? []).forEach((row, index) => {
      entities.push(entity(`${def.module}/${def.slug}`, row, index + 1));
    });
  });
  ACCOUNTS.forEach((account, index) => {
    entities.push(
      entity(
        "settings/users",
        {
          name: account.name,
          email: account.email,
          role: account.role,
          title: account.title,
          branch: account.branch,
          mfa: account.mfa ? "Yes" : "No",
          status: account.status,
          _tenant: account.tenantId
        },
        100 + index
      )
    );
  });
  Object.entries(ROLE_LABELS).forEach(([key, label], index) => {
    entities.push(
      entity(
        "settings/roles",
        {
          key,
          label,
          description: ROLE_BLURBS[key] || "",
          modules: modulesForRole(key).join(", "),
          status: "Active"
        },
        index + 1
      )
    );
  });
  entities.push(
    entity(
      "visibility/pod",
      {
        waybill: "LN-09901",
        receiver: "Northline Karachi DC",
        otp: "4412",
        barcode: "LN09901001",
        lat: "24.86",
        lng: "67.03",
        at: "2026-09-22 16:40",
        note: "Received at dock 2.",
        photo: "dock-2.jpg",
        signature: "Signed"
      },
      1
    )
  );
  entities.push(
    entity("parties/vendors", { name: "Old tyre yard", category: "Parts", city: "Karachi", status: "Inactive" }, 9)
  );
  const sample = entities.find((item) => item.values.name === "Old tyre yard");
  if (sample) sample.deletedAt = "2026-09-21T10:00:00.000Z";

  return {
    entities,
    accounts: ACCOUNTS.map((account) => ({ ...account })),
    acl: {},
    session: null,
    rules: [
      { id: "rule-late", tenantId: "alpha", module: "visibility", name: "Late shipment", trigger: "Shipment status becomes Late", condition: "status is Late", action: "Notify dispatcher and the customer", enabled: true },
      { id: "rule-invoice", tenantId: "alpha", module: "billing", name: "Invoice issued", trigger: "Invoice approved", condition: "status is Issued", action: "Email the bill-to contact", enabled: true },
      { id: "rule-tender", tenantId: "alpha", module: "dispatch", name: "Tender expired", trigger: "Tender passes expiry", condition: "status is Expired", action: "Retender to the next carrier", enabled: false }
    ],
    notices: [
      { id: "n1", tenantId: "alpha", title: "LN-10021 is late", body: "No hub-in scan at Korangi after the promise.", at: "2026-09-28T09:00:00.000Z", read: false, href: "/console/visibility/tower" },
      { id: "n2", tenantId: "alpha", title: "Claim CLM-104 is open", body: "Damage photos are on the crushed carton.", at: "2026-09-25T18:00:00.000Z", read: false, href: "/console/service/claims" },
      { id: "n3", tenantId: "alpha", title: "Invoice INV-24091", body: "Issued to Northline Retail.", at: "2026-09-26T11:00:00.000Z", read: true, href: "/console/billing/invoices" }
    ],
    audit: [
      { id: "a1", tenantId: "alpha", at: "2026-09-26T11:12:00.000Z", actor: "Mariam Ali", action: "Issued", screen: "billing/invoices", record: "INV-24091", detail: "Customer invoice for LN-10021." },
      { id: "a2", tenantId: "alpha", at: "2026-09-28T09:05:00.000Z", actor: "Nadia Rahman", action: "Flagged", screen: "visibility/exceptions", record: "LN-10021", detail: "Missing scan opened on the tower." },
      { id: "a3", tenantId: "alpha", at: "2026-09-20T16:10:00.000Z", actor: "Amina Shah", action: "Held", screen: "customs/entries", record: "ENT-2408", detail: "Licence missing on LF-2408." }
    ]
  };
}

function writeCookie(email: string | null) {
  if (typeof document === "undefined") return;
  document.cookie = email
    ? `lane_session=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 12}; samesite=lax`
    : "lane_session=; path=/; max-age=0; samesite=lax";
}

function stamp(db: Db, partial: Omit<AuditRow, "id" | "at">) {
  db.audit.unshift({ ...partial, id: uid("aud"), at: now() });
}

function syncAccount(db: Db, row: Entity) {
  if (row.screen !== "settings/users") return;
  const email = row.values.email;
  if (!email) return;
  let account = db.accounts.find((item) => item.email === email);
  if (!account) {
    account = {
      email,
      password: DEMO_PASSWORD,
      name: row.values.name || email,
      role: row.values.role || "viewer",
      title: row.values.title || "",
      status: (row.values.status as Account["status"]) || "active",
      mfa: row.values.mfa === "Yes",
      tenantId: row.tenantId,
      branch: row.values.branch || ""
    };
    db.accounts.push(account);
  }
  account.name = row.values.name || account.name;
  account.role = row.values.role || account.role;
  account.title = row.values.title || account.title;
  account.branch = row.values.branch || account.branch;
  account.mfa = row.values.mfa === "Yes";
  account.status = row.deletedAt ? "blocked" : ((row.values.status as Account["status"]) || account.status);
}

function roleModules(db: Db, role: string) {
  const row = db.entities.find((item) => item.screen === "settings/roles" && !item.deletedAt && item.values.key === role);
  return row?.values.modules;
}

export type StoreApi = ReturnType<typeof useStoreValue>;

function useStoreValue() {
  const [db, setDb] = useState<Db>(initialDb);
  const [ready, setReady] = useState(false);
  const dbRef = useRef(db);
  dbRef.current = db;

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Db;
        if (parsed.entities && parsed.accounts) setDb(parsed);
      } catch {
        setDb(initialDb());
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(db));
    writeCookie(db.session?.email ?? null);
  }, [db, ready]);

  return useMemo(() => {
    const session = db.session;
    const account = db.accounts.find((item) => item.email === session?.email) ?? null;
    const tenantId = session?.tenantId || account?.tenantId || "alpha";

    function mutate(recipe: (draft: Db) => void) {
      const draft: Db = structuredClone(dbRef.current);
      recipe(draft);
      dbRef.current = draft;
      setDb(draft);
    }

    function actor() {
      return account?.name || "Website";
    }

    function rightsFor(screen: string, role = account?.role || ""): Rights {
      if (!role) return emptyRights();
      const [mod, slug] = screen.split("/");
      if (slug === "overview" || slug === "guide" || slug === "compose" || slug === "automations") {
        const base = defaultRights(role, `${mod}/overview`, roleModules(db, role));
        if (modulesForRole(role, roleModules(db, role)).includes(mod as ModuleKey) || base.view) {
          const utility = defaultRights(role, screen, roleModules(db, role));
          if (!utility.view && modulesForRole(role, roleModules(db, role)).includes(mod as ModuleKey)) {
            return { view: true, create: role !== "viewer", update: role !== "viewer", delete: false, export: true, approve: false };
          }
        }
      }
      return db.acl[role]?.[screen] ?? defaultRights(role, screen, roleModules(db, role));
    }

    function canModule(key: string) {
      if (!account) return false;
      return modulesForRole(account.role, roleModules(db, account.role)).includes(key as ModuleKey);
    }

    function inTenant(row: Entity, screen?: string) {
      if (screen === "settings/tenants" && account?.role === "super_admin") return true;
      return row.tenantId === tenantId;
    }

    function list(screen: string, includeDeleted = false) {
      const shared = screen.startsWith("catalog/") || screen === "settings/roles" || screen === "settings/email-templates" || screen === "settings/packages";
      return db.entities.filter((row) => {
        if (row.screen !== screen || (!includeDeleted && row.deletedAt)) return false;
        if (shared) return row.tenantId === tenantId || row.tenantId === "alpha";
        return inTenant(row, screen);
      });
    }

    function system() {
      return list("settings/system")[0]?.values ?? {
        legalName: "Lane",
        logoText: "Lane",
        timezone: "Asia/Karachi",
        currency: "PKR",
        taxPct: "18",
        units: "Metric",
        waybillPrefix: "LN-",
        language: "English",
        idleMinutes: "30",
        dimParcel: "5000"
      };
    }

    function nextWaybill() {
      const prefix = system().waybillPrefix || "LN-";
      const numbers = dbRef.current.entities
        .filter((row) => row.screen === "bookings/shipments" && row.tenantId === tenantId)
        .map((row) => Number(String(row.values.waybill || "").replace(/\D/g, "")))
        .filter((value) => Number.isFinite(value));
      const next = Math.max(10050, ...numbers) + 1;
      return `${prefix}${next}`;
    }

    function create(screen: string, values: Record<string, string>, notes = "", attachment = "", force = false) {
      const allowed = force || (session ? rightsFor(screen).create : PUBLIC_WRITE.has(screen));
      if (!allowed) return null;
      const rowValues = { ...values };
      if (screen === "bookings/shipments" && !rowValues.waybill) rowValues.waybill = nextWaybill();
      const row: Entity = {
        id: uid("rec"),
        screen,
        tenantId: session?.tenantId || "alpha",
        values: rowValues,
        notes,
        attachment,
        deletedAt: "",
        createdAt: now(),
        updatedAt: now()
      };
      mutate((draft) => {
        draft.entities.unshift(row);
        syncAccount(draft, row);
        stamp(draft, { tenantId: row.tenantId, actor: actor(), action: "Created", screen, record: labelOf(row), detail: notes || "Record created." });
      });
      return row;
    }

    function update(id: string, values: Record<string, string>, notes?: string, attachment?: string) {
      mutate((draft) => {
        const row = draft.entities.find((item) => item.id === id);
        if (!row) return;
        row.values = { ...row.values, ...values };
        if (notes !== undefined) row.notes = notes;
        if (attachment !== undefined) row.attachment = attachment;
        row.updatedAt = now();
        syncAccount(draft, row);
        if (draft.session && row.screen === "settings/users" && row.values.email === draft.session.email) {
          const accountRow = draft.accounts.find((item) => item.email === row.values.email);
          if (accountRow && values.role) draft.session.tenantId = accountRow.tenantId;
        }
        stamp(draft, { tenantId: row.tenantId, actor: actor(), action: "Updated", screen: row.screen, record: labelOf(row), detail: "Fields saved." });
      });
    }

    function trash(id: string) {
      mutate((draft) => {
        const row = draft.entities.find((item) => item.id === id);
        if (!row) return;
        if (row.screen === "settings/roles" && BUILTIN_ROLES.has(row.values.key)) return;
        row.deletedAt = now();
        syncAccount(draft, row);
        stamp(draft, { tenantId: row.tenantId, actor: actor(), action: "Trashed", screen: row.screen, record: labelOf(row), detail: "Moved to the recycle bin." });
      });
    }

    function restore(id: string) {
      mutate((draft) => {
        const row = draft.entities.find((item) => item.id === id);
        if (!row) return;
        row.deletedAt = "";
        if (row.screen === "settings/users") row.values.status = "active";
        syncAccount(draft, row);
        stamp(draft, { tenantId: row.tenantId, actor: actor(), action: "Restored", screen: row.screen, record: labelOf(row), detail: "Restored from the recycle bin." });
      });
    }

    function purge(id: string) {
      mutate((draft) => {
        const row = draft.entities.find((item) => item.id === id);
        draft.entities = draft.entities.filter((item) => item.id !== id);
        if (row) stamp(draft, { tenantId: row.tenantId, actor: actor(), action: "Deleted", screen: row.screen, record: labelOf(row), detail: "Removed from the recycle bin." });
      });
    }

    function approve(id: string) {
      mutate((draft) => {
        const row = draft.entities.find((item) => item.id === id);
        if (!row) return;
        const current = row.values.status || "";
        const nextStatus =
          current === "Offered" ? "Accepted" : current === "Requested" ? "Issued" : current === "Draft" ? "Issued" : current === "Open" ? "Approved" : "Approved";
        row.values.status = nextStatus;
        row.updatedAt = now();
        stamp(draft, { tenantId: row.tenantId, actor: actor(), action: "Approved", screen: row.screen, record: labelOf(row), detail: `Status set to ${nextStatus}.` });
        draft.notices.unshift({
          id: uid("nt"),
          tenantId: row.tenantId,
          title: `${labelOf(row)} ${nextStatus.toLowerCase()}`,
          body: "An approver moved this record forward.",
          at: now(),
          read: false,
          href: `/console/${row.screen}`
        });
      });
    }

    function login(email: string, password: string) {
      const match = db.accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
      if (!match || match.password !== password) return { ok: false as const, error: "Those details do not match an active account." };
      if (match.status === "blocked") return { ok: false as const, error: "This account is blocked. Ask an administrator." };
      const next: Session = { email: match.email, mfaOk: !match.mfa, tenantId: match.tenantId };
      mutate((draft) => {
        draft.session = next;
        stamp(draft, { tenantId: match.tenantId, actor: match.name, action: "Signed in", screen: "auth", record: match.email, detail: match.mfa ? "Password accepted. MFA still required." : "Signed in." });
      });
      writeCookie(match.email);
      return { ok: true as const, mfa: match.mfa, href: match.mfa ? "/mfa" : homeFor(match.role) };
    }

    function confirmMfa(code: string) {
      if (code.trim() !== DEMO_MFA || !db.session) return false;
      mutate((draft) => {
        if (draft.session) draft.session.mfaOk = true;
      });
      return true;
    }

    function logout() {
      writeCookie(null);
      mutate((draft) => {
        draft.session = null;
      });
    }

    function switchTenant(nextTenant: string) {
      if (!account) return;
      const allowed = account.role === "super_admin" || account.tenantId === nextTenant;
      if (!allowed) return;
      mutate((draft) => {
        if (draft.session) draft.session.tenantId = nextTenant;
      });
    }

    function tenants() {
      const rows = db.entities.filter((row) => row.screen === "settings/tenants" && !row.deletedAt);
      if (account?.role === "super_admin") return rows;
      return rows.filter((row) => row.values.code === account?.tenantId);
    }

    function setAcl(role: string, screen: string, rights: Rights) {
      mutate((draft) => {
        draft.acl[role] = { ...draft.acl[role], [screen]: rights };
        stamp(draft, { tenantId, actor: actor(), action: "Access changed", screen: "settings/access", record: role, detail: screen });
      });
    }

    function saveRule(input: Omit<Rule, "id" | "tenantId"> & { id?: string }) {
      mutate((draft) => {
        if (input.id) {
          const rule = draft.rules.find((item) => item.id === input.id);
          if (rule) Object.assign(rule, input);
        } else {
          draft.rules.unshift({ ...input, id: uid("rule"), tenantId });
        }
      });
    }

    function toggleRule(id: string) {
      mutate((draft) => {
        const rule = draft.rules.find((item) => item.id === id);
        if (rule) rule.enabled = !rule.enabled;
      });
    }

    function runRule(id: string) {
      mutate((draft) => {
        const rule = draft.rules.find((item) => item.id === id);
        if (!rule) return;
        draft.notices.unshift({
          id: uid("nt"),
          tenantId,
          title: `Rule ran: ${rule.name}`,
          body: rule.action,
          at: now(),
          read: false,
          href: `/console/${rule.module}/automations`
        });
        stamp(draft, { tenantId, actor: actor(), action: "Rule ran", screen: `${rule.module}/automations`, record: rule.name, detail: rule.action });
      });
    }

    function markRead(id: string) {
      mutate((draft) => {
        const notice = draft.notices.find((item) => item.id === id);
        if (notice) notice.read = true;
      });
    }

    function markAllRead() {
      mutate((draft) => {
        draft.notices.forEach((notice) => {
          if (notice.tenantId === tenantId) notice.read = true;
        });
      });
    }

    function sendMessage(input: { module: string; channel: string; to: string; subject: string; body: string }) {
      const row = create("visibility/alerts", {
        waybill: input.subject || input.module,
        channel: input.channel,
        to: input.to,
        event: input.subject || "Manual",
        result: "Simulated"
      }, input.body);
      mutate((draft) => {
        draft.notices.unshift({
          id: uid("nt"),
          tenantId,
          title: `${input.channel} simulated`,
          body: input.subject || input.body,
          at: now(),
          read: false,
          href: `/console/${input.module}/compose`
        });
      });
      return row;
    }

    function capturePod(input: Record<string, string>) {
      create("visibility/pod", { ...input, at: input.at || new Date().toISOString().slice(0, 16).replace("T", " "), signature: "Signed" }, "", "", true);
      const shipment = dbRef.current.entities.find((row) => row.screen === "bookings/shipments" && row.values.waybill === input.waybill && row.tenantId === tenantId && !row.deletedAt);
      if (shipment) update(shipment.id, { status: "Delivered" });
      create("visibility/milestones", {
        waybill: input.waybill,
        event: "Delivered",
        location: input.receiver || "Door",
        at: input.at || now(),
        exception: "",
        note: input.note || "POD captured"
      }, "", "", true);
    }

    function setStopStatus(id: string, status: string) {
      const row = dbRef.current.entities.find((item) => item.id === id);
      if (!row) return;
      update(id, { status });
      if (!row.values.waybill) return;
      create("visibility/milestones", {
        waybill: row.values.waybill,
        event: status === "Failed" ? "Attempted" : status === "Completed" ? "Delivered" : "Out for delivery",
        location: row.values.stop || "",
        at: new Date().toISOString().slice(0, 16).replace("T", " "),
        exception: status === "Failed" ? "Failed delivery" : "",
        note: `${row.values.driver || "Driver"} set ${status}.`
      }, "", "", true);
      if (status === "Failed") {
        create("visibility/exceptions", {
          waybill: row.values.waybill,
          kind: "Failed delivery",
          since: new Date().toISOString().slice(0, 16).replace("T", " "),
          owner: account?.name || "Driver",
          status: "Open"
        }, "", "", true);
      }
    }

    function testIntegration(id: string) {
      update(id, { status: "Simulated OK" });
    }

    function saveSnapshot(name: string, source: string, columns: string) {
      create("reports/snapshots", { name, source, columns, savedBy: account?.name || "Someone" });
    }

    function saveSystem(values: Record<string, string>) {
      const row = list("settings/system")[0];
      if (row) update(row.id, values);
      else create("settings/system", values);
    }

    function extraFields(screen: string): Field[] {
      return list("settings/forms")
        .filter((row) => row.values.target === screen && row.values.status !== "Inactive")
        .map((row) => ({ key: row.values.key || "extra", label: row.values.label || "Extra", kind: "text" }));
    }

    function signup(input: { company: string; city: string; name: string; email: string; password: string }) {
      if (db.accounts.some((item) => item.email.toLowerCase() === input.email.toLowerCase())) return "That email is already in use.";
      const code = input.company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 16) || uid("co");
      mutate((draft) => {
        draft.entities.unshift(
          entity("settings/tenants", { code, name: input.company, city: input.city, currency: "PKR", timezone: "Asia/Karachi", status: "Active" }, Date.now())
        );
        draft.entities.unshift(
          entity(
            "settings/system",
            { legalName: input.company, logoText: "Lane", timezone: "Asia/Karachi", currency: "PKR", taxPct: "18", units: "Metric", waybillPrefix: "LN-", language: "English", idleMinutes: "30", dimParcel: "5000", _tenant: code },
            Date.now()
          )
        );
        draft.accounts.push({
          email: input.email,
          password: input.password,
          name: input.name,
          role: "company_admin",
          title: "Company admin",
          status: "active",
          mfa: false,
          tenantId: code,
          branch: input.city
        });
        draft.entities.unshift(
          entity(
            "settings/users",
            { name: input.name, email: input.email, role: "company_admin", title: "Company admin", branch: input.city, mfa: "No", status: "active", _tenant: code },
            Date.now()
          )
        );
        draft.session = { email: input.email, mfaOk: true, tenantId: code };
      });
      writeCookie(input.email);
      return null;
    }

    function invite(input: { token: string; name: string; email: string; password: string; role: string }) {
      if (input.token.trim() !== INVITE_TOKEN) return "That invite code is not valid.";
      if (db.accounts.some((item) => item.email.toLowerCase() === input.email.toLowerCase())) return "That email is already in use.";
      create("settings/users", {
        name: input.name,
        email: input.email,
        role: input.role || "viewer",
        title: "Invited",
        branch: account?.branch || "",
        mfa: "No",
        status: "active"
      });
      mutate((draft) => {
        const existing = draft.accounts.find((item) => item.email === input.email);
        if (existing) existing.password = input.password;
      });
      return null;
    }

    function setPassword(email: string, password: string) {
      let ok = false;
      mutate((draft) => {
        const match = draft.accounts.find((item) => item.email.toLowerCase() === email.toLowerCase());
        if (!match) return;
        match.password = password;
        ok = true;
        stamp(draft, { tenantId: match.tenantId, actor: match.name, action: "Password reset", screen: "auth", record: match.email, detail: "Password replaced from the reset page." });
      });
      return ok;
    }

    function resetDemo() {
      localStorage.removeItem(STORAGE);
      writeCookie(null);
      setDb(initialDb());
    }

    function importShipments(text: string) {
      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const start = lines[0]?.toLowerCase().includes("waybill") ? 1 : 0;
      let count = 0;
      lines.slice(start).forEach((line) => {
        const [waybill, customer, mode, origin, destination, weightKg, status] = line.split(",").map((part) => part.trim());
        if (!customer || !origin || !destination) return;
        create("bookings/shipments", {
          waybill: waybill || "",
          orderRef: "",
          customer,
          mode: mode || "Parcel",
          service: "Express economy",
          origin,
          destination,
          shipper: customer,
          consignee: destination,
          pieces: "1",
          weightKg: weightKg || "1",
          chargeableKg: weightKg || "1",
          billing: "Prepaid",
          cod: "0",
          declaredValue: "0",
          insurance: "No",
          container: "",
          po: "",
          status: status || "Booked",
          eta: ""
        });
        count += 1;
      });
      return count;
    }

    const notices = db.notices.filter((item) => item.tenantId === tenantId);
    const audit = db.audit.filter((item) => item.tenantId === tenantId);
    const rules = db.rules.filter((item) => item.tenantId === tenantId);

    return {
      ready,
      db,
      session,
      account,
      tenantId,
      notices,
      audit,
      rules,
      rightsFor,
      canModule,
      list,
      system,
      tenants,
      create,
      update,
      trash,
      restore,
      purge,
      approve,
      login,
      confirmMfa,
      logout,
      switchTenant,
      setAcl,
      saveRule,
      toggleRule,
      runRule,
      markRead,
      markAllRead,
      sendMessage,
      capturePod,
      setStopStatus,
      testIntegration,
      saveSnapshot,
      saveSystem,
      extraFields,
      signup,
      invite,
      setPassword,
      resetDemo,
      importShipments,
      homeFor,
      roleLabel,
      modules: MODULE_KEYS
    };
  }, [db, ready]);
}

function labelOf(row: Entity) {
  const values = row.values;
  return values.waybill || values.invoice || values.name || values.number || values.file || values.email || values.code || row.id;
}

const Ctx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLane() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useLane must be used inside StoreProvider");
  return value;
}

export type { Right };
