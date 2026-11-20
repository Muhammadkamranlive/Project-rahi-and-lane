export const RIGHTS = ["view", "create", "update", "delete", "export", "approve"] as const;
export type Right = (typeof RIGHTS)[number];
export type Rights = Record<Right, boolean>;

export const MODULES = [
  { key: "dashboard", label: "Dashboard", blurb: "Live operating picture, exceptions, and margin." },
  { key: "network", label: "Network", blurb: "Branches, hubs, zones, lanes, and cutoffs." },
  { key: "parties", label: "Parties", blurb: "Customers, carriers, agents, and addresses." },
  { key: "catalog", label: "Catalog", blurb: "Services, commodities, charges, and compliance codes." },
  { key: "bookings", label: "Bookings", blurb: "Quotes, shipments, pickups, and amendments." },
  { key: "rating", label: "Rating", blurb: "Tariffs, fuel, dim factors, and rate shopping." },
  { key: "dispatch", label: "Dispatch", blurb: "Loads, tenders, routes, docks, and the yard." },
  { key: "visibility", label: "Visibility", blurb: "Milestones, tracking, POD, and the control tower." },
  { key: "fleet", label: "Fleet", blurb: "Power, trailers, drivers, fuel, and maintenance." },
  { key: "warehouse", label: "Warehouse", blurb: "Inbound, inventory, waves, and 3PL billing units." },
  { key: "forwarding", label: "Forwarding", blurb: "Files, consols, bills, and demurrage clocks." },
  { key: "customs", label: "Customs", blurb: "Entries, documents, screening, and dangerous goods." },
  { key: "documents", label: "Documents", blurb: "Labels, waybills, checklists, and e-sign." },
  { key: "billing", label: "Billing", blurb: "Invoices, settlements, freight audit, and profit." },
  { key: "service", label: "Service", blurb: "Cases, claims, returns, and delivery ratings." },
  { key: "sales", label: "Sales", blurb: "Leads, lane RFPs, contracts, and win or loss." },
  { key: "reports", label: "Reports", blurb: "Service levels, cost, and saved snapshots." },
  { key: "settings", label: "Administration", blurb: "Companies, roles, content, and system control." }
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];

export const MODULE_KEYS: ModuleKey[] = MODULES.map((m) => m.key);

export function isModule(value: string): value is ModuleKey {
  return MODULE_KEYS.includes(value as ModuleKey);
}

export function moduleMeta(key: string) {
  return MODULES.find((m) => m.key === key);
}

export type FieldKind = "text" | "number" | "date" | "select" | "textarea" | "money";

export type Field = {
  key: string;
  label: string;
  kind?: FieldKind;
  options?: string[];
  required?: boolean;
};

export type ScreenKind =
  | "table"
  | "dashboard"
  | "guide"
  | "compose"
  | "rules"
  | "access"
  | "kpis"
  | "rateshop"
  | "tower"
  | "pod"
  | "driver"
  | "import"
  | "recycle"
  | "audit"
  | "inbox"
  | "system"
  | "profile"
  | "custom-report"
  | "station";

export type ScreenDef = {
  module: ModuleKey;
  slug: string;
  label: string;
  group: string;
  summary: string;
  kind?: ScreenKind;
  fields?: Field[];
  columns?: string[];
  rows?: Record<string, string>[];
  locked?: string[];
};

export type Account = {
  email: string;
  password: string;
  name: string;
  role: string;
  title: string;
  status: "active" | "invited" | "blocked";
  mfa: boolean;
  tenantId: string;
  branch: string;
};

export const DEMO_PASSWORD = "Lane#demo1";
export const DEMO_MFA = "482913";
export const INVITE_TOKEN = "LANE-INVITE";

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  company_admin: "Company Admin",
  operations_manager: "Operations Manager",
  dispatcher: "Dispatcher",
  warehouse_manager: "Warehouse Manager",
  fleet_manager: "Fleet Manager",
  finance: "Finance",
  customer_service: "Customer Service",
  sales: "Sales",
  driver: "Driver",
  customer: "Customer",
  carrier: "Carrier user",
  viewer: "Viewer"
};

export const ROLE_BLURBS: Record<string, string> = {
  super_admin: "Full platform control across companies, users, and menu rights.",
  company_admin: "Full control inside one company, including administration.",
  operations_manager: "Network, bookings, warehouse, forwarding, and exceptions.",
  dispatcher: "Loads, tenders, routes, and live shipment status.",
  warehouse_manager: "Receiving, inventory, picks, and pack-out.",
  fleet_manager: "Vehicles, drivers, maintenance, and fuel.",
  finance: "Customer invoices, carrier bills, audit, and margin.",
  customer_service: "Cases, claims, delivery failures, and ratings.",
  sales: "Leads, quotes, lane RFPs, and contracts.",
  driver: "Today's stops, status updates, and proof of delivery.",
  customer: "Book, track, documents, invoices, and claims.",
  carrier: "Tenders, proof of delivery, and carrier invoices.",
  viewer: "Read-only view of operations and reports."
};

const ALL = MODULE_KEYS;
const OPS: ModuleKey[] = ALL.filter((key) => key !== "settings");

const ROLE_MODULES: Record<string, ModuleKey[]> = {
  super_admin: ALL,
  company_admin: ALL,
  operations_manager: OPS,
  dispatcher: ["dashboard", "bookings", "dispatch", "visibility", "fleet"],
  warehouse_manager: ["dashboard", "warehouse", "bookings", "network"],
  fleet_manager: ["dashboard", "fleet", "dispatch", "visibility"],
  finance: ["dashboard", "billing", "reports", "parties"],
  customer_service: ["dashboard", "visibility", "service", "bookings", "documents"],
  sales: ["dashboard", "sales", "rating", "parties", "reports", "bookings"],
  driver: ["visibility", "dispatch", "fleet"],
  customer: ["bookings", "documents", "billing", "service", "parties", "rating"],
  carrier: ["dispatch", "documents", "billing", "visibility"],
  viewer: OPS
};

const SCREEN_ALLOW: Record<string, string[]> = {
  customer: [
    "bookings/quotes",
    "bookings/shipments",
    "bookings/pickups",
    "bookings/templates",
    "bookings/recurring",
    "documents/library",
    "documents/labels",
    "documents/waybills",
    "billing/invoices",
    "billing/receipts",
    "billing/credit-notes",
    "service/claims",
    "service/cases",
    "service/returns",
    "service/ratings",
    "parties/address-book",
    "rating/rate-shop",
    "rating/confirmations"
  ],
  driver: ["visibility/driver", "visibility/pod", "visibility/tracking", "dispatch/routes", "fleet/drivers"],
  carrier: [
    "dispatch/tenders",
    "documents/library",
    "documents/waybills",
    "billing/carrier-bills",
    "visibility/pod",
    "visibility/tracking"
  ]
};

const READ_ONLY_FOR_CUSTOMER = new Set([
  "billing/invoices",
  "billing/receipts",
  "billing/credit-notes",
  "documents/library",
  "documents/labels",
  "documents/waybills",
  "rating/confirmations"
]);

export function modulesForRole(role: string, customModules?: string): ModuleKey[] {
  if (ROLE_MODULES[role]) return ROLE_MODULES[role];
  const parsed = (customModules || "dashboard")
    .split(",")
    .map((part) => part.trim())
    .filter(isModule);
  return parsed.length ? parsed : ["dashboard"];
}

export function emptyRights(): Rights {
  return { view: false, create: false, update: false, delete: false, export: false, approve: false };
}

export function defaultRights(role: string, screenKey: string, customModules?: string): Rights {
  if (screenKey === "dashboard/profile") {
    return { view: true, create: false, update: true, delete: false, export: false, approve: false };
  }
  const [mod, slug] = screenKey.split("/");
  if (!isModule(mod)) return emptyRights();
  const allowedModules = modulesForRole(role, customModules);
  const utility = slug === "guide" || slug === "compose" || slug === "automations" || slug === "overview";
  if (!allowedModules.includes(mod) && !(utility && allowedModules.includes(mod))) return emptyRights();
  if (!allowedModules.includes(mod)) return emptyRights();

  const allow = SCREEN_ALLOW[role];
  if (allow && !utility && !allow.includes(screenKey)) return emptyRights();

  const rights = emptyRights();
  rights.view = true;
  if (role === "viewer") {
    rights.export = true;
    return rights;
  }
  if (role === "customer" && READ_ONLY_FOR_CUSTOMER.has(screenKey)) {
    rights.export = true;
    return rights;
  }
  if (role === "driver") {
    rights.update = screenKey === "visibility/pod" || screenKey === "visibility/driver" || screenKey === "dispatch/routes";
    rights.create = screenKey === "visibility/pod";
    return rights;
  }
  if (role === "carrier") {
    rights.update = screenKey === "dispatch/tenders" || screenKey === "visibility/pod";
    rights.create = screenKey === "billing/carrier-bills" || screenKey === "visibility/pod";
    rights.export = true;
    return rights;
  }

  const admin = role === "super_admin" || role === "company_admin";
  const finance = role === "finance";
  const service = role === "customer_service";
  if (admin) {
    return { view: true, create: true, update: true, delete: true, export: true, approve: true };
  }
  rights.create = true;
  rights.update = true;
  rights.export = true;
  rights.delete = role === "operations_manager";
  rights.approve =
    admin ||
    (finance && mod === "billing") ||
    (service && (mod === "service" || mod === "visibility")) ||
    (role === "dispatcher" && mod === "dispatch") ||
    (role === "operations_manager" && (mod === "dispatch" || mod === "customs" || mod === "billing"));
  if (mod === "settings") return emptyRights();
  return rights;
}

export function homeFor(role: string) {
  switch (role) {
    case "driver":
      return "/console/visibility/driver";
    case "customer":
      return "/console/bookings/shipments";
    case "carrier":
      return "/console/dispatch/tenders";
    case "warehouse_manager":
      return "/console/warehouse/picks";
    case "finance":
      return "/console/billing/invoices";
    case "sales":
      return "/console/sales/opportunities";
    case "customer_service":
      return "/console/service/cases";
    case "dispatcher":
      return "/console/dispatch/load-board";
    case "fleet_manager":
      return "/console/fleet/power-units";
    case "operations_manager":
      return "/console/visibility/tower";
    default:
      return "/apps";
  }
}

export const ACCOUNTS: Account[] = [
  { email: "admin@lane.demo", password: DEMO_PASSWORD, name: "Amina Shah", role: "super_admin", title: "Platform owner", status: "active", mfa: true, tenantId: "alpha", branch: "Karachi" },
  { email: "company@lane.demo", password: DEMO_PASSWORD, name: "Hassan Qureshi", role: "company_admin", title: "Country manager", status: "active", mfa: false, tenantId: "alpha", branch: "Karachi" },
  { email: "ops@lane.demo", password: DEMO_PASSWORD, name: "Nadia Rahman", role: "operations_manager", title: "Operations manager", status: "active", mfa: false, tenantId: "alpha", branch: "Lahore" },
  { email: "dispatch@lane.demo", password: DEMO_PASSWORD, name: "Bilal Khan", role: "dispatcher", title: "Dispatch lead", status: "active", mfa: false, tenantId: "alpha", branch: "Karachi" },
  { email: "warehouse@lane.demo", password: DEMO_PASSWORD, name: "Sana Iqbal", role: "warehouse_manager", title: "Warehouse manager", status: "active", mfa: false, tenantId: "alpha", branch: "Karachi" },
  { email: "fleet@lane.demo", password: DEMO_PASSWORD, name: "Imran Malik", role: "fleet_manager", title: "Fleet controller", status: "active", mfa: false, tenantId: "alpha", branch: "Lahore" },
  { email: "finance@lane.demo", password: DEMO_PASSWORD, name: "Mariam Ali", role: "finance", title: "Freight accountant", status: "active", mfa: false, tenantId: "alpha", branch: "Karachi" },
  { email: "service@lane.demo", password: DEMO_PASSWORD, name: "Hira Noor", role: "customer_service", title: "Service lead", status: "active", mfa: false, tenantId: "alpha", branch: "Karachi" },
  { email: "sales@lane.demo", password: DEMO_PASSWORD, name: "Omar Farooq", role: "sales", title: "Lane sales", status: "active", mfa: false, tenantId: "alpha", branch: "Lahore" },
  { email: "driver@lane.demo", password: DEMO_PASSWORD, name: "Sami Raza", role: "driver", title: "Linehaul driver", status: "active", mfa: false, tenantId: "alpha", branch: "Lahore" },
  { email: "customer@lane.demo", password: DEMO_PASSWORD, name: "Northline Retail", role: "customer", title: "Shipper admin", status: "active", mfa: false, tenantId: "alpha", branch: "Lahore" },
  { email: "carrier@lane.demo", password: DEMO_PASSWORD, name: "Indus Linehaul", role: "carrier", title: "Carrier desk", status: "active", mfa: false, tenantId: "alpha", branch: "Karachi" },
  { email: "viewer@lane.demo", password: DEMO_PASSWORD, name: "Audit Viewer", role: "viewer", title: "Read only", status: "active", mfa: false, tenantId: "alpha", branch: "Karachi" },
  { email: "gulf@lane.demo", password: DEMO_PASSWORD, name: "Layla Hassan", role: "company_admin", title: "Gulf manager", status: "active", mfa: false, tenantId: "gulf", branch: "Dubai" }
];

export function roleLabel(role: string) {
  return ROLE_LABELS[role] || role.replaceAll("_", " ");
}

export function text(key: string, label: string, required = false): Field {
  return { key, label, kind: "text", required };
}
export function num(key: string, label: string): Field {
  return { key, label, kind: "number" };
}
export function date(key: string, label: string): Field {
  return { key, label, kind: "date" };
}
export function money(key: string, label: string): Field {
  return { key, label, kind: "money" };
}
export function area(key: string, label: string): Field {
  return { key, label, kind: "textarea" };
}
export function sel(key: string, label: string, options: string[], required = false): Field {
  return { key, label, kind: "select", options, required };
}

export const STATUS = ["Active", "Inactive"];
export const FLOW = ["Pending", "Approved", "Rejected", "Cancelled"];
