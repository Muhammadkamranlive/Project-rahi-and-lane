import type { ModuleKey } from "@/lib/model";

export const GUIDES: Record<ModuleKey, { title: string; steps: { title: string; detail: string }[] }> = {
  dashboard: {
    title: "How the operating picture is read",
    steps: [
      { title: "Open the company", detail: "The dashboard follows the company selected in the header. Gulf figures never mix with Pakistan." },
      { title: "Read exceptions first", detail: "Late, customs hold, credit hold, and missing scans sit above vanity totals." },
      { title: "Drop into the record", detail: "Each card links to the shipment, claim, or invoice that created the number." },
      { title: "Hand off", detail: "Compose or a rule can notify dispatch, finance, or the customer without leaving the desk." }
    ]
  },
  network: {
    title: "How the network is set up",
    steps: [
      { title: "Stations", detail: "Create branches, hubs, depots, ports, airports, and rail ramps before any lane." },
      { title: "Coverage", detail: "Zones and service areas decide who can be quoted and which cutoff applies." },
      { title: "Lanes", detail: "A lane stores mode, transit standard, and cutoff between two stations." },
      { title: "Schedules", detail: "Departures on a lane feed planning and the public promise date." }
    ]
  },
  parties: {
    title: "How trading partners are kept",
    steps: [
      { title: "Account", detail: "Customers carry credit limit, hold, and bill-to. Consignees and notify parties stay separate." },
      { title: "Capacity", detail: "Carriers, owner-operators, brokers, and agents each have a scorecard." },
      { title: "Addresses", detail: "The address book flags quality so a bad postcode does not reach dispatch." },
      { title: "Use", detail: "Bookings, rating, and claims pick these records instead of free typing." }
    ]
  },
  catalog: {
    title: "How the catalog drives every job",
    steps: [
      { title: "What moves", detail: "Commodities, HS codes, packaging, and dangerous-goods classes describe the goods." },
      { title: "How it moves", detail: "Service products and equipment types select the operating pattern." },
      { title: "How it is charged", detail: "Charge codes, accessorials, tax, and currency are the rating language." },
      { title: "How it is numbered", detail: "Numbering series and document types keep files consistent across branches." }
    ]
  },
  bookings: {
    title: "How an order becomes a shipment",
    steps: [
      { title: "Quote", detail: "Spot, contract, or a customer request lands as a quote with sell and buy." },
      { title: "Book", detail: "Accepting a quote opens a shipment, pieces, and a pickup." },
      { title: "Change", detail: "Holds, amendments, splits, and cancellations keep the original number." },
      { title: "Repeat", detail: "Templates, recurring orders, and CSV import cover the next wave." }
    ]
  },
  rating: {
    title: "How a price is built",
    steps: [
      { title: "Tariff", detail: "Zone, weight, distance, cube, piece, pallet, or container, plus a minimum." },
      { title: "Accessorials", detail: "Fuel, residential, liftgate, detention, demurrage, and the rest stack on top." },
      { title: "Margin", detail: "Carrier cost, markup, and a margin floor protect the sell price." },
      { title: "Confirm", detail: "Rate shop compares modes. A confirmation freezes the figure used on the invoice." }
    ]
  },
  dispatch: {
    title: "How freight is planned and tendered",
    steps: [
      { title: "Build", detail: "The load board respects weight, cube, pieces, pallets, and axles." },
      { title: "Tender", detail: "Offer, accept, reject, expire, then retender down the waterfall." },
      { title: "Route", detail: "Assign driver and vehicle, sequence stops, and respect hours and bans." },
      { title: "Dock and yard", detail: "Appointments and gate events start detention clocks." }
    ]
  },
  visibility: {
    title: "How a shipment stays visible",
    steps: [
      { title: "Scan", detail: "Pickup, hub in, sort, hub out, and out-for-delivery write the milestone chain." },
      { title: "Watch", detail: "The tower surfaces late, dwell, missing scan, failed delivery, customs, and credit." },
      { title: "Prove", detail: "POD stores name, signature, photo, OTP, barcode, time, and coordinates." },
      { title: "Tell", detail: "Alerts simulate email, SMS, and WhatsApp to the parties on the file." }
    ]
  },
  fleet: {
    title: "How assets stay legal and used",
    steps: [
      { title: "Register", detail: "Power, trailers, and containers carry insurance, inspection, and permit dates." },
      { title: "People", detail: "License, medical, endorsements, and a duty status sit on the driver." },
      { title: "Care", detail: "Maintenance, fuel, odometer, and incidents explain downtime." },
      { title: "Use", detail: "Utilization separates loaded miles from empty miles." }
    ]
  },
  warehouse: {
    title: "How a 3PL warehouse runs",
    steps: [
      { title: "Arrive", detail: "ASN and a dock appointment become a receipt, quality check, and putaway." },
      { title: "Store", detail: "Stock is owned by a client and tracked by lot, serial, expiry, or catch weight." },
      { title: "Leave", detail: "Allocate, wave, pick, pack, stage, and ship. Counts correct the book." },
      { title: "Bill", detail: "Storage by pallet, bin, or cubic metre and value-added work become charges." }
    ]
  },
  forwarding: {
    title: "How a forwarding file is worked",
    steps: [
      { title: "Open", detail: "A file holds house and master bills, the consol, and the routing order." },
      { title: "Move", detail: "Agents, Incoterms tasks, pre-alert, arrival notice, and delivery order follow the leg." },
      { title: "Box", detail: "Stuffing, unstuffing, VGM, and seal are recorded against the container." },
      { title: "Clock", detail: "Demurrage and detention run until the empty is returned." }
    ]
  },
  customs: {
    title: "How goods clear",
    steps: [
      { title: "Describe", detail: "Commercial invoice, packing list, and certificate of origin match the file." },
      { title: "Classify", detail: "HS code, duty estimate, and importer or exporter of record sit on the entry." },
      { title: "Screen", detail: "Restricted-party and dangerous-goods results are stored. Live government feeds are not called." },
      { title: "Release", detail: "Entry status, permits, and temperature flags release or hold the cargo." }
    ]
  },
  documents: {
    title: "How paperwork stays with the freight",
    steps: [
      { title: "Require", detail: "A checklist by mode and lane says what must exist before departure." },
      { title: "Issue", detail: "Labels, waybills, bills, and invoices are generated from the shipment." },
      { title: "Sign", detail: "E-sign status shows who has accepted the rate confirmation or POD." },
      { title: "Print", detail: "Open a document and print. Versions stay on the record." }
    ]
  },
  billing: {
    title: "How freight gets paid",
    steps: [
      { title: "Sell", detail: "Customer invoices, credit notes, and receipts follow the rated shipment." },
      { title: "Buy", detail: "Carrier bills, accruals, and driver or owner-operator settlements follow the cost." },
      { title: "Audit", detail: "Rated amount versus billed amount opens a dispute or a short-pay." },
      { title: "See margin", detail: "Profit is kept by shipment, customer, lane, mode, and branch." }
    ]
  },
  service: {
    title: "How exceptions become cases",
    steps: [
      { title: "Hear", detail: "A case links to a waybill and starts an SLA clock." },
      { title: "Claim", detail: "Loss, damage, shortage, or delay stores photos, liability, and recovery." },
      { title: "Return", detail: "An authorization creates a label, a pickup, an inspection, and a disposition." },
      { title: "Learn", detail: "The consignee rating is kept against the same shipment." }
    ]
  },
  sales: {
    title: "How a lane is won",
    steps: [
      { title: "Lead", detail: "Website demo requests and outbound names land as leads." },
      { title: "Offer", detail: "An opportunity carries the lane, mode, and expected margin." },
      { title: "Bid", detail: "An RFP records the shipper's lanes and the outcome." },
      { title: "Contract", detail: "A won bid becomes a contract with a renewal date." }
    ]
  },
  reports: {
    title: "How the numbers are kept",
    steps: [
      { title: "KPIs", detail: "On-time pickup and delivery, dwell, cost, empty miles, claims, and occupancy." },
      { title: "Slice", detail: "The custom builder picks a desk, columns, and filters." },
      { title: "Save", detail: "A snapshot freezes that view for finance or the Monday meeting." },
      { title: "Export", detail: "Every list, including a snapshot, downloads as a spreadsheet file." }
    ]
  },
  settings: {
    title: "How administration is controlled",
    steps: [
      { title: "Company", detail: "Tenants, users, roles, and the access matrix decide who sees which menu." },
      { title: "Voice", detail: "Pages, blog, landing images, templates, and extra fields are edited here." },
      { title: "Watch", detail: "Audit, notifications, recycle bin, and rules record what the desk did." },
      { title: "Connect", detail: "Integrations, API keys, and events are registered. Test runs a simulation only." }
    ]
  }
};
