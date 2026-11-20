"use client";

import { FAQS, TESTIMONIALS } from "@/lib/marketing";
import { useLane } from "@/lib/store";
import { SiteFrame } from "@/components/site";
import Link from "next/link";

const MODES = [
  ["Parcel", "Piece labels, volumetric weight, and a door photo."],
  ["Linehaul", "Full trucks, tenders, and a driver who closes the stop."],
  ["Ocean & air", "House bills, master bills, and a demurrage clock."],
  ["Warehouse", "Client-owned stock, waves, and storage by the day."]
];

const STEPS = [
  ["Quote", "A tariff, a fuel line, and a margin floor before anyone promises a date."],
  ["Move", "A load, a tender, a scan, and a person who can see the exception."],
  ["Prove", "Name, photo, time, and a pin. Finance does not chase the clipboard."],
  ["Bill", "The rated amount, the carrier bill, and the difference between them."]
];

export function Landing() {
  const lane = useLane();
  const hero = lane.list("settings/landing-images").find((row) => row.values.slot === "Hero");
  return (
    <SiteFrame>
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.15fr_.85fr] lg:pt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sea">Transport operating system</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[1.02] sm:text-6xl">Every shipment, dock, and driver on one desk.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            Lane is the control room for carriers, forwarders, and 3PLs. Quote the lane, tender the truck, watch the exception, and invoice what you actually rated.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6">{hero?.values.caption}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-semibold text-paper">Book a demo</Link>
            <Link href="/quote" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-semibold ring-1 ring-line">Request a rate</Link>
          </div>
        </div>
        <form action="/track" className="rounded-[2rem] bg-[#0e1c2c] p-5 text-paper shadow-[0_24px_60px_rgba(20,32,51,.25)]">
          <p className="text-xs uppercase tracking-[0.18em] text-sand">Track</p>
          <p className="mt-2 font-serif text-3xl">Where is it, really?</p>
          <label className="mt-5 block text-sm">
            Waybill, container, or order
            <input name="q" required className="mt-2 h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-3 text-paper outline-none" placeholder="LN-10021" />
          </label>
          <button className="mt-3 h-12 w-full rounded-full bg-sand font-semibold text-ink" type="submit">Follow the shipment</button>
          <p className="mt-4 text-xs leading-5 text-white/60">Demo references: LN-10021 is late, LN-10044 is on the road, MSCU1234567 is held at customs.</p>
        </form>
      </section>

      <section id="product" className="bg-[#0e1c2c] py-16 text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sand">Modes</p>
            <h2 className="mt-2 font-serif text-4xl">One company. Every way the freight moves.</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {MODES.map(([title, copy]) => (
              <li key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">How it works</p>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {STEPS.map(([title, copy], index) => (
            <li key={title} className="rounded-3xl border border-line bg-white p-5">
              <span className="font-serif text-3xl text-sea">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 lg:grid-cols-3">
        {[
          ["Network", "Branches, zones, lanes, and the cutoff that makes a promise true."],
          ["Control tower", "Late, dwell, missing scan, customs hold, credit hold. A queue, not a map of green dots."],
          ["Administration", "Companies, roles, and a menu right for every screen. Hidden means hidden."]
        ].map(([title, copy]) => (
          <article key={title} className="rounded-3xl bg-white p-6 ring-1 ring-line">
            <h3 className="font-serif text-2xl">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-[2rem] border border-line bg-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">Lanes on the desk</p>
          <ul className="mt-4 divide-y divide-line">
            {lane.list("network/lanes").map((laneRow) => (
              <li key={laneRow.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <span className="font-semibold">{laneRow.values.origin} → {laneRow.values.destination}</span>
                <span className="text-sm text-muted">{laneRow.values.mode} · {laneRow.values.transitHours} hours · cutoff {laneRow.values.cutoff}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 lg:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <figure key={item.name} className="rounded-3xl bg-[#14324a] p-6 text-paper">
            <blockquote className="font-serif text-2xl leading-snug">“{item.quote}”</blockquote>
            <figcaption className="mt-4 text-sm text-white/70">{item.name}, {item.company}</figcaption>
          </figure>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="font-serif text-4xl">Questions</h2>
        <div className="mt-4 divide-y divide-line">
          {FAQS.map((item) => (
            <details key={item.q} className="py-3">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm leading-6 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-sea px-6 py-8 text-paper sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-4xl">Put the Monday spreadsheet down.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">We will open the demo company, the late parcel, and the ocean file that is still waiting on a licence.</p>
          </div>
          <Link href="/demo" className="rounded-full bg-paper px-5 py-3 font-semibold text-ink">Book a demo</Link>
        </div>
      </section>
    </SiteFrame>
  );
}
