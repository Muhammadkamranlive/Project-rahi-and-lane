import {
  area,
  date,
  money,
  num,
  sel,
  text,
  type ModuleKey,
  type ScreenDef,
  isModule
} from "@/lib/model";

const active = ["Active", "Inactive"];
const yesNo = ["Yes", "No"];

function station(
  slug: string,
  label: string,
  group: string,
  summary: string,
  rows: Record<string, string>[]
): ScreenDef {
  return {
    module: "network",
    slug,
    label,
    group,
    summary,
    fields: [
      text("code", "Code", true),
      text("name", "Name", true),
      text("city", "City", true),
      text("country", "Country", true),
      text("timezone", "Timezone"),
      sel("status", "Status", active),
      area("detail", "Operating notes")
    ],
    rows
  };
}

function screen(
  module: ModuleKey,
  slug: string,
  label: string,
  group: string,
  summary: string,
  fields: ScreenDef["fields"],
  rows: Record<string, string>[],
  extra?: Partial<ScreenDef>
): ScreenDef {
  return { module, slug, label, group, summary, fields, rows, kind: "table", ...extra };
}

export const SCREENS: ScreenDef[] = [
  screen("dashboard", "profile", "My profile", "Account", "Your name, branch, and contact details.", [
    text("name", "Name", true),
    text("title", "Title"),
    text("email", "Email", true),
    text("branch", "Branch"),
    text("phone", "Phone")
  ], [], { kind: "profile", locked: ["email"] }),

  station("branches", "Branches", "Stations", "Legal operating branches and their local cutoffs.", [
    { code: "KHI", name: "Karachi HQ", city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Finance and customs desk." },
    { code: "LHE", name: "Lahore Gateway", city: "Lahore", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Northbound linehaul." },
    { code: "DXB", name: "Dubai Desk", city: "Dubai", country: "UAE", timezone: "Asia/Dubai", status: "Active", detail: "Gulf company only.", _tenant: "gulf" }
  ]),
  station("hubs", "Hubs", "Stations", "Sort hubs where scans and linehaul meet.", [
    { code: "KHI-H1", name: "Korangi sort", city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Night sort 22:00." },
    { code: "LHE-H1", name: "Sundar hub", city: "Lahore", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Linehaul arrival 06:00." }
  ]),
  station("depots", "Depots", "Stations", "Last-mile depots and pickup counters.", [
    { code: "LHE-D2", name: "Gulberg depot", city: "Lahore", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Same-day cutoff 14:00." },
    { code: "KHI-D4", name: "Clifton counter", city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Walk-in parcels." }
  ]),
  station("cross-docks", "Cross-docks", "Stations", "Freight that should transfer, not store.", [
    { code: "KHI-XD", name: "Port Qasim cross-dock", city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Ocean to road, same day." }
  ]),
  station("ports", "Ports", "Gateways", "Seaports used on forwarding files.", [
    { code: "PKKHI", name: "Karachi / Port Qasim", city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "UN/LOCODE PKKHI." },
    { code: "GBFXT", name: "Felixstowe", city: "Felixstowe", country: "United Kingdom", timezone: "Europe/London", status: "Active", detail: "North Europe discharge." }
  ]),
  station("airports", "Airports", "Gateways", "Airports for air waybills and uplifts.", [
    { code: "OPKC", name: "Jinnah International", city: "Karachi", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Cargo terminal north." },
    { code: "OPLA", name: "Allama Iqbal", city: "Lahore", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Night freighter." }
  ]),
  station("rail-ramps", "Rail ramps", "Gateways", "Rail ramps for intermodal handoff.", [
    { code: "LHE-R1", name: "Lahore dry port ramp", city: "Lahore", country: "Pakistan", timezone: "Asia/Karachi", status: "Active", detail: "Box handoff to road." }
  ]),
  screen("network", "addresses", "Addresses", "Coverage", "Geocoded addresses used by parties and bookings.", [
    text("label", "Label", true),
    text("line", "Address", true),
    text("city", "City"),
    text("postal", "Postal code"),
    text("lat", "Latitude"),
    text("lng", "Longitude"),
    sel("quality", "Address quality", ["Verified", "Review", "Failed"])
  ], [
    { label: "Northline Gulberg", line: "12 M.M. Alam Road", city: "Lahore", postal: "54660", lat: "31.5204", lng: "74.3587", quality: "Verified" },
    { label: "Atlas warehouse", line: "Plot 41 Korangi Creek", city: "Karachi", postal: "74900", lat: "24.8607", lng: "67.0011", quality: "Verified" },
    { label: "Felixstowe DC", line: "Walton Avenue", city: "Felixstowe", postal: "IP11 3HG", lat: "51.961", lng: "1.351", quality: "Review" }
  ]),
  screen("network", "zones", "Zones", "Coverage", "Pricing and service zones.", [
    text("code", "Code", true),
    text("name", "Name", true),
    text("country", "Country"),
    sel("mode", "Mode", ["Parcel", "Road", "Air", "Ocean"]),
    area("postals", "Postal coverage")
  ], [
    { code: "PK-N", name: "Pakistan north", country: "Pakistan", mode: "Road", postals: "54000-54999, 38000-38999" },
    { code: "PK-S", name: "Pakistan south", country: "Pakistan", mode: "Parcel", postals: "74000-75999" },
    { code: "EU-UK", name: "UK east coast", country: "United Kingdom", mode: "Ocean", postals: "IP, NR, CO" }
  ]),
  screen("network", "service-areas", "Service areas", "Coverage", "Where a product is actually offered.", [
    text("name", "Name", true),
    sel("product", "Service", ["Same-day", "Express", "Economy", "LTL", "FTL"]),
    text("zone", "Zone"),
    text("cutoff", "Cutoff"),
    sel("status", "Status", active)
  ], [
    { name: "Lahore same-day", product: "Same-day", zone: "PK-N", cutoff: "14:00", status: "Active" },
    { name: "KHI-LHE economy", product: "Economy", zone: "PK-S", cutoff: "18:00", status: "Active" }
  ]),
  screen("network", "lanes", "Lanes", "Lanes", "A promised path between two stations.", [
    text("code", "Code", true),
    text("origin", "Origin", true),
    text("destination", "Destination", true),
    sel("mode", "Mode", ["Parcel", "LTL", "FTL", "Air", "Ocean", "Rail"]),
    num("transitHours", "Transit hours"),
    text("cutoff", "Cutoff"),
    sel("status", "Status", active)
  ], [
    { code: "LHE-KHI-P", origin: "Lahore", destination: "Karachi", mode: "Parcel", transitHours: "36", cutoff: "20:00", status: "Active" },
    { code: "KHI-LHE-F", origin: "Karachi", destination: "Lahore", mode: "FTL", transitHours: "28", cutoff: "16:00", status: "Active" },
    { code: "KHI-FXT-O", origin: "Karachi", destination: "Felixstowe", mode: "Ocean", transitHours: "504", cutoff: "Friday 12:00", status: "Active" }
  ]),
  screen("network", "schedules", "Schedules", "Lanes", "Departures that planning can book against.", [
    text("lane", "Lane", true),
    text("departure", "Departs"),
    text("arrival", "Arrives"),
    sel("equipment", "Equipment", ["Van", "12m trailer", "40HC", "Air ULD"]),
    num("capacityKg", "Capacity kg"),
    sel("status", "Status", ["Open", "Full", "Cancelled"])
  ], [
    { lane: "LHE-KHI-P", departure: "2026-09-28 21:00", arrival: "2026-09-30 09:00", equipment: "12m trailer", capacityKg: "8000", status: "Open" },
    { lane: "KHI-FXT-O", departure: "2026-10-02", arrival: "2026-10-23", equipment: "40HC", capacityKg: "26000", status: "Open" }
  ]),

  screen("parties", "customers", "Customers", "Accounts", "Billable accounts, credit, and hold.", [
    text("code", "Code", true),
    text("name", "Name", true),
    text("city", "City"),
    money("creditLimit", "Credit limit"),
    sel("creditHold", "Credit hold", yesNo),
    text("billTo", "Bill-to"),
    sel("status", "Status", active)
  ], [
    { code: "C-104", name: "Northline Retail", city: "Lahore", creditLimit: "2500000", creditHold: "No", billTo: "Northline Retail", status: "Active" },
    { code: "C-118", name: "Atlas Home", city: "Karachi", creditLimit: "1800000", creditHold: "No", billTo: "Atlas Home", status: "Active" },
    { code: "C-090", name: "Harbour Spice", city: "Karachi", creditLimit: "400000", creditHold: "Yes", billTo: "Harbour Spice", status: "Active" },
    { code: "C-501", name: "Gulf Retail", city: "Dubai", creditLimit: "90000", creditHold: "No", billTo: "Gulf Retail", status: "Active", _tenant: "gulf" }
  ]),
  screen("parties", "shippers", "Shippers", "Accounts", "The party handing freight to Lane.", [
    text("name", "Name", true),
    text("customer", "Customer"),
    text("site", "Site"),
    text("contact", "Contact"),
    text("phone", "Phone")
  ], [
    { name: "Northline Gulberg", customer: "Northline Retail", site: "Lahore", contact: "Ayesha", phone: "+92 300 110 2201" },
    { name: "Atlas Korangi", customer: "Atlas Home", site: "Karachi", contact: "Danish", phone: "+92 321 440 1188" }
  ]),
  screen("parties", "consignees", "Consignees", "Accounts", "The party who receives the freight.", [
    text("name", "Name", true),
    text("city", "City"),
    text("phone", "Phone"),
    text("customer", "For customer"),
    area("instructions", "Delivery instructions")
  ], [
    { name: "Northline Karachi DC", city: "Karachi", phone: "+92 21 3588 0101", customer: "Northline Retail", instructions: "Dock 3, appointment required." },
    { name: "Felixstowe DC", city: "Felixstowe", phone: "+44 1394 600 100", customer: "Atlas Home", instructions: "Book 48 hours ahead." }
  ]),
  screen("parties", "bill-to", "Bill-to accounts", "Accounts", "Who is invoiced when it is not the shipper.", [
    text("name", "Name", true),
    text("currency", "Currency"),
    text("terms", "Terms"),
    text("taxId", "Tax id"),
    sel("status", "Status", active)
  ], [
    { name: "Northline Retail", currency: "PKR", terms: "30 days", taxId: "NTN-4412901", status: "Active" },
    { name: "Atlas Home", currency: "PKR", terms: "15 days", taxId: "NTN-2201844", status: "Active" }
  ]),
  screen("parties", "notify", "Notify parties", "Accounts", "Parties told at arrival, who may not be the consignee.", [
    text("name", "Name", true),
    text("email", "Email"),
    text("city", "City"),
    text("forFile", "Used on")
  ], [
    { name: "Atlas UK broker", email: "broker@atlas.example", city: "Felixstowe", forFile: "LF-2408" },
    { name: "Northline control", email: "control@northline.example", city: "Lahore", forFile: "LN-10021" }
  ]),
  screen("parties", "carriers", "Carriers", "Capacity", "Carriers Lane buys capacity from.", [
    text("name", "Name", true),
    sel("mode", "Mode", ["Road", "Air", "Ocean", "Rail"]),
    text("mc", "Licence"),
    num("otp", "On-time %"),
    sel("status", "Status", active)
  ], [
    { name: "Indus Linehaul", mode: "Road", mc: "NTC-3391", otp: "96", status: "Active" },
    { name: "Crescent Air", mode: "Air", mc: "PCAA-19", otp: "91", status: "Active" },
    { name: "North Sea Box", mode: "Ocean", mc: "NVOCC-88", otp: "88", status: "Active" }
  ]),
  screen("parties", "owner-operators", "Owner-operators", "Capacity", "Drivers who bring their own unit.", [
    text("name", "Name", true),
    text("unit", "Unit"),
    text("settlement", "Settlement"),
    sel("status", "Status", ["Available", "Assigned", "Inactive"])
  ], [
    { name: "Kamal Transport", unit: "LEA-4421", settlement: "Per mile", status: "Assigned" },
    { name: "Ravi Haulage", unit: "LES-1180", settlement: "Percentage", status: "Available" }
  ]),
  screen("parties", "brokers", "Brokers", "Capacity", "Brokers who cover a lane Lane does not run.", [
    text("name", "Name", true),
    text("lane", "Lane"),
    text("margin", "Margin note"),
    sel("status", "Status", active)
  ], [
    { name: "Sindh Cover", lane: "KHI-LHE-F", margin: "8% on spot", status: "Active" }
  ]),
  screen("parties", "agents", "Overseas agents", "Capacity", "Destination agents on forwarding files.", [
    text("name", "Name", true),
    text("port", "Port"),
    text("profitShare", "Profit share"),
    text("email", "Email")
  ], [
    { name: "Eastgate Agents", port: "Felixstowe", profitShare: "50/50 destination", email: "ops@eastgate.example" },
    { name: "Creek Agents", port: "Jebel Ali", profitShare: "40% origin", email: "desk@creek.example", _tenant: "gulf" }
  ]),
  screen("parties", "vendors", "Vendors", "Capacity", "Fuel, tyres, and warehouse consumables.", [
    text("name", "Name", true),
    sel("category", "Category", ["Fuel", "Parts", "Packaging", "Labour"]),
    text("city", "City"),
    sel("status", "Status", active)
  ], [
    { name: "PSO Fleet", category: "Fuel", city: "Lahore", status: "Active" },
    { name: "PackRight", category: "Packaging", city: "Karachi", status: "Active" }
  ]),
  screen("parties", "contacts", "Contacts", "People", "People behind the accounts.", [
    text("name", "Name", true),
    text("account", "Account"),
    text("role", "Role"),
    text("email", "Email"),
    text("phone", "Phone")
  ], [
    { name: "Ayesha Khan", account: "Northline Retail", role: "Logistics", email: "ayesha@northline.example", phone: "+92 300 110 2201" },
    { name: "Tom Reed", account: "Eastgate Agents", role: "Arrival desk", email: "tom@eastgate.example", phone: "+44 1394 600 220" }
  ]),
  screen("parties", "address-book", "Address book", "People", "Saved addresses with a quality flag.", [
    text("party", "Party", true),
    text("label", "Label"),
    text("city", "City"),
    sel("quality", "Quality", ["Verified", "Review", "Failed"]),
    sel("kind", "Kind", ["Pickup", "Delivery", "Billing"])
  ], [
    { party: "Northline Retail", label: "Gulberg DC", city: "Lahore", quality: "Verified", kind: "Pickup" },
    { party: "Northline Retail", label: "Karachi DC", city: "Karachi", quality: "Verified", kind: "Delivery" },
    { party: "Harbour Spice", label: "Old address", city: "Karachi", quality: "Failed", kind: "Delivery" }
  ]),
  screen("parties", "scorecards", "Scorecards", "Capacity", "On-time, claims, and cost by carrier.", [
    text("carrier", "Carrier", true),
    num("otp", "On-time %"),
    num("claims", "Claims ratio %"),
    money("costPerKm", "Cost per km"),
    text("period", "Period")
  ], [
    { carrier: "Indus Linehaul", otp: "96", claims: "0.4", costPerKm: "86", period: "Sep 2026" },
    { carrier: "North Sea Box", otp: "88", claims: "1.1", costPerKm: "0", period: "Q3 2026" }
  ]),

  screen("catalog", "equipment", "Equipment types", "Assets", "The box or body the freight needs.", [
    text("name", "Name", true),
    sel("mode", "Mode", ["Road", "Ocean", "Air"]),
    num("maxKg", "Max kg"),
    num("cubeM3", "Cube m3")
  ], [
    { name: "12m trailer", mode: "Road", maxKg: "24000", cubeM3: "76" },
    { name: "40HC", mode: "Ocean", maxKg: "26000", cubeM3: "76" },
    { name: "Sprinter", mode: "Road", maxKg: "1200", cubeM3: "11" }
  ]),
  screen("catalog", "vehicle-types", "Vehicle types", "Assets", "Power units dispatch can assign.", [
    text("name", "Name", true),
    num("axles", "Axles"),
    sel("endorsement", "Endorsement", ["Car", "HTV", "Hazmat"]),
    sel("status", "Status", active)
  ], [
    { name: "Prime mover", axles: "3", endorsement: "HTV", status: "Active" },
    { name: "1-ton van", axles: "2", endorsement: "Car", status: "Active" }
  ]),
  screen("catalog", "container-types", "Container types", "Assets", "Ocean and rail boxes.", [
    text("iso", "ISO", true),
    text("name", "Name"),
    num("tareKg", "Tare kg"),
    num("payloadKg", "Payload kg")
  ], [
    { iso: "45G1", name: "40HC", tareKg: "3900", payloadKg: "28600" },
    { iso: "22G1", name: "20GP", tareKg: "2300", payloadKg: "28200" }
  ]),
  screen("catalog", "commodities", "Commodities", "Goods", "What is allowed to move, and how it is handled.", [
    text("name", "Name", true),
    sel("temp", "Temperature", ["Ambient", "Chill", "Frozen"]),
    sel("dg", "Dangerous goods", yesNo),
    sel("prohibited", "Prohibited", yesNo)
  ], [
    { name: "Apparel", temp: "Ambient", dg: "No", prohibited: "No" },
    { name: "Home textiles", temp: "Ambient", dg: "No", prohibited: "No" },
    { name: "Lithium devices", temp: "Ambient", dg: "Yes", prohibited: "No" },
    { name: "Waste oil", temp: "Ambient", dg: "Yes", prohibited: "Yes" }
  ]),
  screen("catalog", "hs-codes", "HS codes", "Goods", "Classification used on the customs entry.", [
    text("code", "Code", true),
    text("description", "Description"),
    num("dutyPct", "Duty %"),
    text("commodity", "Commodity")
  ], [
    { code: "6204.62", description: "Women's cotton trousers", dutyPct: "20", commodity: "Apparel" },
    { code: "6302.21", description: "Printed bed linen", dutyPct: "12", commodity: "Home textiles" }
  ]),
  screen("catalog", "dg-classes", "DG classes", "Goods", "Dangerous goods classes the desk will accept with a declaration.", [
    text("class", "Class", true),
    text("name", "Name"),
    sel("accepted", "Accepted", yesNo),
    area("rule", "Handling rule")
  ], [
    { class: "9", name: "Miscellaneous", accepted: "Yes", rule: "UN3481 needs the battery declaration." },
    { class: "3", name: "Flammable liquids", accepted: "No", rule: "Refuse unless a permit is on the file." }
  ]),
  screen("catalog", "packaging", "Packaging", "Goods", "How pieces are presented.", [
    text("name", "Name", true),
    num("tareKg", "Tare kg"),
    sel("stackable", "Stackable", yesNo)
  ], [
    { name: "Carton", tareKg: "0.4", stackable: "Yes" },
    { name: "Pallet", tareKg: "18", stackable: "Yes" },
    { name: "Crate", tareKg: "12", stackable: "No" }
  ]),
  screen("catalog", "units", "Units", "Reference", "Units of measure.", [
    text("code", "Code", true),
    text("name", "Name"),
    sel("kind", "Kind", ["Weight", "Length", "Volume", "Each"])
  ], [
    { code: "KG", name: "Kilogram", kind: "Weight" },
    { code: "CBM", name: "Cubic metre", kind: "Volume" },
    { code: "PCS", name: "Piece", kind: "Each" }
  ]),
  screen("catalog", "incoterms", "Incoterms", "Reference", "Who does what on an international file.", [
    text("code", "Code", true),
    text("name", "Name"),
    area("seller", "Seller does"),
    area("buyer", "Buyer does")
  ], [
    { code: "FOB", name: "Free on board", seller: "Export clearance and load on vessel.", buyer: "Freight, insurance, import." },
    { code: "DDP", name: "Delivered duty paid", seller: "All the way, duties included.", buyer: "Unload if the contract says so." },
    { code: "EXW", name: "Ex works", seller: "Make goods available.", buyer: "Everything after the door." }
  ]),
  screen("catalog", "services", "Service products", "Products", "The products a customer can buy.", [
    text("name", "Name", true),
    sel("mode", "Mode", ["Parcel", "Courier", "LTL", "FTL", "Air", "Ocean", "Rail", "Returns"]),
    text("promise", "Promise"),
    sel("status", "Status", active)
  ], [
    { name: "Same-day city", mode: "Courier", promise: "By 21:00", status: "Active" },
    { name: "Express economy", mode: "Parcel", promise: "2 days", status: "Active" },
    { name: "Full truck", mode: "FTL", promise: "Window", status: "Active" },
    { name: "FCL ocean", mode: "Ocean", promise: "Schedule", status: "Active" },
    { name: "White glove", mode: "Courier", promise: "Appointment", status: "Active" },
    { name: "Returns", mode: "Returns", promise: "5 days", status: "Active" }
  ]),
  screen("catalog", "charge-codes", "Charge codes", "Money", "The language of the invoice.", [
    text("code", "Code", true),
    text("name", "Name"),
    sel("side", "Side", ["Sell", "Buy", "Both"]),
    sel("taxable", "Taxable", yesNo)
  ], [
    { code: "FRT", name: "Freight", side: "Both", taxable: "Yes" },
    { code: "FSC", name: "Fuel", side: "Both", taxable: "Yes" },
    { code: "COD", name: "Cash on delivery", side: "Sell", taxable: "No" },
    { code: "STO", name: "Storage", side: "Sell", taxable: "Yes" }
  ]),
  screen("catalog", "accessorials", "Accessorial catalog", "Money", "Extras that rating can add.", [
    text("name", "Name", true),
    sel("basis", "Basis", ["Flat", "Percent", "Per hour", "Per day"]),
    money("defaultAmount", "Default"),
    sel("status", "Status", active)
  ], [
    { name: "Fuel surcharge", basis: "Percent", defaultAmount: "18", status: "Active" },
    { name: "Residential", basis: "Flat", defaultAmount: "450", status: "Active" },
    { name: "Liftgate", basis: "Flat", defaultAmount: "1500", status: "Active" },
    { name: "Inside delivery", basis: "Flat", defaultAmount: "2000", status: "Active" },
    { name: "Appointment", basis: "Flat", defaultAmount: "800", status: "Active" },
    { name: "Remote area", basis: "Flat", defaultAmount: "1200", status: "Active" },
    { name: "Weekend", basis: "Flat", defaultAmount: "2500", status: "Active" },
    { name: "Hazmat", basis: "Flat", defaultAmount: "3500", status: "Active" },
    { name: "Oversize", basis: "Flat", defaultAmount: "4000", status: "Active" },
    { name: "Reweigh", basis: "Flat", defaultAmount: "300", status: "Active" },
    { name: "Address correction", basis: "Flat", defaultAmount: "250", status: "Active" },
    { name: "Detention", basis: "Per hour", defaultAmount: "1800", status: "Active" },
    { name: "Demurrage", basis: "Per day", defaultAmount: "8500", status: "Active" },
    { name: "Layover", basis: "Flat", defaultAmount: "6000", status: "Active" },
    { name: "Storage", basis: "Per day", defaultAmount: "220", status: "Active" },
    { name: "Waiting time", basis: "Per hour", defaultAmount: "900", status: "Active" }
  ]),
  screen("catalog", "taxes", "Tax codes", "Money", "Tax applied on taxable charges.", [
    text("code", "Code", true),
    text("name", "Name"),
    num("rate", "Rate %")
  ], [
    { code: "GST-18", name: "Sales tax", rate: "18" },
    { code: "VAT-5", name: "UAE VAT", rate: "5" }
  ]),
  screen("catalog", "currencies", "Currencies", "Money", "Rates against the company currency.", [
    text("code", "Code", true),
    text("name", "Name"),
    num("perPkr", "Units per PKR"),
    date("asOf", "As of")
  ], [
    { code: "PKR", name: "Pakistani rupee", perPkr: "1", asOf: "2026-09-01" },
    { code: "USD", name: "US dollar", perPkr: "0.0036", asOf: "2026-09-01" },
    { code: "GBP", name: "Pound", perPkr: "0.0027", asOf: "2026-09-01" },
    { code: "AED", name: "Dirham", perPkr: "0.013", asOf: "2026-09-01" }
  ]),
  screen("catalog", "reasons", "Reason codes", "Reference", "Why something was late, refused, or claimed.", [
    text("code", "Code", true),
    sel("usedOn", "Used on", ["Delay", "Exception", "Claim", "Cancel", "Attempt"]),
    text("label", "Label")
  ], [
    { code: "WX", usedOn: "Delay", label: "Weather" },
    { code: "NS", usedOn: "Exception", label: "Missing scan" },
    { code: "DMG", usedOn: "Claim", label: "Damage" },
    { code: "ATT", usedOn: "Attempt", label: "No one home" },
    { code: "CXC", usedOn: "Cancel", label: "Customer cancelled" }
  ]),
  screen("catalog", "slas", "SLA policies", "Reference", "Clocks for delivery and for service cases.", [
    text("name", "Name", true),
    sel("appliesTo", "Applies to", ["Shipment", "Case", "Quote"]),
    num("hours", "Hours"),
    sel("status", "Status", active)
  ], [
    { name: "Express delivery", appliesTo: "Shipment", hours: "48", status: "Active" },
    { name: "Case first response", appliesTo: "Case", hours: "4", status: "Active" },
    { name: "Quote turnaround", appliesTo: "Quote", hours: "8", status: "Active" }
  ]),
  screen("catalog", "document-types", "Document types", "Reference", "Papers a file can hold.", [
    text("name", "Name", true),
    sel("mode", "Mode", ["All", "Road", "Air", "Ocean"]),
    sel("required", "Often required", yesNo)
  ], [
    { name: "Waybill", mode: "All", required: "Yes" },
    { name: "Bill of lading", mode: "Ocean", required: "Yes" },
    { name: "Air waybill", mode: "Air", required: "Yes" },
    { name: "CMR", mode: "Road", required: "No" },
    { name: "Commercial invoice", mode: "All", required: "Yes" },
    { name: "Packing list", mode: "All", required: "Yes" },
    { name: "Certificate of origin", mode: "Ocean", required: "No" },
    { name: "POD", mode: "All", required: "Yes" }
  ]),
  screen("catalog", "numbering", "Numbering series", "Reference", "How new documents are numbered.", [
    text("series", "Series", true),
    text("prefix", "Prefix"),
    num("next", "Next number"),
    text("branch", "Branch")
  ], [
    { series: "Waybill", prefix: "LN-", next: "10050", branch: "All" },
    { series: "File", prefix: "LF-", next: "2410", branch: "Karachi" },
    { series: "Invoice", prefix: "INV-", next: "24100", branch: "Karachi" },
    { series: "Claim", prefix: "CLM-", next: "110", branch: "All" }
  ]),

  screen("bookings", "quotes", "Quotes", "Sell", "Spot, contract, and customer rate requests.", [
    text("number", "Quote", true),
    text("customer", "Customer"),
    sel("kind", "Kind", ["Spot", "Contract", "Customer request"]),
    text("lane", "Lane"),
    sel("mode", "Mode", ["Parcel", "LTL", "FTL", "Air", "Ocean"]),
    money("sell", "Sell"),
    money("buy", "Buy"),
    sel("status", "Status", ["Requested", "Issued", "Won", "Lost", "Expired"])
  ], [
    { number: "Q-8841", customer: "Northline Retail", kind: "Contract", lane: "Lahore → Karachi", mode: "Parcel", sell: "1850", buy: "1200", status: "Won" },
    { number: "Q-8902", customer: "Atlas Home", kind: "Spot", lane: "Karachi → Felixstowe", mode: "Ocean", sell: "410000", buy: "340000", status: "Issued" },
    { number: "Q-9010", customer: "Harbour Spice", kind: "Customer request", lane: "Karachi → Lahore", mode: "FTL", sell: "145000", buy: "128000", status: "Requested" }
  ]),
  screen("bookings", "shipments", "Shipments", "Execute", "The operational order everything else hangs from.", [
    text("waybill", "Waybill", true),
    text("orderRef", "Order"),
    text("customer", "Customer"),
    sel("mode", "Mode", ["Parcel", "Courier", "LTL", "FTL", "Air", "Ocean", "Rail"]),
    sel("service", "Service", ["Same-day", "Express economy", "Full truck", "FCL ocean", "White glove", "Returns"]),
    text("origin", "Origin"),
    text("destination", "Destination"),
    text("shipper", "Shipper"),
    text("consignee", "Consignee"),
    num("pieces", "Pieces"),
    num("weightKg", "Weight kg"),
    num("chargeableKg", "Chargeable kg"),
    sel("billing", "Billing", ["Prepaid", "Collect", "Third party"]),
    money("cod", "COD"),
    money("declaredValue", "Declared value"),
    sel("insurance", "Insurance", yesNo),
    text("container", "Container"),
    text("po", "PO"),
    sel("status", "Status", ["Booked", "Picked up", "In transit", "Out for delivery", "Delivered", "Late", "Exception", "Customs hold", "Credit hold", "Cancelled"]),
    date("eta", "ETA")
  ], [
    { waybill: "LN-10021", orderRef: "SO-5521", customer: "Northline Retail", mode: "Parcel", service: "Express economy", origin: "Lahore", destination: "Karachi", shipper: "Northline Gulberg", consignee: "Northline Karachi DC", pieces: "4", weightKg: "18", chargeableKg: "22", billing: "Prepaid", cod: "0", declaredValue: "85000", insurance: "Yes", container: "", po: "PO-1902", status: "Late", eta: "2026-09-27" },
    { waybill: "LN-10044", orderRef: "SO-5602", customer: "Atlas Home", mode: "FTL", service: "Full truck", origin: "Karachi", destination: "Lahore", shipper: "Atlas Korangi", consignee: "Northline Karachi DC", pieces: "18", weightKg: "6400", chargeableKg: "6400", billing: "Prepaid", cod: "0", declaredValue: "2400000", insurance: "Yes", container: "", po: "PO-2044", status: "In transit", eta: "2026-09-29" },
    { waybill: "LN-24081", orderRef: "SO-5701", customer: "Atlas Home", mode: "Ocean", service: "FCL ocean", origin: "Karachi", destination: "Felixstowe", shipper: "Atlas Korangi", consignee: "Felixstowe DC", pieces: "1", weightKg: "18400", chargeableKg: "18400", billing: "Third party", cod: "0", declaredValue: "12000000", insurance: "Yes", container: "MSCU1234567", po: "PO-UK-14", status: "Customs hold", eta: "2026-10-23" },
    { waybill: "LN-55002", orderRef: "DXB-19", customer: "Gulf Retail", mode: "Air", service: "Express economy", origin: "Dubai", destination: "Karachi", shipper: "Gulf Retail", consignee: "Atlas Korangi", pieces: "2", weightKg: "40", chargeableKg: "40", billing: "Prepaid", cod: "0", declaredValue: "22000", insurance: "No", container: "", po: "GR-19", status: "Booked", eta: "2026-09-30", _tenant: "gulf" }
  ]),
  screen("bookings", "pickups", "Pickup requests", "Execute", "When and where the freight is collected.", [
    text("number", "Pickup", true),
    text("waybill", "Waybill"),
    text("window", "Window"),
    text("address", "Address"),
    sel("status", "Status", ["Requested", "Assigned", "Collected", "Failed"])
  ], [
    { number: "PU-331", waybill: "LN-10021", window: "2026-09-26 10:00-12:00", address: "Gulberg DC", status: "Collected" },
    { number: "PU-348", waybill: "LN-10044", window: "2026-09-28 08:00-10:00", address: "Korangi", status: "Collected" }
  ]),
  screen("bookings", "pieces", "Pieces", "Execute", "Piece weights and dimensions. Chargeable weight is stored on the shipment.", [
    text("waybill", "Waybill", true),
    text("piece", "Piece"),
    num("lengthCm", "L cm"),
    num("widthCm", "W cm"),
    num("heightCm", "H cm"),
    num("actualKg", "Actual kg"),
    num("volumetricKg", "Volumetric kg")
  ], [
    { waybill: "LN-10021", piece: "1 of 4", lengthCm: "40", widthCm: "30", heightCm: "20", actualKg: "4", volumetricKg: "4.8" },
    { waybill: "LN-10021", piece: "2 of 4", lengthCm: "50", widthCm: "40", heightCm: "30", actualKg: "6", volumetricKg: "12" }
  ]),
  screen("bookings", "templates", "Templates", "Repeat", "A booking the customer or desk can reuse.", [
    text("name", "Name", true),
    text("customer", "Customer"),
    text("lane", "Lane"),
    sel("mode", "Mode", ["Parcel", "FTL", "Ocean"]),
    sel("status", "Status", active)
  ], [
    { name: "Weekly apparel", customer: "Northline Retail", lane: "Lahore → Karachi", mode: "Parcel", status: "Active" }
  ]),
  screen("bookings", "recurring", "Recurring orders", "Repeat", "Standing orders with a next run date.", [
    text("name", "Name", true),
    text("customer", "Customer"),
    sel("every", "Every", ["Day", "Week", "Month"]),
    date("nextRun", "Next run"),
    sel("status", "Status", ["Active", "Paused"])
  ], [
    { name: "Atlas replenishment", customer: "Atlas Home", every: "Week", nextRun: "2026-10-02", status: "Active" }
  ]),
  screen("bookings", "holds", "Holds", "Change", "Credit, customs, or customer holds on a live shipment.", [
    text("waybill", "Waybill", true),
    sel("reason", "Reason", ["Credit", "Customs", "Customer", "Damage"]),
    date("since", "Since"),
    sel("status", "Status", ["Open", "Released"])
  ], [
    { waybill: "LN-24081", reason: "Customs", since: "2026-09-20", status: "Open" },
    { waybill: "LN-09910", reason: "Credit", since: "2026-09-18", status: "Open" }
  ]),
  screen("bookings", "amendments", "Amendments", "Change", "Changes that keep the original waybill.", [
    text("waybill", "Waybill", true),
    sel("change", "Change", ["Address", "Weight", "Service", "Split", "Cancel"]),
    text("from", "From"),
    text("to", "To"),
    sel("status", "Status", ["Pending", "Applied"])
  ], [
    { waybill: "LN-10021", change: "Address", from: "Dock 1", to: "Dock 3", status: "Applied" },
    { waybill: "LN-10044", change: "Split", from: "1 load", to: "Load plus tail", status: "Pending" }
  ]),
  screen("bookings", "import", "Bulk import", "Repeat", "Paste a CSV of shipments. The desk creates the rows.", [], [], { kind: "import" }),

  screen("rating", "tariffs", "Tariffs", "Price", "Sell and buy by lane, with a minimum and a basis.", [
    text("name", "Name", true),
    sel("mode", "Mode", ["Parcel", "LTL", "FTL", "Air", "Ocean"]),
    text("lane", "Lane"),
    sel("basis", "Basis", ["Per kg", "Weight break", "Per km", "Per pallet", "Per container", "Per piece", "Cube"]),
    money("minimum", "Minimum"),
    money("rate", "Rate"),
    money("carrierCost", "Carrier cost"),
    num("markupPct", "Markup %"),
    num("marginFloor", "Margin floor %"),
    num("fuelPct", "Fuel %"),
    num("dimFactor", "Dim factor"),
    text("currency", "Currency"),
    date("effective", "Effective"),
    date("expires", "Expires")
  ], [
    { name: "North apparel", mode: "Parcel", lane: "Lahore → Karachi", basis: "Per kg", minimum: "900", rate: "85", carrierCost: "55", markupPct: "35", marginFloor: "18", fuelPct: "18", dimFactor: "5000", currency: "PKR", effective: "2026-07-01", expires: "2026-12-31" },
    { name: "Indus FTL", mode: "FTL", lane: "Karachi → Lahore", basis: "Per km", minimum: "90000", rate: "95", carrierCost: "78", markupPct: "12", marginFloor: "8", fuelPct: "22", dimFactor: "0", currency: "PKR", effective: "2026-08-01", expires: "2026-12-31" },
    { name: "Felixstowe FCL", mode: "Ocean", lane: "Karachi → Felixstowe", basis: "Per container", minimum: "380000", rate: "410000", carrierCost: "340000", markupPct: "15", marginFloor: "10", fuelPct: "12", dimFactor: "0", currency: "PKR", effective: "2026-09-01", expires: "2026-11-30" }
  ]),
  screen("rating", "rate-shop", "Rate shop", "Price", "Compare modes and carriers for a weight and a lane.", [], [], { kind: "rateshop" }),
  screen("rating", "confirmations", "Rate confirmations", "Price", "The figure frozen for the customer and the carrier.", [
    text("number", "Confirmation", true),
    text("waybill", "Waybill"),
    money("sell", "Sell"),
    money("buy", "Buy"),
    sel("status", "Status", ["Draft", "Sent", "Signed"])
  ], [
    { number: "RC-10021", waybill: "LN-10021", sell: "1870", buy: "1210", status: "Signed" },
    { number: "RC-24081", waybill: "LN-24081", sell: "410000", buy: "340000", status: "Sent" }
  ]),
  screen("rating", "fuel", "Fuel surcharge", "Price", "The index behind the fuel percent.", [
    text("name", "Name", true),
    text("index", "Index"),
    num("percent", "Percent"),
    date("effective", "Effective")
  ], [
    { name: "Road Pakistan", index: "PSO diesel", percent: "18", effective: "2026-09-01" },
    { name: "Ocean BAF", index: "Bunker", percent: "12", effective: "2026-09-01" }
  ]),
  screen("rating", "dim-factors", "Dim factors", "Price", "Volumetric divisors by mode.", [
    sel("mode", "Mode", ["Parcel", "Air", "Road", "Ocean"], true),
    num("divisor", "Divisor"),
    text("unit", "Unit")
  ], [
    { mode: "Parcel", divisor: "5000", unit: "cm / kg" },
    { mode: "Air", divisor: "6000", unit: "cm / kg" },
    { mode: "Road", divisor: "3000", unit: "cm / kg" }
  ]),
  screen("rating", "price-lists", "Customer price lists", "Price", "A tariff pinned to one customer.", [
    text("customer", "Customer", true),
    text("tariff", "Tariff"),
    num("discountPct", "Discount %"),
    date("expires", "Expires")
  ], [
    { customer: "Northline Retail", tariff: "North apparel", discountPct: "5", expires: "2026-12-31" }
  ]),

  screen("dispatch", "load-board", "Load board", "Plan", "Open freight waiting for a truck or a flight.", [
    text("load", "Load", true),
    text("lane", "Lane"),
    num("weightKg", "Weight kg"),
    num("cubeM3", "Cube m3"),
    num("pieces", "Pieces"),
    num("pallets", "Pallets"),
    sel("status", "Status", ["Open", "Planned", "Tendered", "Covered"])
  ], [
    { load: "LD-778", lane: "Karachi → Lahore", weightKg: "6400", cubeM3: "28", pieces: "18", pallets: "12", status: "Covered" },
    { load: "LD-781", lane: "Lahore → Karachi", weightKg: "2100", cubeM3: "14", pieces: "40", pallets: "8", status: "Open" }
  ]),
  screen("dispatch", "loads", "Loads", "Plan", "Built loads with capacity left.", [
    text("load", "Load", true),
    text("equipment", "Equipment"),
    num("axles", "Axles"),
    num("usedKg", "Used kg"),
    num("capKg", "Cap kg"),
    text("waybills", "Waybills"),
    sel("status", "Status", ["Building", "Ready", "Dispatched"])
  ], [
    { load: "LD-778", equipment: "12m trailer", axles: "5", usedKg: "6400", capKg: "24000", waybills: "LN-10044", status: "Dispatched" },
    { load: "LD-790", equipment: "Sprinter", axles: "2", usedKg: "180", capKg: "1200", waybills: "LN-10021", status: "Ready" }
  ]),
  screen("dispatch", "tenders", "Tenders", "Tender", "Offer, accept, reject, expire, retender.", [
    text("tender", "Tender", true),
    text("load", "Load"),
    text("carrier", "Carrier"),
    money("buy", "Buy"),
    date("expires", "Expires"),
    sel("status", "Status", ["Offered", "Accepted", "Rejected", "Expired", "Retendered"])
  ], [
    { tender: "TD-441", load: "LD-778", carrier: "Indus Linehaul", buy: "128000", expires: "2026-09-28", status: "Accepted" },
    { tender: "TD-442", load: "LD-781", carrier: "Sindh Cover", buy: "96000", expires: "2026-09-29", status: "Offered" },
    { tender: "TD-438", load: "LD-770", carrier: "Ravi Haulage", buy: "88000", expires: "2026-09-20", status: "Expired" }
  ]),
  screen("dispatch", "routes", "Routes", "Run", "Sequenced stops for a driver.", [
    text("route", "Route", true),
    text("driver", "Driver"),
    text("vehicle", "Vehicle"),
    text("stop", "Stop"),
    text("waybill", "Waybill"),
    text("window", "Window"),
    sel("status", "Status", ["Planned", "Arrived", "Completed", "Failed"])
  ], [
    { route: "RT-19", driver: "Sami Raza", vehicle: "LEA-4421", stop: "Korangi pickup", waybill: "LN-10044", window: "08:00-10:00", status: "Completed" },
    { route: "RT-19", driver: "Sami Raza", vehicle: "LEA-4421", stop: "Sundar hub", waybill: "LN-10044", window: "14:00-16:00", status: "Arrived" },
    { route: "RT-22", driver: "Sami Raza", vehicle: "LES-220", stop: "Gulberg delivery", waybill: "LN-10021", window: "11:00-13:00", status: "Failed" }
  ]),
  screen("dispatch", "waves", "Waves", "Run", "Last-mile waves released to depots.", [
    text("wave", "Wave", true),
    text("depot", "Depot"),
    num("stops", "Stops"),
    sel("status", "Status", ["Building", "Released", "Closed"])
  ], [
    { wave: "WV-09-28-A", depot: "Gulberg depot", stops: "42", status: "Released" },
    { wave: "WV-09-28-B", depot: "Clifton counter", stops: "17", status: "Building" }
  ]),
  screen("dispatch", "appointments", "Appointments", "Dock", "Time windows promised to a consignee or a dock.", [
    text("ref", "Reference", true),
    text("site", "Site"),
    text("window", "Window"),
    sel("kind", "Kind", ["Delivery", "Pickup", "Live load", "Drop"]),
    sel("status", "Status", ["Booked", "Arrived", "Missed"])
  ], [
    { ref: "AP-10044", site: "Sundar hub", window: "2026-09-29 06:00", kind: "Live load", status: "Booked" },
    { ref: "AP-10021", site: "Northline Karachi DC", window: "2026-09-27 15:00", kind: "Delivery", status: "Missed" }
  ]),
  screen("dispatch", "dock", "Dock calendar", "Dock", "Doors and what is on them.", [
    text("door", "Door", true),
    text("site", "Site"),
    text("load", "Load"),
    text("start", "Start"),
    sel("status", "Status", ["Free", "Occupied", "Blocked"])
  ], [
    { door: "KHI-03", site: "Korangi", load: "LD-778", start: "2026-09-28 08:00", status: "Occupied" },
    { door: "LHE-01", site: "Sundar hub", load: "", start: "", status: "Free" }
  ]),
  screen("dispatch", "yard", "Yard check-in", "Dock", "Gate events that start detention.", [
    text("visit", "Visit", true),
    text("unit", "Unit"),
    text("trailer", "Trailer"),
    text("gateIn", "Gate in"),
    text("gateOut", "Gate out"),
    sel("status", "Status", ["In yard", "Spotted", "Departed"])
  ], [
    { visit: "YD-902", unit: "LEA-4421", trailer: "TRL-18", gateIn: "2026-09-28 07:40", gateOut: "", status: "In yard" }
  ]),

  screen("visibility", "milestones", "Milestones", "Events", "The chain from booked to delivered.", [
    text("waybill", "Waybill", true),
    sel("event", "Event", ["Booked", "Picked up", "Departed origin", "Hub in", "Sorted", "Hub out", "Out for delivery", "Attempted", "Delivered", "Exception", "Return to sender"]),
    text("location", "Location"),
    text("at", "When"),
    text("exception", "Exception"),
    area("note", "Note")
  ], [
    { waybill: "LN-10021", event: "Picked up", location: "Lahore", at: "2026-09-26 11:10", exception: "", note: "Four cartons." },
    { waybill: "LN-10021", event: "Departed origin", location: "Sundar hub", at: "2026-09-26 22:40", exception: "", note: "Linehaul south." },
    { waybill: "LN-10021", event: "Exception", location: "Karachi", at: "2026-09-28 09:00", exception: "Missing scan", note: "No hub-in scan after 30 hours." },
    { waybill: "LN-10044", event: "Picked up", location: "Karachi", at: "2026-09-28 09:20", exception: "", note: "Seal intact." },
    { waybill: "LN-10044", event: "Departed origin", location: "Karachi", at: "2026-09-28 11:05", exception: "", note: "Driver Sami Raza." },
    { waybill: "LN-24081", event: "Booked", location: "Karachi", at: "2026-09-18 12:00", exception: "", note: "FCL apparel." },
    { waybill: "LN-24081", event: "Exception", location: "Karachi", at: "2026-09-20 16:00", exception: "Customs hold", note: "Entry waiting on licence." }
  ]),
  screen("visibility", "scans", "Scan events", "Events", "Barcode scans at pickup, hub, and door.", [
    text("waybill", "Waybill", true),
    sel("scan", "Scan", ["Pickup", "Hub in", "Sort", "Hub out", "Out for delivery", "POD"]),
    text("where", "Where"),
    text("at", "When"),
    text("lat", "Latitude"),
    text("lng", "Longitude"),
    text("geofence", "Geofence")
  ], [
    { waybill: "LN-10021", scan: "Pickup", where: "Gulberg", at: "2026-09-26 11:10", lat: "31.5204", lng: "74.3587", geofence: "Gulberg depot" },
    { waybill: "LN-10044", scan: "Pickup", where: "Korangi", at: "2026-09-28 09:20", lat: "24.8607", lng: "67.0011", geofence: "Korangi sort" },
    { waybill: "LN-10044", scan: "Hub out", where: "Karachi", at: "2026-09-28 11:05", lat: "24.91", lng: "67.12", geofence: "M9 gate" }
  ]),
  screen("visibility", "tracking", "Tracking", "Watch", "A simulated trail for the waybills currently moving.", [
    text("waybill", "Waybill", true),
    text("last", "Last event"),
    text("eta", "ETA"),
    text("lat", "Latitude"),
    text("lng", "Longitude")
  ], [
    { waybill: "LN-10021", last: "Exception · missing scan", eta: "2026-09-27", lat: "25.4", lng: "68.3" },
    { waybill: "LN-10044", last: "Departed Karachi", eta: "2026-09-29", lat: "27.2", lng: "68.9" },
    { waybill: "LN-24081", last: "Customs hold", eta: "2026-10-23", lat: "24.77", lng: "67.33" }
  ]),
  screen("visibility", "pod", "Proof of delivery", "Prove", "Signature, photo, OTP, and where it was signed.", [], [], { kind: "pod" }),
  screen("visibility", "exceptions", "Exceptions", "Watch", "What the tower is shouting about.", [
    text("waybill", "Waybill", true),
    sel("kind", "Kind", ["Late", "Dwell", "Missing scan", "Failed delivery", "Customs hold", "Credit hold"]),
    text("since", "Since"),
    text("owner", "Owner"),
    sel("status", "Status", ["Open", "Watching", "Closed"])
  ], [
    { waybill: "LN-10021", kind: "Late", since: "2026-09-27 18:00", owner: "Bilal Khan", status: "Open" },
    { waybill: "LN-10021", kind: "Missing scan", since: "2026-09-28 09:00", owner: "Nadia Rahman", status: "Open" },
    { waybill: "LN-24081", kind: "Customs hold", since: "2026-09-20 16:00", owner: "Amina Shah", status: "Open" },
    { waybill: "LN-09910", kind: "Credit hold", since: "2026-09-18 09:00", owner: "Mariam Ali", status: "Watching" },
    { waybill: "LN-10008", kind: "Failed delivery", since: "2026-09-25 17:40", owner: "Hira Noor", status: "Open" }
  ]),
  screen("visibility", "tower", "Control tower", "Watch", "Late, dwell, missing scans, and holds in one queue.", [], [], { kind: "tower" }),
  screen("visibility", "containers", "Containers", "Watch", "Box, vessel, voyage, and the last milestone.", [
    text("container", "Container", true),
    text("waybill", "Waybill"),
    text("vessel", "Vessel"),
    text("voyage", "Voyage"),
    text("seal", "Seal"),
    sel("milestone", "Milestone", ["Booked", "Gated in", "Loaded", "On board", "Discharged", "Hold"])
  ], [
    { container: "MSCU1234567", waybill: "LN-24081", vessel: "Crescent Bay", voyage: "2408E", seal: "SL-883311", milestone: "Hold" }
  ]),
  screen("visibility", "alerts", "Alerts", "Tell", "Messages the desk sent, including simulated SMS and WhatsApp.", [
    text("waybill", "Waybill", true),
    sel("channel", "Channel", ["Email", "SMS", "WhatsApp", "In-app"]),
    text("to", "To"),
    text("event", "Event"),
    sel("result", "Result", ["Simulated", "Queued", "Read"])
  ], [
    { waybill: "LN-10021", channel: "WhatsApp", to: "Northline control", event: "Late", result: "Simulated" },
    { waybill: "LN-10044", channel: "SMS", to: "Sami Raza", event: "Out for delivery", result: "Simulated" }
  ]),
  screen("visibility", "driver", "Today's stops", "Road", "The phone page a driver uses for the day's work.", [], [], { kind: "driver" }),

  screen("fleet", "power-units", "Power units", "Assets", "Trucks, with the dates that make them legal.", [
    text("unit", "Unit", true),
    text("type", "Type"),
    date("registration", "Registration expires"),
    date("insurance", "Insurance expires"),
    date("inspection", "Inspection expires"),
    date("permit", "Permit expires"),
    sel("status", "Status", ["Available", "Assigned", "Shop"])
  ], [
    { unit: "LEA-4421", type: "Prime mover", registration: "2027-03-01", insurance: "2026-12-01", inspection: "2026-11-15", permit: "2027-01-20", status: "Assigned" },
    { unit: "LES-220", type: "1-ton van", registration: "2026-10-02", insurance: "2026-10-02", inspection: "2026-10-20", permit: "2027-04-01", status: "Available" }
  ]),
  screen("fleet", "trailers", "Trailers", "Assets", "Trailers and boxes that are not the power unit.", [
    text("unit", "Unit", true),
    sel("kind", "Kind", ["Trailer", "Container"]),
    text("type", "Type"),
    sel("status", "Status", ["Empty", "Loaded", "Shop"])
  ], [
    { unit: "TRL-18", kind: "Trailer", type: "12m", status: "Loaded" },
    { unit: "MSCU1234567", kind: "Container", type: "40HC", status: "Loaded" }
  ]),
  screen("fleet", "drivers", "Drivers", "People", "Licence, medical, and what they may pull.", [
    text("name", "Name", true),
    text("licence", "Licence"),
    sel("class", "Class", ["Car", "HTV", "Hazmat"]),
    date("medical", "Medical expires"),
    text("endorsements", "Endorsements"),
    sel("status", "Status", ["Available", "On trip", "Off"])
  ], [
    { name: "Sami Raza", licence: "HTV-22910", class: "HTV", medical: "2027-02-01", endorsements: "Artic", status: "On trip" },
    { name: "Faisal Mehmood", licence: "LTV-1002", class: "Car", medical: "2026-12-12", endorsements: "City", status: "Available" }
  ]),
  screen("fleet", "maintenance", "Maintenance", "Care", "Plans, work orders, parts, and downtime.", [
    text("order", "Order", true),
    text("unit", "Unit"),
    sel("kind", "Kind", ["Service", "Repair", "Inspection"]),
    text("parts", "Parts"),
    num("downtimeHours", "Downtime hours"),
    sel("status", "Status", ["Open", "In shop", "Closed"])
  ], [
    { order: "MO-118", unit: "LES-220", kind: "Service", parts: "Oil filter", downtimeHours: "4", status: "Open" }
  ]),
  screen("fleet", "fuel", "Fuel logs", "Care", "Litres, odometer, and the station.", [
    text("unit", "Unit", true),
    date("on", "Date"),
    num("litres", "Litres"),
    num("odometer", "Odometer"),
    text("station", "Station")
  ], [
    { unit: "LEA-4421", on: "2026-09-28", litres: "420", odometer: "188420", station: "PSO Sundar" }
  ]),
  screen("fleet", "incidents", "Incidents", "Care", "Accidents and near misses.", [
    text("ref", "Reference", true),
    text("unit", "Unit"),
    date("on", "Date"),
    sel("kind", "Kind", ["Accident", "Near miss", "Theft"]),
    sel("status", "Status", ["Open", "Insurer", "Closed"])
  ], [
    { ref: "INC-14", unit: "LEA-4421", on: "2026-08-02", kind: "Near miss", status: "Closed" }
  ]),
  screen("fleet", "hos", "Hours of service", "People", "A simulated duty status. No tachograph is connected.", [
    text("driver", "Driver", true),
    sel("status", "Status", ["Off duty", "Sleeper", "Driving", "On duty"]),
    num("driveHours", "Drive hours today"),
    num("left", "Hours left")
  ], [
    { driver: "Sami Raza", status: "Driving", driveHours: "4.5", left: "4.5" },
    { driver: "Faisal Mehmood", status: "Off duty", driveHours: "0", left: "9" }
  ]),
  screen("fleet", "utilization", "Utilization", "Use", "Loaded miles against empty miles.", [
    text("unit", "Unit", true),
    num("loadedKm", "Loaded km"),
    num("emptyKm", "Empty km"),
    text("period", "Period")
  ], [
    { unit: "LEA-4421", loadedKm: "4200", emptyKm: "380", period: "Sep 2026" },
    { unit: "LES-220", loadedKm: "900", emptyKm: "210", period: "Sep 2026" }
  ]),

  screen("warehouse", "warehouses", "Warehouses", "Places", "Buildings the 3PL runs.", [
    text("code", "Code", true),
    text("name", "Name"),
    text("city", "City"),
    sel("status", "Status", active)
  ], [
    { code: "WH-KHI", name: "Korangi campus", city: "Karachi", status: "Active" },
    { code: "WH-LHE", name: "Sundar shed", city: "Lahore", status: "Active" }
  ]),
  screen("warehouse", "locations", "Locations", "Places", "Zones, aisles, and bins.", [
    text("code", "Code", true),
    text("warehouse", "Warehouse"),
    sel("kind", "Kind", ["Zone", "Aisle", "Bin", "Dock", "Quarantine"]),
    sel("status", "Status", ["Empty", "Occupied", "Blocked"])
  ], [
    { code: "A-01-04", warehouse: "WH-KHI", kind: "Bin", status: "Occupied" },
    { code: "Q-HOLD", warehouse: "WH-KHI", kind: "Quarantine", status: "Occupied" },
    { code: "DK-3", warehouse: "WH-KHI", kind: "Dock", status: "Empty" }
  ]),
  screen("warehouse", "asns", "ASNs", "Inbound", "Advance notice of what is coming.", [
    text("asn", "ASN", true),
    text("client", "Client"),
    text("eta", "ETA"),
    num("lines", "Lines"),
    sel("status", "Status", ["Expected", "Arrived", "Closed"])
  ], [
    { asn: "ASN-552", client: "Atlas Home", eta: "2026-09-29", lines: "12", status: "Expected" }
  ]),
  screen("warehouse", "receipts", "Receipts", "Inbound", "What was received, checked, and put away.", [
    text("grn", "Receipt", true),
    text("asn", "ASN"),
    sel("qc", "Quality", ["Pending", "Passed", "Failed"]),
    text("putaway", "Putaway"),
    sel("status", "Status", ["Open", "Put away"])
  ], [
    { grn: "GRN-220", asn: "ASN-540", qc: "Passed", putaway: "A-01-04", status: "Put away" }
  ]),
  screen("warehouse", "inventory", "Inventory", "Stock", "On hand by owner, lot, serial, and expiry.", [
    text("sku", "SKU", true),
    text("client", "Client"),
    text("location", "Location"),
    num("qty", "Qty"),
    text("lot", "Lot"),
    text("serial", "Serial"),
    date("expiry", "Expiry"),
    num("catchKg", "Catch weight kg"),
    sel("state", "State", ["Available", "Allocated", "Quarantine"])
  ], [
    { sku: "ATL-BED-Q", client: "Atlas Home", location: "A-01-04", qty: "240", lot: "L-19", serial: "", expiry: "2028-01-01", catchKg: "0", state: "Available" },
    { sku: "ATL-LAMP", client: "Atlas Home", location: "Q-HOLD", qty: "6", lot: "L-02", serial: "SN-1008", expiry: "", catchKg: "0", state: "Quarantine" }
  ]),
  screen("warehouse", "waves", "Waves", "Outbound", "Allocation released to the floor.", [
    text("wave", "Wave", true),
    text("client", "Client"),
    sel("method", "Method", ["Single", "Batch", "Zone", "Cluster"]),
    sel("status", "Status", ["Allocated", "Picking", "Packed"])
  ], [
    { wave: "WW-88", client: "Atlas Home", method: "Cluster", status: "Picking" }
  ]),
  screen("warehouse", "picks", "Picks", "Outbound", "The task a picker sees.", [
    text("task", "Task", true),
    text("sku", "SKU"),
    text("from", "From"),
    num("qty", "Qty"),
    text("picker", "Picker"),
    sel("status", "Status", ["Open", "Picked", "Short"])
  ], [
    { task: "PK-501", sku: "ATL-BED-Q", from: "A-01-04", qty: "12", picker: "Sana Iqbal", status: "Open" }
  ]),
  screen("warehouse", "packs", "Packs", "Outbound", "Cartons staged for dispatch.", [
    text("carton", "Carton", true),
    text("wave", "Wave"),
    text("waybill", "Waybill"),
    sel("stage", "Stage", ["Packing", "Staged", "Shipped"])
  ], [
    { carton: "CT-88-1", wave: "WW-88", waybill: "LN-10044", stage: "Staged" }
  ]),
  screen("warehouse", "counts", "Cycle counts", "Accuracy", "A bin, a full count, or a correction.", [
    text("count", "Count", true),
    sel("kind", "Kind", ["Cycle", "Full"]),
    text("location", "Location"),
    num("book", "Book"),
    num("found", "Found"),
    sel("status", "Status", ["Open", "Posted"])
  ], [
    { count: "CC-77", kind: "Cycle", location: "A-01-04", book: "240", found: "238", status: "Open" }
  ]),
  screen("warehouse", "adjustments", "Adjustments", "Accuracy", "Quantity changes with a reason.", [
    text("ref", "Reference", true),
    text("sku", "SKU"),
    num("qty", "Qty change"),
    text("reason", "Reason"),
    sel("status", "Status", ["Pending", "Posted"])
  ], [
    { ref: "ADJ-12", sku: "ATL-BED-Q", qty: "-2", reason: "Count CC-77", status: "Pending" }
  ]),
  screen("warehouse", "kits", "Kits", "Value add", "Components built into a sellable kit.", [
    text("kit", "Kit", true),
    text("components", "Components"),
    text("client", "Client"),
    sel("status", "Status", ["Open", "Built"])
  ], [
    { kit: "KIT-BED", components: "Linen + pillow", client: "Atlas Home", status: "Open" }
  ]),
  screen("warehouse", "vas", "Value-added services", "Value add", "Labelling, kitting, and other work to bill.", [
    text("job", "Job", true),
    sel("work", "Work", ["Label", "Kitting", "Gift wrap", "Repack"]),
    num("units", "Units"),
    money("rate", "Rate"),
    text("client", "Client")
  ], [
    { job: "VAS-19", work: "Label", units: "240", rate: "15", client: "Atlas Home" }
  ]),
  screen("warehouse", "cross-dock", "Cross-dock", "Value add", "Freight that is transferred, not stored.", [
    text("ref", "Reference", true),
    text("inbound", "Inbound"),
    text("outbound", "Outbound"),
    sel("status", "Status", ["Expected", "On door", "Left"])
  ], [
    { ref: "XD-14", inbound: "LN-24081 cartons", outbound: "LD-778", status: "Expected" }
  ]),
  screen("warehouse", "labor", "Labour standards", "Value add", "Minutes the engineer says a task should take.", [
    text("task", "Task", true),
    num("minutes", "Standard minutes"),
    text("unit", "Per")
  ], [
    { task: "Pick each", minutes: "0.4", unit: "Each" },
    { task: "Pack carton", minutes: "2", unit: "Carton" }
  ]),

  screen("forwarding", "files", "Shipment files", "File", "The forwarding job, with profit and the station that owns it.", [
    text("file", "File", true),
    text("customer", "Customer"),
    text("lane", "Lane"),
    sel("incoterm", "Incoterm", ["FOB", "DDP", "EXW", "CIF"]),
    text("branch", "Branch"),
    money("profit", "Profit"),
    sel("status", "Status", ["Open", "Pre-alert", "Arrived", "Closed"])
  ], [
    { file: "LF-2408", customer: "Atlas Home", lane: "Karachi → Felixstowe", incoterm: "FOB", branch: "Karachi", profit: "70000", status: "Open" }
  ]),
  screen("forwarding", "my-station", "My station", "File", "Files for the branch on your profile.", [], [], { kind: "station" }),
  screen("forwarding", "consols", "Consols", "File", "House shipments gathered under one master.", [
    text("consol", "Consol", true),
    text("master", "Master"),
    text("houses", "Houses"),
    sel("direction", "Direction", ["Consol", "Deconsol"]),
    sel("status", "Status", ["Building", "Closed"])
  ], [
    { consol: "CON-88", master: "MAWB-176-9981", houses: "LF-2408", direction: "Consol", status: "Building" }
  ]),
  screen("forwarding", "house-bills", "House bills", "Bills", "The bill between Lane and the customer.", [
    text("house", "House", true),
    text("file", "File"),
    sel("mode", "Mode", ["Ocean", "Air"]),
    text("shipper", "Shipper"),
    text("consignee", "Consignee")
  ], [
    { house: "HL-2408", file: "LF-2408", mode: "Ocean", shipper: "Atlas Korangi", consignee: "Felixstowe DC" }
  ]),
  screen("forwarding", "master-bills", "Master bills", "Bills", "The bill with the carrier.", [
    text("master", "Master", true),
    text("carrier", "Carrier"),
    text("vessel", "Vessel or flight"),
    text("consol", "Consol")
  ], [
    { master: "MSCU-BOL-2408", carrier: "North Sea Box", vessel: "Crescent Bay 2408E", consol: "CON-88" }
  ]),
  screen("forwarding", "routing", "Routing orders", "Move", "What the origin and destination agents were told.", [
    text("order", "Order", true),
    text("file", "File"),
    text("agent", "Agent"),
    area("instruction", "Instruction")
  ], [
    { order: "RO-2408", file: "LF-2408", agent: "Eastgate Agents", instruction: "Arrange delivery after release. Profit share 50/50." }
  ]),
  screen("forwarding", "arrivals", "Arrival notices", "Move", "The notice sent before the box lands.", [
    text("notice", "Notice", true),
    text("file", "File"),
    date("eta", "ETA"),
    sel("status", "Status", ["Draft", "Sent"])
  ], [
    { notice: "AN-2408", file: "LF-2408", eta: "2026-10-23", status: "Draft" }
  ]),
  screen("forwarding", "delivery-orders", "Delivery orders", "Move", "Authority for the terminal to release the box.", [
    text("order", "Order", true),
    text("file", "File"),
    text("to", "Release to"),
    sel("status", "Status", ["Draft", "Issued"])
  ], [
    { order: "DO-2408", file: "LF-2408", to: "Eastgate Agents", status: "Draft" }
  ]),
  screen("forwarding", "demurrage", "Demurrage clocks", "Clocks", "Days on the quay and on the road, and the empty return.", [
    text("container", "Container", true),
    date("discharge", "Discharge"),
    num("freeDays", "Free days"),
    date("emptyReturn", "Empty returned"),
    money("accrued", "Accrued"),
    sel("clock", "Clock", ["Not started", "Running", "Stopped"])
  ], [
    { container: "MSCU1234567", discharge: "2026-10-23", freeDays: "7", emptyReturn: "", accrued: "0", clock: "Not started" }
  ]),

  screen("customs", "entries", "Entries", "Clearance", "The customs entry and its estimate.", [
    text("entry", "Entry", true),
    text("waybill", "Waybill"),
    text("hs", "HS code"),
    money("duty", "Duty estimate"),
    money("tax", "Tax estimate"),
    text("importer", "Importer of record"),
    text("exporter", "Exporter of record"),
    sel("status", "Status", ["Draft", "Filed", "Held", "Released"])
  ], [
    { entry: "ENT-2408", waybill: "LN-24081", hs: "6302.21", duty: "840000", tax: "151200", importer: "Atlas UK", exporter: "Atlas Home", status: "Held" }
  ]),
  screen("customs", "commercial-invoices", "Commercial invoices", "Papers", "The seller's invoice used at the border.", [
    text("invoice", "Invoice", true),
    text("waybill", "Waybill"),
    text("seller", "Seller"),
    text("buyer", "Buyer"),
    money("value", "Value"),
    text("currency", "Currency")
  ], [
    { invoice: "CI-2408", waybill: "LN-24081", seller: "Atlas Home", buyer: "Atlas UK", value: "42000", currency: "USD" }
  ]),
  screen("customs", "packing-lists", "Packing lists", "Papers", "What is in the box, piece by piece.", [
    text("list", "List", true),
    text("waybill", "Waybill"),
    num("cartons", "Cartons"),
    num("grossKg", "Gross kg"),
    text("marks", "Marks")
  ], [
    { list: "PL-2408", waybill: "LN-24081", cartons: "420", grossKg: "18400", marks: "ATLAS / FXT" }
  ]),
  screen("customs", "origin", "Certificates of origin", "Papers", "Origin claimed for the duty rate.", [
    text("certificate", "Certificate", true),
    text("waybill", "Waybill"),
    text("origin", "Origin"),
    sel("status", "Status", ["Requested", "Issued"])
  ], [
    { certificate: "CO-2408", waybill: "LN-24081", origin: "Pakistan", status: "Requested" }
  ]),
  screen("customs", "screening", "Restricted-party screening", "Checks", "A stored result. No live list is called.", [
    text("party", "Party", true),
    text("waybill", "Waybill"),
    sel("result", "Result", ["Clear", "Review", "Hit"]),
    text("list", "List version"),
    date("on", "Screened")
  ], [
    { party: "Atlas UK", waybill: "LN-24081", result: "Clear", list: "Simulated 2026-09", on: "2026-09-18" },
    { party: "Harbour Spice", waybill: "LN-09910", result: "Review", list: "Simulated 2026-09", on: "2026-09-18" }
  ]),
  screen("customs", "dg", "DG declarations", "Checks", "UN number, class, and packing group.", [
    text("waybill", "Waybill", true),
    text("un", "UN number"),
    text("class", "Class"),
    text("packingGroup", "Packing group"),
    sel("status", "Status", ["Draft", "Accepted", "Refused"])
  ], [
    { waybill: "LN-08812", un: "UN3481", class: "9", packingGroup: "", status: "Accepted" }
  ]),
  screen("customs", "permits", "Permits", "Checks", "Licences that must be on the file.", [
    text("permit", "Permit", true),
    text("waybill", "Waybill"),
    text("authority", "Authority"),
    date("expires", "Expires"),
    sel("status", "Status", ["Missing", "On file"])
  ], [
    { permit: "LIC-Textile-14", waybill: "LN-24081", authority: "Ministry of Commerce", expires: "2026-12-31", status: "Missing" }
  ]),
  screen("customs", "prohibited", "Prohibited list", "Checks", "Commodities the desk must refuse.", [
    text("commodity", "Commodity", true),
    sel("decision", "Decision", ["Refuse", "Permit only"]),
    area("note", "Note")
  ], [
    { commodity: "Waste oil", decision: "Refuse", note: "No licence path in this company." },
    { commodity: "Lithium devices", decision: "Permit only", note: "Needs a DG declaration." }
  ]),
  screen("customs", "chain", "Chain of custody", "Checks", "Temperature and handoff for food and pharma.", [
    text("waybill", "Waybill", true),
    sel("profile", "Profile", ["Ambient", "Chill", "Frozen", "Pharma"]),
    text("range", "Range"),
    sel("intact", "Intact", yesNo)
  ], [
    { waybill: "LN-07770", profile: "Chill", range: "2-8 C", intact: "Yes" }
  ]),

  screen("documents", "library", "Library", "Files", "Every paper stored against a waybill.", [
    text("name", "Document", true),
    text("waybill", "Waybill"),
    sel("type", "Type", ["Label", "Waybill", "BOL", "CMR", "AWB", "Sea waybill", "Manifest", "Packing list", "Commercial invoice", "Rate confirmation", "Delivery order", "POD", "Insurance"]),
    text("version", "Version"),
    sel("status", "Status", ["Draft", "Issued", "Signed"])
  ], [
    { name: "Waybill LN-10021", waybill: "LN-10021", type: "Waybill", version: "3", status: "Issued" },
    { name: "Rate confirmation RC-10021", waybill: "LN-10021", type: "Rate confirmation", version: "1", status: "Signed" },
    { name: "BOL LF-2408", waybill: "LN-24081", type: "BOL", version: "1", status: "Draft" },
    { name: "Insurance LN-10044", waybill: "LN-10044", type: "Insurance", version: "1", status: "Issued" }
  ]),
  screen("documents", "checklists", "Checklists", "Files", "What a mode and a lane require before the truck leaves.", [
    text("name", "Checklist", true),
    sel("mode", "Mode", ["Road", "Air", "Ocean"]),
    text("lane", "Lane"),
    area("required", "Required documents")
  ], [
    { name: "Ocean UK", mode: "Ocean", lane: "Karachi → Felixstowe", required: "BOL, commercial invoice, packing list, origin, VGM, letter of credit set" },
    { name: "Domestic parcel", mode: "Road", lane: "Lahore → Karachi", required: "Label, waybill, POD" }
  ]),
  screen("documents", "labels", "Labels", "Print", "Piece labels ready to print.", [
    text("waybill", "Waybill", true),
    text("piece", "Piece"),
    text("barcode", "Barcode"),
    sel("status", "Status", ["Ready", "Printed"])
  ], [
    { waybill: "LN-10021", piece: "1 of 4", barcode: "LN10021001", status: "Printed" }
  ]),
  screen("documents", "waybills", "Waybills", "Print", "The transport document the driver carries.", [
    text("waybill", "Waybill", true),
    sel("form", "Form", ["Waybill", "BOL", "CMR", "AWB", "Sea waybill", "Manifest"]),
    sel("status", "Status", ["Draft", "Issued"])
  ], [
    { waybill: "LN-10044", form: "CMR", status: "Issued" },
    { waybill: "LN-24081", form: "Sea waybill", status: "Draft" }
  ]),
  screen("documents", "esign", "E-sign", "Sign", "Who has signed, and who has not.", [
    text("document", "Document", true),
    text("party", "Party"),
    sel("status", "Status", ["Sent", "Signed", "Declined"]),
    text("at", "When")
  ], [
    { document: "RC-10021", party: "Northline Retail", status: "Signed", at: "2026-09-25 09:12" },
    { document: "BOL LF-2408", party: "North Sea Box", status: "Sent", at: "2026-09-20 11:00" }
  ]),

  screen("billing", "invoices", "Customer invoices", "Sell", "What the customer owes for the shipment.", [
    text("invoice", "Invoice", true),
    text("customer", "Customer"),
    text("waybill", "Waybill"),
    money("amount", "Amount"),
    money("tax", "Tax"),
    text("currency", "Currency"),
    date("due", "Due"),
    sel("status", "Status", ["Draft", "Issued", "Part paid", "Paid", "Overdue"])
  ], [
    { invoice: "INV-24091", customer: "Northline Retail", waybill: "LN-10021", amount: "1870", tax: "337", currency: "PKR", due: "2026-10-25", status: "Issued" },
    { invoice: "INV-24070", customer: "Harbour Spice", waybill: "LN-09910", amount: "64000", tax: "11520", currency: "PKR", due: "2026-09-15", status: "Overdue" }
  ]),
  screen("billing", "credit-notes", "Credit notes", "Sell", "Money given back against an invoice.", [
    text("note", "Credit note", true),
    text("invoice", "Invoice"),
    money("amount", "Amount"),
    text("reason", "Reason"),
    sel("status", "Status", ["Draft", "Issued"])
  ], [
    { note: "CN-19", invoice: "INV-24091", amount: "200", reason: "Address correction waived", status: "Draft" }
  ]),
  screen("billing", "receipts", "Receipts", "Sell", "Cash and transfers received.", [
    text("receipt", "Receipt", true),
    text("customer", "Customer"),
    text("invoice", "Invoice"),
    money("amount", "Amount"),
    date("on", "Date")
  ], [
    { receipt: "RCT-300", customer: "Northline Retail", invoice: "INV-24080", amount: "54000", on: "2026-09-12" }
  ]),
  screen("billing", "carrier-bills", "Carrier bills", "Buy", "What a carrier asked to be paid.", [
    text("bill", "Bill", true),
    text("carrier", "Carrier"),
    text("waybill", "Waybill"),
    money("amount", "Amount"),
    sel("status", "Status", ["Accrued", "Received", "Disputed", "Paid"])
  ], [
    { bill: "CB-778", carrier: "Indus Linehaul", waybill: "LN-10044", amount: "128000", status: "Received" },
    { bill: "CB-701", carrier: "Indus Linehaul", waybill: "LN-10021", amount: "2100", status: "Accrued" }
  ]),
  screen("billing", "settlements", "Settlements", "Buy", "Driver and owner-operator pay.", [
    text("settlement", "Settlement", true),
    text("party", "Party"),
    sel("basis", "Basis", ["Per mile", "Per stop", "Hourly", "Percentage"]),
    money("amount", "Amount"),
    text("period", "Period"),
    sel("status", "Status", ["Draft", "Approved", "Paid"])
  ], [
    { settlement: "SET-19", party: "Kamal Transport", basis: "Per mile", amount: "86000", period: "Sep 2026", status: "Draft" },
    { settlement: "SET-20", party: "Sami Raza", basis: "Per stop", amount: "14000", period: "Week 39", status: "Approved" }
  ]),
  screen("billing", "cod", "COD remittance", "Sell", "Cash collected at the door, owed back to the shipper.", [
    text("waybill", "Waybill", true),
    money("collected", "Collected"),
    money("fee", "Fee"),
    money("remit", "To remit"),
    sel("status", "Status", ["Collected", "Remitted"])
  ], [
    { waybill: "LN-10008", collected: "12500", fee: "250", remit: "12250", status: "Collected" }
  ]),
  screen("billing", "audit", "Freight audit", "Control", "Rated amount against the carrier bill.", [
    text("waybill", "Waybill", true),
    text("carrier", "Carrier"),
    money("rated", "Rated"),
    money("billed", "Billed"),
    money("difference", "Difference"),
    sel("status", "Status", ["Match", "Dispute", "Short-pay"])
  ], [
    { waybill: "LN-10044", carrier: "Indus Linehaul", rated: "128000", billed: "136000", difference: "8000", status: "Dispute" },
    { waybill: "LN-09901", carrier: "Indus Linehaul", rated: "54000", billed: "54000", difference: "0", status: "Match" }
  ]),
  screen("billing", "pnl", "Shipment profit", "Control", "Sell, buy, and margin by lane and branch.", [
    text("waybill", "Waybill", true),
    text("customer", "Customer"),
    text("lane", "Lane"),
    sel("mode", "Mode", ["Parcel", "FTL", "Ocean", "Air"]),
    text("branch", "Branch"),
    money("sell", "Sell"),
    money("buy", "Buy"),
    money("margin", "Margin")
  ], [
    { waybill: "LN-10021", customer: "Northline Retail", lane: "Lahore → Karachi", mode: "Parcel", branch: "Lahore", sell: "1870", buy: "1210", margin: "660" },
    { waybill: "LN-10044", customer: "Atlas Home", lane: "Karachi → Lahore", mode: "FTL", branch: "Karachi", sell: "168000", buy: "128000", margin: "40000" },
    { waybill: "LN-24081", customer: "Atlas Home", lane: "Karachi → Felixstowe", mode: "Ocean", branch: "Karachi", sell: "410000", buy: "340000", margin: "70000" }
  ]),
  screen("billing", "aging", "Aging", "Control", "What is still unpaid, by bucket.", [
    text("customer", "Customer", true),
    money("current", "Current"),
    money("d30", "1-30"),
    money("d60", "31-60"),
    money("d90", "61+"),
    sel("hold", "Credit hold", yesNo)
  ], [
    { customer: "Northline Retail", current: "2207", d30: "0", d60: "0", d90: "0", hold: "No" },
    { customer: "Harbour Spice", current: "0", d30: "0", d60: "75520", d90: "0", hold: "Yes" }
  ]),

  screen("service", "claims", "Claims", "Recover", "Loss, damage, shortage, and delay.", [
    text("claim", "Claim", true),
    text("waybill", "Waybill"),
    sel("kind", "Kind", ["Loss", "Damage", "Shortage", "Delay"]),
    money("claimed", "Claimed"),
    money("liability", "Liability cap"),
    text("photos", "Photos"),
    sel("recovery", "Carrier recovery", ["Not started", "Filed", "Agreed", "Refused"]),
    sel("salvage", "Salvage", ["None", "Held", "Sold"]),
    sel("status", "Status", ["Open", "Offered", "Settled", "Denied"])
  ], [
    { claim: "CLM-104", waybill: "LN-10008", kind: "Damage", claimed: "18000", liability: "85000", photos: "door-photo.jpg", recovery: "Filed", salvage: "Held", status: "Open" }
  ]),
  screen("service", "cases", "Cases", "Care", "A conversation tied to a shipment and an SLA.", [
    text("case", "Case", true),
    text("waybill", "Waybill"),
    text("subject", "Subject"),
    text("sla", "SLA"),
    area("activity", "Latest activity"),
    sel("status", "Status", ["New", "Waiting", "Done"])
  ], [
    { case: "CS-551", waybill: "LN-10021", subject: "Where is the apparel?", sla: "4h first response", activity: "Told the customer the scan is missing at Korangi.", status: "Waiting" },
    { case: "CS-540", waybill: "LN-10008", subject: "Carton crushed", sla: "Claim opened", activity: "Photos received.", status: "New" }
  ]),
  screen("service", "returns", "Returns", "Reverse", "Authorization, label, pickup, and where the goods go.", [
    text("rma", "RMA", true),
    text("waybill", "Original waybill"),
    text("label", "Return label"),
    sel("inspection", "Inspection", ["Pending", "Resale", "Scrap"]),
    sel("outcome", "Outcome", ["Refund", "Replacement", "Pending"]),
    sel("disposition", "Disposition", ["To stock", "Quarantine", "Scrap"]),
    sel("status", "Status", ["Authorized", "Picked up", "Closed"])
  ], [
    { rma: "RMA-77", waybill: "LN-10008", label: "LN-R-10008", inspection: "Pending", outcome: "Refund", disposition: "Quarantine", status: "Authorized" }
  ]),
  screen("service", "ratings", "Delivery ratings", "Care", "What the consignee said after POD.", [
    text("waybill", "Waybill", true),
    num("score", "Score"),
    area("comment", "Comment")
  ], [
    { waybill: "LN-09901", score: "5", comment: "On the window, driver called ahead." },
    { waybill: "LN-10008", score: "2", comment: "Carton corner crushed." }
  ]),

  screen("sales", "leads", "Leads", "Pipeline", "Names from the website and from the road.", [
    text("name", "Name", true),
    text("company", "Company"),
    text("source", "Source"),
    text("email", "Email"),
    sel("status", "Status", ["New", "Working", "Qualified", "Disqualified"])
  ], [
    { name: "Sara Ahmed", company: "Indigo Mills", source: "Website", email: "sara@indigo.example", status: "New" }
  ]),
  screen("sales", "opportunities", "Opportunities", "Pipeline", "A lane you might win, and the margin you need.", [
    text("name", "Name", true),
    text("account", "Account"),
    text("lane", "Lane"),
    sel("mode", "Mode", ["Parcel", "FTL", "Ocean"]),
    money("value", "Yearly value"),
    sel("stage", "Stage", ["Discover", "Quote", "Won", "Lost"])
  ], [
    { name: "Indigo north apparel", account: "Indigo Mills", lane: "Faisalabad → Karachi", mode: "Parcel", value: "4200000", stage: "Quote" },
    { name: "Northline renewal", account: "Northline Retail", lane: "Lahore → Karachi", mode: "Parcel", value: "1800000", stage: "Won" }
  ]),
  screen("sales", "rfps", "Lane RFPs", "Bids", "A formal ask for several lanes.", [
    text("rfp", "RFP", true),
    text("shipper", "Shipper"),
    area("lanes", "Lanes"),
    sel("outcome", "Outcome", ["Open", "Won", "Lost", "No bid"])
  ], [
    { rfp: "RFP-14", shipper: "Indigo Mills", lanes: "Faisalabad-Karachi parcel, Karachi-Lahore FTL", outcome: "Open" }
  ]),
  screen("sales", "contracts", "Contracts", "Bids", "Won work, and when it must be renewed.", [
    text("contract", "Contract", true),
    text("customer", "Customer"),
    date("start", "Start"),
    date("renewal", "Renewal"),
    sel("status", "Status", ["Active", "Expiring", "Ended"])
  ], [
    { contract: "CT-Northline-26", customer: "Northline Retail", start: "2026-01-01", renewal: "2026-12-31", status: "Active" }
  ]),

  screen("reports", "kpis", "Service KPIs", "Board", "On time, cost, claims, and how full the shed is.", [], [], { kind: "kpis" }),
  screen("reports", "custom", "Custom report", "Build", "Pick a desk and the columns. Save a snapshot.", [], [], { kind: "custom-report" }),
  screen("reports", "snapshots", "Snapshots", "Build", "Reports someone froze for a meeting.", [
    text("name", "Name", true),
    text("source", "Source"),
    text("columns", "Columns"),
    text("savedBy", "Saved by")
  ], [
    { name: "Monday exceptions", source: "visibility/exceptions", columns: "waybill, kind, owner, status", savedBy: "Nadia Rahman" }
  ]),

  screen("settings", "tenants", "Companies", "Organization", "The companies this desk can open.", [
    text("code", "Code", true),
    text("name", "Name", true),
    text("city", "City"),
    text("currency", "Currency"),
    text("timezone", "Timezone"),
    sel("status", "Status", active)
  ], [
    { code: "alpha", name: "Lane Pakistan", city: "Karachi", currency: "PKR", timezone: "Asia/Karachi", status: "Active" },
    { code: "gulf", name: "Lane Gulf", city: "Dubai", currency: "AED", timezone: "Asia/Dubai", status: "Active" }
  ], { locked: ["code"] }),
  screen("settings", "users", "Users", "Organization", "Who can sign in, and as whom.", [
    text("name", "Name", true),
    text("email", "Email", true),
    sel("role", "Role", Object.keys({
      super_admin: 1, company_admin: 1, operations_manager: 1, dispatcher: 1, warehouse_manager: 1, fleet_manager: 1, finance: 1, customer_service: 1, sales: 1, driver: 1, customer: 1, carrier: 1, viewer: 1
    })),
    text("title", "Title"),
    text("branch", "Branch"),
    sel("mfa", "MFA", yesNo),
    sel("status", "Status", ["active", "invited", "blocked"])
  ], [], { locked: ["email"] }),
  screen("settings", "roles", "Roles", "Organization", "Built-in roles and roles you add.", [
    text("key", "Key", true),
    text("label", "Label", true),
    area("description", "Description"),
    text("modules", "Modules"),
    sel("status", "Status", active)
  ], []),
  screen("settings", "access", "Access control", "Organization", "Menu rights for the role you pick.", [], [], { kind: "access" }),
  screen("settings", "packages", "Subscription packages", "Billing", "What a company is sold.", [
    text("name", "Name", true),
    money("price", "Price"),
    text("period", "Period"),
    area("includes", "Includes"),
    sel("status", "Status", active)
  ], [
    { name: "Desk", price: "45000", period: "branch / month", includes: "Bookings, tracking, POD, customer portal", status: "Active" },
    { name: "Network", price: "120000", period: "company / month", includes: "Dispatch, fleet, warehouse, audit", status: "Active" },
    { name: "Control tower", price: "0", period: "custom", includes: "Forwarding, customs, multi-company, API", status: "Active" }
  ]),
  screen("settings", "company-billing", "Company billing", "Billing", "The plan this company is on.", [
    text("company", "Company", true),
    text("package", "Package"),
    text("renews", "Renews"),
    sel("status", "Status", ["Current", "Past due", "Trial"])
  ], [
    { company: "Lane Pakistan", package: "Control tower", renews: "2026-12-01", status: "Current" },
    { company: "Lane Gulf", package: "Desk", renews: "2026-11-01", status: "Trial", _tenant: "gulf" }
  ]),
  screen("settings", "email-templates", "Email templates", "Email", "Words reused by compose and by rules.", [
    text("name", "Name", true),
    sel("event", "Event", ["Booked", "Tendered", "Delayed", "Out for delivery", "Delivered", "Exception", "Invoice", "Claim"]),
    text("subject", "Subject"),
    area("body", "Body")
  ], [
    { name: "Late freight", event: "Delayed", subject: "Shipment {{waybill}} is late", body: "We can see {{waybill}} missed its promise. The desk is already on it." },
    { name: "Out for delivery", event: "Out for delivery", subject: "{{waybill}} is on the vehicle", body: "The driver is on the way. Have the OTP ready." },
    { name: "Invoice issued", event: "Invoice", subject: "Invoice {{invoice}}", body: "Your invoice is ready in the portal." }
  ]),
  screen("settings", "blogs", "Blog", "Content", "Stories on the public site.", [
    text("slug", "Slug", true),
    text("title", "Title", true),
    text("excerpt", "Excerpt"),
    area("body", "Body"),
    sel("status", "Status", ["Draft", "Published"])
  ], [
    { slug: "control-tower", title: "What a Monday tower should show", excerpt: "Late, dwell, and holds. Not a gallery of green ticks.", body: "A useful tower is a queue of work. Lane opens on the shipments that have already broken their promise, then the ones that will break it if nobody moves.", status: "Published" },
    { slug: "one-invoice", title: "One invoice for the shed and the ship", excerpt: "Storage and ocean freight can share a customer and still keep their own cost.", body: "Atlas Home pays for a bin in Korangi and a box to Felixstowe. The profit lines stay separate. The statement does not.", status: "Published" },
    { slug: "pod-on-the-phone", title: "POD that finance will accept", excerpt: "Name, photo, time, and a pin. Not a scribble on a clipboard.", body: "The driver page stores the proof against the waybill before the truck is back at the hub.", status: "Published" }
  ]),
  screen("settings", "content", "Menus and pages", "Content", "Footer and extra public pages.", [
    text("menu", "Menu", true),
    text("label", "Label"),
    text("href", "Link"),
    sel("status", "Status", ["Published", "Hidden"])
  ], [
    { menu: "Footer", label: "Privacy", href: "/legal/privacy", status: "Published" },
    { menu: "Footer", label: "Terms", href: "/legal/terms", status: "Published" },
    { menu: "Footer", label: "Prohibited goods", href: "/legal/prohibited", status: "Published" },
    { menu: "Header", label: "Coverage", href: "/coverage", status: "Published" }
  ]),
  screen("settings", "landing-images", "Landing images", "Content", "Words on the public hero. The picture is drawn, not uploaded.", [
    text("slot", "Slot", true),
    text("caption", "Caption"),
    text("alt", "Alt text")
  ], [
    { slot: "Hero", caption: "Karachi to Felixstowe, and the Lahore night sort, on the same desk.", alt: "A route line from Lahore through Karachi to Felixstowe." }
  ]),
  screen("settings", "forms", "Extra form fields", "Content", "A field added to another desk without a code change.", [
    text("target", "Target screen", true),
    text("label", "Label"),
    text("key", "Key"),
    sel("status", "Status", active)
  ], [
    { target: "bookings/shipments", label: "Gate pass", key: "gatePass", status: "Active" }
  ]),
  screen("settings", "recycle", "Recycle bin", "System", "Records removed from a desk. Restore them here.", [], [], { kind: "recycle" }),
  screen("settings", "audit", "Audit log", "System", "Who changed what, in this company.", [], [], { kind: "audit" }),
  screen("settings", "notifications", "Notifications", "System", "The bell, in a list.", [], [], { kind: "inbox" }),
  screen("settings", "guides", "Process guides", "System", "The flow for every module.", [], [], { kind: "guide" }),
  screen("settings", "integrations", "Integrations", "System", "Connectors you can configure. Test does not call them.", [
    text("name", "Name", true),
    sel("kind", "Kind", ["Maps", "SMS", "Email", "Carrier", "EDI", "Accounting", "Webhooks"]),
    text("endpoint", "Endpoint"),
    sel("status", "Status", ["Not connected", "Simulated OK", "Paused"])
  ], [
    { name: "Maps", kind: "Maps", endpoint: "https://maps.example/simulate", status: "Not connected" },
    { name: "SMS", kind: "SMS", endpoint: "https://sms.example/simulate", status: "Not connected" },
    { name: "Email", kind: "Email", endpoint: "https://mail.example/simulate", status: "Simulated OK" },
    { name: "Carrier status", kind: "Carrier", endpoint: "https://carrier.example/simulate", status: "Not connected" },
    { name: "EDI events", kind: "EDI", endpoint: "https://edi.example/simulate", status: "Not connected" },
    { name: "Accounting export", kind: "Accounting", endpoint: "https://books.example/simulate", status: "Not connected" },
    { name: "Webhooks", kind: "Webhooks", endpoint: "https://hooks.example/lane", status: "Not connected" }
  ]),
  screen("settings", "api-keys", "API keys", "System", "Masked keys. They do not open a live API.", [
    text("name", "Name", true),
    text("prefix", "Prefix"),
    date("created", "Created"),
    sel("status", "Status", ["Active", "Revoked"])
  ], [
    { name: "Tower read", prefix: "lane_live_••••4f2a", created: "2026-09-01", status: "Active" }
  ]),
  screen("settings", "events", "Event catalog", "System", "What a webhook could subscribe to.", [
    text("topic", "Topic", true),
    text("when", "When"),
    area("sample", "Sample")
  ], [
    { topic: "shipment.booked", when: "A shipment is created", sample: "{\"waybill\":\"LN-10021\"}" },
    { topic: "shipment.delivered", when: "POD is captured", sample: "{\"waybill\":\"LN-10044\"}" },
    { topic: "invoice.issued", when: "An invoice is approved", sample: "{\"invoice\":\"INV-24091\"}" },
    { topic: "claim.opened", when: "A claim is created", sample: "{\"claim\":\"CLM-104\"}" },
    { topic: "tender.accepted", when: "A carrier accepts", sample: "{\"tender\":\"TD-441\"}" }
  ]),
  screen("settings", "system", "System settings", "System", "Identity, currency, idle time, and numbering.", [
    text("legalName", "Legal name", true),
    text("logoText", "Wordmark"),
    text("timezone", "Timezone"),
    text("currency", "Currency"),
    num("taxPct", "Default tax %"),
    sel("units", "Units", ["Metric", "Imperial"]),
    text("waybillPrefix", "Waybill prefix"),
    sel("language", "Language", ["English"]),
    num("idleMinutes", "Idle minutes"),
    num("dimParcel", "Parcel dim factor")
  ], [
    { legalName: "Lane Pakistan (Pvt) Ltd", logoText: "Lane", timezone: "Asia/Karachi", currency: "PKR", taxPct: "18", units: "Metric", waybillPrefix: "LN-", language: "English", idleMinutes: "30", dimParcel: "5000" },
    { legalName: "Lane Gulf LLC", logoText: "Lane", timezone: "Asia/Dubai", currency: "AED", taxPct: "5", units: "Metric", waybillPrefix: "LG-", language: "English", idleMinutes: "30", dimParcel: "5000", _tenant: "gulf" }
  ], { kind: "system" })
];

const UTILITY: { slug: string; label: string; group: string; kind: ScreenDef["kind"]; summary: string }[] = [
  { slug: "guide", label: "Flow diagram", group: "Guide", kind: "guide", summary: "How this module is meant to be used." },
  { slug: "compose", label: "Compose email", group: "Email Engine", kind: "compose", summary: "Send from this module. SMS and WhatsApp are simulated." },
  { slug: "automations", label: "Rule engine", group: "Rule Engine", kind: "rules", summary: "When something happens, do something else." }
];

export function screenKey(moduleKey: string, slug: string) {
  return `${moduleKey}/${slug}`;
}

export function findScreen(moduleKey: string, slug: string) {
  return SCREENS.find((item) => item.module === moduleKey && item.slug === slug);
}

export function resolveScreen(moduleKey: string, slug: string): ScreenDef | null {
  if (!isModule(moduleKey)) return null;
  const utility = UTILITY.find((item) => item.slug === slug);
  if (utility) {
    return {
      module: moduleKey,
      slug,
      label: utility.label,
      group: utility.group,
      summary: utility.summary,
      kind: utility.kind
    };
  }
  if (slug === "overview") {
    return {
      module: moduleKey,
      slug,
      label: "Overview",
      group: "Guide",
      summary: moduleKey === "dashboard" ? "Operating picture." : "What is in this module.",
      kind: moduleKey === "dashboard" ? "dashboard" : "table"
    };
  }
  return findScreen(moduleKey, slug) ?? null;
}

export type NavEntry = {
  label: string;
  href: string;
  group: string;
  screenKey: string;
};

export function navEntries(moduleKey: ModuleKey): NavEntry[] {
  const base = `/console/${moduleKey}`;
  const head: NavEntry[] = [
    { label: "Overview", href: base, group: "Guide", screenKey: `${moduleKey}/overview` },
    ...UTILITY.map((item) => ({
      label: item.label,
      href: `${base}/${item.slug}`,
      group: item.group,
      screenKey: `${moduleKey}/${item.slug}`
    }))
  ];
  const rest = SCREENS.filter((item) => item.module === moduleKey && item.slug !== "profile").map((item) => ({
    label: item.label,
    href: `${base}/${item.slug}`,
    group: item.group,
    screenKey: `${moduleKey}/${item.slug}`
  }));
  if (moduleKey === "dashboard") {
    rest.unshift({
      label: "My profile",
      href: `${base}/profile`,
      group: "Account",
      screenKey: "dashboard/profile"
    });
  }
  return [...head, ...rest];
}

export function columnsFor(def: ScreenDef) {
  const fields = def.fields ?? [];
  const keys = def.columns ?? fields.filter((field) => field.kind !== "textarea").slice(0, 5).map((field) => field.key);
  return keys.map((key) => fields.find((field) => field.key === key)).filter((field): field is NonNullable<typeof field> => Boolean(field));
}
