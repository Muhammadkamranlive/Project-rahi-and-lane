"use client";

import { columnsFor, findScreen, navEntries, SCREENS } from "@/lib/catalog";
import { GUIDES } from "@/lib/guides";
import { MODULES, RIGHTS, isModule, roleLabel, type ModuleKey, type Rights } from "@/lib/model";
import { useLane, type Entity } from "@/lib/store";
import { Badge, Button, Empty, FieldLabel, Panel, TextArea, TextInput } from "@/components/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

function money(value: number, currency = "PKR") {
  return `${currency} ${Math.round(value).toLocaleString("en-PK")}`;
}

export function Dashboard() {
  const lane = useLane();
  const shipments = lane.list("bookings/shipments");
  const late = shipments.filter((row) => /late|hold|exception/i.test(row.values.status));
  const claims = lane.list("service/claims").filter((row) => row.values.status === "Open");
  const margin = lane.list("billing/pnl").reduce((sum, row) => sum + Number(row.values.margin || 0), 0);
  const locations = lane.list("warehouse/locations");
  const full = locations.filter((row) => row.values.status === "Occupied").length;
  const cards = [
    ["Open shipments", String(shipments.length), "/console/bookings/shipments"],
    ["Needs a person", String(late.length), "/console/visibility/tower"],
    ["Open claims", String(claims.length), "/console/service/claims"],
    ["Margin on file", money(margin), "/console/billing/pnl"],
    ["Bins occupied", locations.length ? `${Math.round((full / locations.length) * 100)}%` : "—", "/console/warehouse/locations"]
  ];
  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">Dashboard</p>
        <h1 className="mt-1 font-serif text-4xl">The desk this morning</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Figures follow {lane.tenants().find((row) => row.values.code === lane.tenantId)?.values.name}. Late freight and holds sit in front of the totals.</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value, href]) => (
          <li key={label}>
            <Link href={href} className="block rounded-3xl border border-line bg-white p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
              <span className="mt-2 block font-serif text-3xl">{value}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid gap-4 lg:grid-cols-3">
        {shipments.slice(0, 3).map((row) => (
          <Panel key={row.id}>
            <Badge value={row.values.status} />
            <h2 className="mt-3 font-serif text-2xl">{row.values.waybill}</h2>
            <p className="text-sm text-muted">{row.values.origin} → {row.values.destination}</p>
            <p className="mt-2 text-sm">{row.values.customer} · {row.values.mode}</p>
            <Link href="/console/visibility/tracking" className="mt-3 inline-block text-sm font-semibold text-sea">Open the trail</Link>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function ModuleHome({ moduleKey }: { moduleKey: ModuleKey }) {
  const lane = useLane();
  const meta = MODULES.find((item) => item.key === moduleKey);
  const guide = GUIDES[moduleKey];
  const links = navEntries(moduleKey).filter((link) => lane.rightsFor(link.screenKey).view && !link.href.endsWith(moduleKey));
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">{meta?.label}</p>
      <h1 className="mt-1 font-serif text-4xl">{meta?.label}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{meta?.blurb}</p>
      <ol className="mt-6 grid gap-3 md:grid-cols-2">
        {guide.steps.map((step, index) => (
          <li key={step.title} className="rounded-3xl border border-line bg-white p-4">
            <span className="text-xs font-semibold text-sea">0{index + 1}</span>
            <p className="mt-1 font-semibold">{step.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="block rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold hover:border-sea">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GuideView({ moduleKey }: { moduleKey: string }) {
  const modules = moduleKey === "settings" ? MODULES : MODULES.filter((item) => item.key === moduleKey);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-4xl">Flow</h1>
      {modules.map((mod) => (
        <Panel key={mod.key}>
          <h2 className="font-serif text-2xl">{GUIDES[mod.key].title}</h2>
          <ol className="mt-4 space-y-3">
            {GUIDES[mod.key].steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-ink text-sm text-paper">{index + 1}</span>
                <span>
                  <span className="font-semibold">{step.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      ))}
    </div>
  );
}

export function ComposeView({ moduleKey }: { moduleKey: string }) {
  const lane = useLane();
  const templates = lane.list("settings/email-templates");
  const [channel, setChannel] = useState("Email");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState("");
  return (
    <Panel>
      <h1 className="font-serif text-3xl">Compose</h1>
      <p className="mt-1 text-sm text-muted">Email is kept in the outbox. SMS and WhatsApp are marked simulated and are not sent to a network.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label><FieldLabel>Channel</FieldLabel>
          <select className="h-11 w-full rounded-xl border border-line bg-white px-3" value={channel} onChange={(event) => setChannel(event.target.value)}>
            {["Email", "SMS", "WhatsApp", "In-app"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label><FieldLabel>Template</FieldLabel>
          <select className="h-11 w-full rounded-xl border border-line bg-white px-3" defaultValue="" onChange={(event) => {
            const template = templates.find((row) => row.id === event.target.value);
            if (!template) return;
            setSubject(template.values.subject || "");
            setBody(template.values.body || "");
          }}>
            <option value="">Choose a template</option>
            {templates.map((row) => <option key={row.id} value={row.id}>{row.values.name}</option>)}
          </select>
        </label>
        <label className="md:col-span-2"><FieldLabel>To</FieldLabel><TextInput value={to} onChange={(event) => setTo(event.target.value)} /></label>
        <label className="md:col-span-2"><FieldLabel>Subject</FieldLabel><TextInput value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
        <label className="md:col-span-2"><FieldLabel>Message</FieldLabel><TextArea value={body} onChange={(event) => setBody(event.target.value)} /></label>
      </div>
      <Button className="mt-4" onClick={() => { lane.sendMessage({ module: moduleKey, channel, to, subject, body }); setSent(`${channel} recorded as simulated.`); }}>Send</Button>
      {sent && <p className="mt-3 text-sm text-sea">{sent}</p>}
    </Panel>
  );
}

export function RulesView({ moduleKey }: { moduleKey: string }) {
  const lane = useLane();
  const rules = lane.rules.filter((rule) => moduleKey === "settings" || rule.module === moduleKey);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("Shipment status changes");
  const [condition, setCondition] = useState("status is Late");
  const [action, setAction] = useState("Notify the dispatcher");
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-4xl">Rule engine</h1>
      <ul className="space-y-3">
        {rules.map((rule) => (
          <li key={rule.id} className="rounded-3xl border border-line bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{rule.name}</p>
              <Badge value={rule.enabled ? "Active" : "Inactive"} />
            </div>
            <p className="mt-1 text-sm text-muted">When {rule.trigger}. If {rule.condition}. Then {rule.action}.</p>
            <div className="mt-3 flex gap-2">
              <Button variant="ghost" onClick={() => lane.toggleRule(rule.id)}>{rule.enabled ? "Pause" : "Enable"}</Button>
              <Button onClick={() => lane.runRule(rule.id)}>Run now</Button>
            </div>
          </li>
        ))}
        {rules.length === 0 && <Empty title="No rules yet" body="Add one below. Running it writes a notification and an audit line. It does not call an outside service." />}
      </ul>
      <Panel>
        <h2 className="font-semibold">New rule</h2>
        <div className="mt-3 grid gap-3">
          <TextInput aria-label="Rule name" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <TextInput aria-label="Trigger" value={trigger} onChange={(event) => setTrigger(event.target.value)} />
          <TextInput aria-label="Condition" value={condition} onChange={(event) => setCondition(event.target.value)} />
          <TextInput aria-label="Action" value={action} onChange={(event) => setAction(event.target.value)} />
          <Button onClick={() => name && lane.saveRule({ module: moduleKey === "settings" ? "visibility" : moduleKey, name, trigger, condition, action, enabled: true })}>Save rule</Button>
        </div>
      </Panel>
    </div>
  );
}

export function AccessView() {
  const lane = useLane();
  const roles = lane.list("settings/roles");
  const [role, setRole] = useState(roles[0]?.values.key || "viewer");
  const entries = MODULES.flatMap((mod) => navEntries(mod.key).map((link) => ({ ...link, module: mod.label })));
  const [draft, setDraft] = useState<Record<string, Rights>>({});
  const current = (screen: string): Rights => draft[screen] ?? lane.rightsFor(screen, role);
  return (
    <div>
      <h1 className="font-serif text-4xl">Access control</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Hidden menus stay hidden. Rights here replace the default for the role inside this browser.</p>
      <label className="mt-4 block max-w-xs"><FieldLabel>Role</FieldLabel>
        <select className="h-11 w-full rounded-xl border border-line bg-white px-3" value={role} onChange={(event) => { setRole(event.target.value); setDraft({}); }}>
          {roles.map((row) => <option key={row.id} value={row.values.key}>{row.values.label}</option>)}
        </select>
      </label>
      <div className="mt-4 space-y-3">
        {MODULES.map((mod) => (
          <details key={mod.key} className="rounded-3xl border border-line bg-white p-4">
            <summary className="cursor-pointer font-semibold">{mod.label}</summary>
            <ul className="mt-3 space-y-2">
              {entries.filter((entry) => entry.module === mod.label).map((entry) => (
                <li key={entry.screenKey} className="grid gap-2 border-t border-line py-2 md:grid-cols-[1fr_auto] md:items-center">
                  <span className="text-sm">{entry.label}</span>
                  <span className="flex flex-wrap gap-3 text-xs">
                    {RIGHTS.map((right) => (
                      <label key={right} className="inline-flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={current(entry.screenKey)[right]}
                          onChange={(event) => setDraft((prev) => ({ ...prev, [entry.screenKey]: { ...current(entry.screenKey), [right]: event.target.checked } }))}
                        />
                        {right}
                      </label>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <Button className="mt-4" onClick={() => Object.entries(draft).forEach(([screen, rights]) => lane.setAcl(role, screen, rights))}>Save rights</Button>
    </div>
  );
}

export function Kpis() {
  const lane = useLane();
  const shipments = lane.list("bookings/shipments");
  const delivered = shipments.filter((row) => row.values.status === "Delivered").length;
  const late = shipments.filter((row) => row.values.status === "Late").length;
  const denom = Math.max(1, delivered + late);
  const pnl = lane.list("billing/pnl");
  const sell = pnl.reduce((sum, row) => sum + Number(row.values.sell || 0), 0);
  const margin = pnl.reduce((sum, row) => sum + Number(row.values.margin || 0), 0);
  const util = lane.list("fleet/utilization");
  const loaded = util.reduce((sum, row) => sum + Number(row.values.loadedKm || 0), 0);
  const empty = util.reduce((sum, row) => sum + Number(row.values.emptyKm || 0), 0);
  const claims = lane.list("service/claims").length;
  const locations = lane.list("warehouse/locations");
  const occupied = locations.filter((row) => row.values.status === "Occupied").length;
  const bars = [
    ["On-time delivery", Math.round((delivered / denom) * 100)],
    ["Exception rate", shipments.length ? Math.round((late / shipments.length) * 100) : 0],
    ["Empty miles", loaded + empty ? Math.round((empty / (loaded + empty)) * 100) : 0],
    ["Claims ratio", shipments.length ? Math.round((claims / shipments.length) * 100) : 0],
    ["Storage occupancy", locations.length ? Math.round((occupied / locations.length) * 100) : 0],
    ["Margin", sell ? Math.round((margin / sell) * 100) : 0]
  ];
  return (
    <div>
      <h1 className="font-serif text-4xl">Service KPIs</h1>
      <p className="mt-2 text-sm text-muted">On-time pickup shares the delivery clock in this demo. Cost per kilogram and per mile sit on the profit desk.</p>
      <ul className="mt-5 space-y-3">
        {bars.map(([label, value]) => (
          <li key={label}>
            <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div>
            <div className="h-3 rounded-full bg-sand"><div className="h-3 rounded-full bg-sea" style={{ width: `${Math.min(100, Number(value))}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RateShop({ publicMode = false }: { publicMode?: boolean }) {
  const lane = useLane();
  const [origin, setOrigin] = useState("Lahore");
  const [destination, setDestination] = useState("Karachi");
  const [weight, setWeight] = useState("20");
  const [mode, setMode] = useState("Any");
  const [asked, setAsked] = useState("");
  const options = useMemo(() => {
    const kg = Number(weight) || 1;
    return lane.list("rating/tariffs").filter((row) => mode === "Any" || row.values.mode === mode).map((row) => {
      const rate = Number(row.values.rate || 0);
      const minimum = Number(row.values.minimum || 0);
      const fuel = Number(row.values.fuelPct || 0);
      const basis = row.values.basis;
      const base = basis === "Per kg" ? rate * kg : basis === "Per km" ? rate * 1200 : rate;
      const sell = Math.max(minimum, base * (1 + fuel / 100));
      const buy = Number(row.values.carrierCost || 0) * (basis === "Per kg" ? kg : 1);
      return { id: row.id, name: row.values.name, mode: row.values.mode, currency: row.values.currency || "PKR", sell, buy, lane: row.values.lane };
    }).sort((a, b) => a.sell - b.sell);
  }, [lane, mode, weight]);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-4xl">{publicMode ? "Request a rate" : "Rate shop"}</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <label><FieldLabel>Origin</FieldLabel><TextInput value={origin} onChange={(event) => setOrigin(event.target.value)} /></label>
        <label><FieldLabel>Destination</FieldLabel><TextInput value={destination} onChange={(event) => setDestination(event.target.value)} /></label>
        <label><FieldLabel>Weight kg</FieldLabel><TextInput value={weight} onChange={(event) => setWeight(event.target.value)} /></label>
        <label><FieldLabel>Mode</FieldLabel>
          <select className="h-11 w-full rounded-xl border border-line bg-white px-3" value={mode} onChange={(event) => setMode(event.target.value)}>
            {["Any", "Parcel", "LTL", "FTL", "Air", "Ocean"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <ul className="grid gap-3 lg:grid-cols-3">
        {options.map((option) => (
          <li key={option.id} className="rounded-3xl border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{option.mode}</p>
            <h2 className="font-serif text-2xl">{option.name}</h2>
            <p className="text-sm text-muted">{option.lane}</p>
            <p className="mt-3 font-serif text-3xl">{money(option.sell, option.currency)}</p>
            {!publicMode && <p className="text-sm text-muted">Buy {money(option.buy, option.currency)} · margin {money(option.sell - option.buy, option.currency)}</p>}
            <Button className="mt-3" onClick={() => {
              lane.create("bookings/quotes", {
                number: "",
                customer: lane.account?.name || "Website request",
                kind: "Customer request",
                lane: `${origin} → ${destination}`,
                mode: option.mode,
                sell: String(Math.round(option.sell)),
                buy: String(Math.round(option.buy)),
                status: "Requested"
              });
              setAsked(option.name);
            }}>Request this rate</Button>
          </li>
        ))}
      </ul>
      {asked && <p className="text-sm text-sea">Request stored for {asked}. The sales and bookings desks can see it in this browser.</p>}
    </div>
  );
}

export function Tower() {
  const lane = useLane();
  const rows = lane.list("visibility/exceptions").filter((row) => row.values.status !== "Closed");
  return (
    <div>
      <h1 className="font-serif text-4xl">Control tower</h1>
      <p className="mt-2 text-sm text-muted">Late freight, dwell, missing scans, failed deliveries, customs holds, and credit holds.</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded-3xl border border-line bg-white p-4">
            <Badge value={row.values.kind} />
            <h2 className="mt-2 font-serif text-2xl">{row.values.waybill}</h2>
            <p className="text-sm text-muted">Since {row.values.since} · {row.values.owner}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapPins({ rows }: { rows: { lat: string; lng: string; label: string }[] }) {
  return (
    <svg viewBox="0 0 400 180" className="mt-4 h-44 w-full rounded-3xl bg-[#14324a]" role="img" aria-label="Simulated positions">
      <path d="M20 120 C 80 40, 140 150, 200 90 S 320 40, 380 100" fill="none" stroke="#e7d7b8" strokeWidth="2" />
      {rows.map((row) => {
        const x = ((Number(row.lng) - 55) / 30) * 360 + 20;
        const y = ((36 - Number(row.lat)) / 20) * 150 + 10;
        return (
          <g key={row.label}>
            <circle cx={Math.max(16, Math.min(384, x))} cy={Math.max(16, Math.min(164, y))} r="5" fill="#f3efe6" />
            <text x={Math.max(16, Math.min(340, x)) + 8} y={Math.max(20, Math.min(160, y))} fill="#f3efe6" fontSize="10">{row.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function TrackingBoard() {
  const lane = useLane();
  const rows = lane.list("visibility/tracking");
  return (
    <div>
      <h1 className="font-serif text-4xl">Tracking</h1>
      <MapPins rows={rows.map((row) => ({ lat: row.values.lat, lng: row.values.lng, label: row.values.waybill }))} />
      <ul className="mt-4 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm">
            <span className="font-semibold">{row.values.waybill}</span> · {row.values.last} · ETA {row.values.eta}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PodView() {
  const lane = useLane();
  const pods = lane.list("visibility/pod");
  const [form, setForm] = useState({ waybill: "LN-10021", receiver: "", otp: "", barcode: "", note: "", photo: "" });
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Panel>
        <h1 className="font-serif text-3xl">Capture POD</h1>
        <div className="mt-3 grid gap-3">
          {(["waybill", "receiver", "otp", "barcode", "note"] as const).map((key) => (
            <label key={key}><FieldLabel>{key}</FieldLabel><TextInput value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>
          ))}
          <label><FieldLabel>Photo</FieldLabel><input type="file" accept="image/*" onChange={(event) => setForm({ ...form, photo: event.target.files?.[0]?.name || "" })} /></label>
          <Button onClick={() => lane.capturePod(form)}>Save proof</Button>
        </div>
      </Panel>
      <ul className="space-y-3">
        {pods.map((row) => (
          <li key={row.id} className="rounded-3xl border border-line bg-white p-4 text-sm">
            <p className="font-semibold">{row.values.waybill}</p>
            <p>{row.values.receiver} · OTP {row.values.otp} · {row.values.photo || "No photo"}</p>
            <p className="text-muted">{row.values.at} · {row.values.lat}, {row.values.lng}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DriverView() {
  const lane = useLane();
  const name = lane.account?.name || "";
  const stops = lane.list("dispatch/routes").filter((row) => !name || row.values.driver === name || lane.account?.role !== "driver");
  return (
    <div className="mx-auto max-w-lg">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">Today</p>
      <h1 className="font-serif text-4xl">{name || "Stops"}</h1>
      <ul className="mt-4 space-y-3">
        {stops.map((stop) => (
          <li key={stop.id} className="rounded-3xl border border-line bg-white p-4">
            <Badge value={stop.values.status} />
            <h2 className="mt-2 text-lg font-semibold">{stop.values.stop}</h2>
            <p className="text-sm text-muted">{stop.values.waybill} · {stop.values.window}</p>
            <a className="mt-2 inline-block text-sm font-semibold text-sea" href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(stop.values.stop)}`}>Navigate</a>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Arrived", "Completed", "Failed"].map((status) => (
                <Button key={status} variant="ghost" onClick={() => lane.setStopStatus(stop.id, status)}>{status}</Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ImportView() {
  const lane = useLane();
  const [text, setText] = useState("waybill,customer,mode,origin,destination,weightKg,status\n,Indigo Mills,Parcel,Faisalabad,Karachi,30,Booked");
  const [count, setCount] = useState<number | null>(null);
  return (
    <Panel>
      <h1 className="font-serif text-3xl">Bulk import</h1>
      <p className="mt-1 text-sm text-muted">CSV columns: waybill, customer, mode, origin, destination, weightKg, status. A blank waybill takes the next number.</p>
      <TextArea className="mt-3 font-mono text-xs" value={text} onChange={(event) => setText(event.target.value)} />
      <Button className="mt-3" onClick={() => setCount(lane.importShipments(text))}>Import</Button>
      {count !== null && <p className="mt-2 text-sm">{count} shipments created.</p>}
    </Panel>
  );
}

export function RecycleView() {
  const lane = useLane();
  const rows = lane.db.entities.filter((row) => row.deletedAt && row.tenantId === lane.tenantId);
  return (
    <div>
      <h1 className="font-serif text-4xl">Recycle bin</h1>
      <ul className="mt-4 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white px-4 py-3">
            <span className="text-sm"><span className="font-semibold">{row.screen}</span> · {row.values.name || row.values.number || row.values.waybill || row.id}</span>
            <span className="flex gap-2">
              <Button variant="ghost" onClick={() => lane.restore(row.id)}>Restore</Button>
              <Button variant="danger" onClick={() => lane.purge(row.id)}>Delete forever</Button>
            </span>
          </li>
        ))}
        {rows.length === 0 && <Empty title="The bin is empty" body="Trashed records from every desk land here." />}
      </ul>
    </div>
  );
}

export function AuditView() {
  const lane = useLane();
  return (
    <div>
      <h1 className="font-serif text-4xl">Audit log</h1>
      <ul className="mt-4 divide-y divide-line rounded-3xl border border-line bg-white">
        {lane.audit.map((row) => (
          <li key={row.id} className="px-4 py-3 text-sm">
            <span className="font-semibold">{row.action}</span> {row.record}
            <span className="block text-xs text-muted">{row.actor} · {row.screen} · {row.at.slice(0, 16).replace("T", " ")} · {row.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InboxView() {
  const lane = useLane();
  return (
    <div>
      <h1 className="font-serif text-4xl">Notifications</h1>
      <ul className="mt-4 space-y-2">
        {lane.notices.map((notice) => (
          <li key={notice.id}>
            <Link href={notice.href} onClick={() => lane.markRead(notice.id)} className="block rounded-2xl border border-line bg-white px-4 py-3">
              <span className="font-semibold">{notice.title}</span>
              {!notice.read && <Badge value="New" />}
              <span className="mt-1 block text-sm text-muted">{notice.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SystemView() {
  const lane = useLane();
  const def = findScreen("settings", "system");
  const [values, setValues] = useState<Record<string, string>>(lane.system());
  return (
    <Panel>
      <h1 className="font-serif text-3xl">System settings</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(def?.fields ?? []).map((field) => (
          <label key={field.key}>
            <FieldLabel>{field.label}</FieldLabel>
            {field.kind === "select" ? (
              <select className="h-11 w-full rounded-xl border border-line bg-white px-3" value={values[field.key] || ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}>
                {field.options?.map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : (
              <TextInput value={values[field.key] || ""} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => lane.saveSystem(values)}>Save</Button>
        <Button variant="danger" onClick={() => lane.resetDemo()}>Restore demo data</Button>
      </div>
    </Panel>
  );
}

export function ProfileView() {
  const lane = useLane();
  const row = lane.list("settings/users").find((item) => item.values.email === lane.account?.email);
  const [values, setValues] = useState(row?.values ?? { name: lane.account?.name || "", title: lane.account?.title || "", email: lane.account?.email || "", branch: lane.account?.branch || "", phone: "" });
  return (
    <Panel className="max-w-xl">
      <h1 className="font-serif text-3xl">My profile</h1>
      <div className="mt-4 grid gap-3">
        {["name", "title", "branch", "phone"].map((key) => (
          <label key={key}><FieldLabel>{key}</FieldLabel><TextInput value={values[key] || ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} /></label>
        ))}
        <label><FieldLabel>Email</FieldLabel><TextInput value={values.email || ""} disabled /></label>
        <Button onClick={() => row && lane.update(row.id, values)}>Save profile</Button>
      </div>
    </Panel>
  );
}

export function CustomReport() {
  const lane = useLane();
  const sources = SCREENS.filter((screen) => (screen.fields?.length ?? 0) > 0);
  const [source, setSource] = useState(sources[0] ? `${sources[0].module}/${sources[0].slug}` : "");
  const def = sources.find((screen) => `${screen.module}/${screen.slug}` === source);
  const [picked, setPicked] = useState<string[]>(def ? columnsFor(def).map((field) => field.key) : []);
  const [name, setName] = useState("Weekly cut");
  const rows = source ? lane.list(source) : [];
  return (
    <div>
      <h1 className="font-serif text-4xl">Custom report</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label><FieldLabel>Desk</FieldLabel>
          <select className="h-11 w-full rounded-xl border border-line bg-white px-3" value={source} onChange={(event) => {
            setSource(event.target.value);
            const next = sources.find((screen) => `${screen.module}/${screen.slug}` === event.target.value);
            setPicked(next ? columnsFor(next).map((field) => field.key) : []);
          }}>
            {sources.map((screen) => <option key={`${screen.module}/${screen.slug}`} value={`${screen.module}/${screen.slug}`}>{screen.label}</option>)}
          </select>
        </label>
        <label><FieldLabel>Snapshot name</FieldLabel><TextInput value={name} onChange={(event) => setName(event.target.value)} /></label>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {(def?.fields ?? []).filter((field) => field.kind !== "textarea").map((field) => (
          <label key={field.key} className="inline-flex items-center gap-1">
            <input type="checkbox" checked={picked.includes(field.key)} onChange={(event) => setPicked((prev) => event.target.checked ? [...prev, field.key] : prev.filter((key) => key !== field.key))} />
            {field.label}
          </label>
        ))}
      </div>
      <Button className="mt-3" onClick={() => lane.saveSnapshot(name, source, picked.join(", "))}>Save snapshot</Button>
      <div className="mt-4 overflow-x-auto rounded-3xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead><tr>{picked.map((key) => <th key={key} className="px-3 py-2">{key}</th>)}</tr></thead>
          <tbody>
            {rows.slice(0, 12).map((row) => (
              <tr key={row.id} className="border-t border-line">{picked.map((key) => <td key={key} className="px-3 py-2">{row.values[key]}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StationView() {
  const lane = useLane();
  const branch = lane.account?.branch || "";
  const rows = lane.list("forwarding/files").filter((row) => !branch || row.values.branch === branch);
  return (
    <div>
      <h1 className="font-serif text-4xl">My station</h1>
      <p className="mt-2 text-sm text-muted">Files whose branch is {branch || "not set"}.</p>
      <ul className="mt-4 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-line bg-white px-4 py-3">
            <span className="font-semibold">{row.values.file}</span> · {row.values.lane} · {row.values.status}
          </li>
        ))}
        {rows.length === 0 && <Empty title="No files at this station" body="Forwarding files with your branch appear here." />}
      </ul>
    </div>
  );
}

export function TrackPublic() {
  const lane = useLane();
  const params = useSearchParams();
  const initial = params.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const hit = useMemo(() => {
    const needle = submitted.trim().toLowerCase();
    if (!needle) return null;
    return lane.db.entities.find((row) => row.screen === "bookings/shipments" && !row.deletedAt && [row.values.waybill, row.values.orderRef, row.values.container, row.values.po].some((item) => item && item.toLowerCase() === needle)) ?? null;
  }, [submitted, lane.db.entities]);
  const miss = Boolean(submitted) && !hit;
  function search(value = query) {
    setSubmitted(value);
  }
  const events = hit ? lane.db.entities.filter((row) => row.screen === "visibility/milestones" && row.values.waybill === hit.values.waybill && !row.deletedAt) : [];
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-4xl">Track a shipment</h1>
      <p className="mt-2 text-sm text-muted">Use a waybill, order, container, or purchase order. Try LN-10021, LN-10044, or MSCU1234567.</p>
      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); search(); }}>
        <TextInput aria-label="Tracking number" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Button type="submit">Track</Button>
      </form>
      {miss && <p className="mt-4 text-sm">Nothing matched that reference.</p>}
      {hit && (
        <Panel className="mt-4">
          <Badge value={hit.values.status} />
          <h2 className="mt-2 font-serif text-3xl">{hit.values.waybill}</h2>
          <p>{hit.values.origin} → {hit.values.destination}</p>
          <p className="text-sm text-muted">{hit.values.customer} · ETA {hit.values.eta || "to be confirmed"}</p>
          {/hold|late|exception/i.test(hit.values.status) && <p className="mt-2 text-sm text-rose-800">This shipment needs attention before it can be promised again.</p>}
          <ol className="mt-4 space-y-3">
            {events.map((event) => (
              <li key={event.id}>
                <p className="font-semibold">{event.values.event} · {event.values.location}</p>
                <p className="text-sm text-muted">{event.values.at} {event.values.exception} {event.values.note}</p>
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </div>
  );
}

export function labelFor(row: Entity) {
  return row.values.waybill || row.values.name || row.values.number || row.id;
}

export function roleTitle(role: string) {
  return roleLabel(role);
}

export function moduleFrom(value: string): ModuleKey | null {
  return isModule(value) ? value : null;
}
