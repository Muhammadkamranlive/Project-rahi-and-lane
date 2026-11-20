export const SOLUTIONS = [
  {
    slug: "shipper",
    title: "Shippers",
    lede: "Book, price, and see every order without calling the branch.",
    points: ["Self-serve quotes and bookings", "Branded tracking and alerts", "Invoices, documents, and claims in one portal", "Address book with a quality flag"]
  },
  {
    slug: "carrier",
    title: "Carriers",
    lede: "Accept the loads you want and send proof back without a phone chain.",
    points: ["Tender waterfall with expiry", "POD upload from the road", "Carrier invoices against the tender", "Scorecards the shipper can actually read"]
  },
  {
    slug: "3pl",
    title: "Third-party logistics",
    lede: "Warehouse and transport for many clients, billed from the same stock.",
    points: ["Inventory owned by the client", "Waves, labour, and value-added work", "Storage by pallet, bin, or cubic metre", "A portal per client"]
  },
  {
    slug: "forwarder",
    title: "Freight forwarders",
    lede: "House bills, master bills, and the file's profit on one screen.",
    points: ["Consol and deconsol", "Agent handoff and profit share", "Demurrage and detention clocks", "Document set for a letter of credit"]
  },
  {
    slug: "courier",
    title: "Couriers",
    lede: "Same-day and express, with attempts, OTP, and a photo at the door.",
    points: ["Piece-level labels", "Waves and out-for-delivery", "Failed delivery and reattempt", "COD remittance"]
  },
  {
    slug: "warehouse",
    title: "Warehouses",
    lede: "From the ASN to the last pick, with counts that finance will trust.",
    points: ["Dock appointments", "Lot, serial, and expiry", "Cycle count and quarantine", "Cross-dock when the freight should not sit"]
  },
  {
    slug: "driver",
    title: "Drivers",
    lede: "A phone page for today's stops. No app store. No paper POD.",
    points: ["Stop list and status", "Navigate handoff", "Signature, photo, and OTP", "Hours status the fleet desk can see"]
  }
] as const;

export type SolutionSlug = (typeof SOLUTIONS)[number]["slug"];

export function solution(slug: string) {
  return SOLUTIONS.find((item) => item.slug === slug);
}

export const FAQS = [
  {
    q: "Which modes can one company run?",
    a: "Parcel, courier, LTL, FTL, air, ocean, rail, forwarding, warehousing, and last-mile. They share customers, documents, and the invoice."
  },
  {
    q: "Does tracking call a carrier?",
    a: "Not in this desk. Milestones, scans, and a simulated GPS trail are stored here. The integrations page can record a connector and run a simulated test."
  },
  {
    q: "Can a customer see another customer's freight?",
    a: "No. Menu rights and the company switcher keep each tenant, and each role, to its own work."
  },
  {
    q: "How do I sign in to the demo?",
    a: "Accounts are issued to your team. They are listed in the project's credentials file, not on the sign-in screen."
  }
];

export const TESTIMONIALS = [
  {
    quote: "The tower replaced the morning spreadsheet. Late freight is a queue, not a rumour.",
    name: "Operations lead",
    company: "Northline Retail"
  },
  {
    quote: "House bills and the warehouse client's storage charge finally sit on the same profit line.",
    name: "Branch manager",
    company: "Lane Pakistan"
  },
  {
    quote: "Drivers close the stop on the phone. Finance sees the POD before the carrier bill arrives.",
    name: "Fleet controller",
    company: "Indus Linehaul"
  }
];

export const PACKAGES = [
  {
    name: "Desk",
    price: "PKR 45,000",
    period: "per branch / month",
    points: ["Bookings, tracking, and POD", "Customer portal", "Five users", "Email alerts"]
  },
  {
    name: "Network",
    price: "PKR 120,000",
    period: "per company / month",
    points: ["Dispatch, fleet, and warehouse", "Rating and freight audit", "Roles and audit log", "SMS and WhatsApp simulations"]
  },
  {
    name: "Control tower",
    price: "Talk to us",
    period: "multi-company",
    points: ["Forwarding and customs files", "Multi-company administration", "API keys and event catalog", "Named success desk"]
  }
];
