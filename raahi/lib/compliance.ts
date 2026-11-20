import type { ItemCategory, ParcelItem } from "./types";

export const POLICY_VERSION = "2026.09.1";
export const CONTRACT_VERSION = "Raahi-Bailment-1.2";
export const LIABILITY_CAP_GBP = 250;
export const MAX_DECLARED_VALUE_GBP = 400;
export const MAX_WEIGHT_KG = 15;
export const MIN_AGE = 18;

export const PROHIBITED_KEYWORDS = [
  "cash",
  "currency",
  "gold bar",
  "weapon",
  "ammunition",
  "firearm",
  "knife",
  "drug",
  "cannabis",
  "narcotic",
  "vape liquid",
  "alcohol",
  "wine",
  "whisky",
  "tobacco",
  "cigarette",
  "hookah",
  "live animal",
  "perishable meat",
  "counterfeit",
  "replica brand",
  "passport of another",
  "bank card",
  "sim box",
];

export const RESTRICTED_NOTES: Record<ItemCategory, string> = {
  gift: "Keep gifts personal, modest value, and clearly for family use — not resale.",
  clothes: "Used personal clothing is usually simpler at customs than new bulk stock.",
  documents: "No identity documents belonging to someone else. Educational copies are fine.",
  electronics:
    "Phones and laptops may need PTA approval and duty in Pakistan. Share IMEI and keep original packaging/receipt.",
  food_dry: "Only sealed dry food. No meat, dairy, plants, or homemade wet food.",
  medicine_otc: "OTC personal-use quantities only, in original packaging, with a note from the recipient if possible.",
  other: "If it is new, high-value, or more than a family gift, it may be treated as a commercial import.",
};

export function screenItem(name: string, category: ItemCategory, valueGbp: number, qty: number) {
  const lowered = name.toLowerCase();
  const hit = PROHIBITED_KEYWORDS.find((word) => lowered.includes(word));
  if (hit) {
    return {
      level: "block" as const,
      title: "This item cannot travel on Raahi",
      detail: `“${name}” matches a prohibited category (${hit}). Commercial couriers and customs brokers exist for regulated goods — travelers cannot carry them as personal baggage.`,
    };
  }
  if (category === "electronics" && valueGbp > 250) {
    return {
      level: "warn" as const,
      title: "Electronics need extra paperwork",
      detail:
        "Pakistan PTA and customs may treat phones as dutiable imports. The sender remains importer of record. Traveler must declare the device. Add IMEI and a gift/personal-use letter.",
    };
  }
  if (qty >= 6 || valueGbp > MAX_DECLARED_VALUE_GBP) {
    return {
      level: "warn" as const,
      title: "Looks commercial, not a personal gift",
      detail:
        "Quantities or value above family-gift levels can be assessed as commercial cargo. Raahi only supports personal accompanying baggage, not an unlicensed courier business.",
    };
  }
  return {
    level: "ok" as const,
    title: RESTRICTED_NOTES[category],
    detail: "",
  };
}

export function screenParcel(items: ParcelItem[]) {
  const results = items.map((item) => ({ item, ...screenItem(item.name, item.category, item.declaredValueGbp, item.qty) }));
  const blocked = results.filter((r) => r.level === "block");
  const warnings = results.filter((r) => r.level === "warn");
  return { results, blocked, warnings, allowed: blocked.length === 0 };
}

export const TRUST_PILLARS = [
  {
    title: "Verified identity (KYC / AML)",
    body: "Every sender and traveler completes identity checks before a match. Pakistan CNIC or international passport, liveness selfie, address, and PEP/sanctions declarations. High-risk cases need enhanced due diligence.",
  },
  {
    title: "Verified itinerary",
    body: "Travelers upload a ticket or booking. Raahi stores only a masked flight number until a job is funded. No listing, no carry.",
  },
  {
    title: "Digital bailment contract",
    body: "The traveler is a bailee, not a postal operator. Ownership stays with the sender. Both parties sign a consignment note with item list, value, route, liability cap, and customs warranties.",
  },
  {
    title: "Licensed escrow, not informal cash",
    body: "Fees sit with a licensed payment partner until the recipient confirms delivery with OTP. The platform does not hold customer funds itself — that avoids illegal money transmission.",
  },
  {
    title: "Two-step handover evidence",
    body: "Pickup and delivery each need a one-time code, timestamp, and optional photo. That evidence trail is what makes disputes decidable.",
  },
  {
    title: "Customs stays with the traveler and sender",
    body: "Raahi is a matching marketplace. The traveler declares accompanying baggage. The sender warrants the goods are legal, personal/gift, and accurately valued. Commercial shipments must use a licensed courier such as TCS, DHL, or a customs agent.",
  },
];
