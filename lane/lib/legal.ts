export const LEGAL = [
  {
    slug: "privacy",
    title: "Privacy",
    body: [
      "Lane stores company, shipment, and contact data so the operating company can move and bill freight.",
      "Demo data lives in this browser. Clearing site data removes it. A production deployment would name a region, a processor, and a retention period.",
      "You can ask the company administrator to export or erase a person's record. Audit history of the erasure is kept.",
      "Marketing cookies are optional. The product works if you decline them."
    ]
  },
  {
    slug: "terms",
    title: "Terms",
    body: [
      "Lane is an operating desk for the company that holds the account. It does not itself carry goods or insure them.",
      "Quotes in the demo are calculated from tariffs stored in the desk. They are not an offer of carriage.",
      "Users must keep their password to themselves and use only the role they were given.",
      "The company is responsible for the truth of customs descriptions, weights, and dangerous-goods declarations entered here."
    ]
  },
  {
    slug: "cookies",
    title: "Cookies",
    body: [
      "A session cookie keeps you signed in. It is required for the console.",
      "A preference key remembers the cookie choice and the sidebar.",
      "The demo does not load advertising or third-party analytics."
    ]
  },
  {
    slug: "prohibited",
    title: "Prohibited goods",
    body: [
      "The desk will not accept bookings for weapons, explosives, live animals without a permit record, or waste that has no licence on the file.",
      "Dangerous goods need a declaration: UN number, class, and packing group, before the shipment can leave Pending.",
      "Staff should match the commodity against the prohibited list in Customs before tendering."
    ]
  },
  {
    slug: "customs",
    title: "Customs notice",
    body: [
      "Duty and tax figures are estimates from the HS code on the entry. They are not a customs assessment.",
      "Restricted-party screening in this demo returns a stored result. It does not call a government list.",
      "The importer and exporter of record on the entry are the names the company entered. Lane does not file the entry."
    ]
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    body: [
      "Pages use text, visible labels, and a skip link. Colour is not the only way a status is shown.",
      "The console works with a keyboard: tab through the menu, open a record, and leave a dialog with Escape.",
      "If a screen is hard to use, write to the address on the contact page and name the browser and the page."
    ]
  }
] as const;

export function legalPage(slug: string) {
  return LEGAL.find((page) => page.slug === slug);
}
