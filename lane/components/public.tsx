"use client";

import { LEGAL, legalPage } from "@/lib/legal";
import { GUIDES } from "@/lib/guides";
import { MODULES } from "@/lib/model";
import { PACKAGES, solution } from "@/lib/marketing";
import { useLane } from "@/lib/store";
import { SiteFrame } from "@/components/site";
import { RateShop, TrackPublic } from "@/components/views";
import { Button, FieldLabel, Panel, TextArea, TextInput } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

export function TrackPage() {
  return <SiteFrame><div className="mx-auto max-w-6xl px-4 py-10"><TrackPublic /></div></SiteFrame>;
}

export function QuotePage() {
  return <SiteFrame><div className="mx-auto max-w-6xl px-4 py-10"><RateShop publicMode /></div></SiteFrame>;
}

export function PricingPage() {
  const packages = PACKAGES;
  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-serif text-5xl">Pricing</h1>
        <p className="mt-3 max-w-2xl text-muted">Start with one branch. Add the network when dispatch, the shed, and the audit have to share a customer.</p>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {packages.map((item) => (
            <li key={item.name} className="rounded-3xl border border-line bg-white p-6">
              <h2 className="font-serif text-3xl">{item.name}</h2>
              <p className="mt-2 font-serif text-3xl">{item.price}</p>
              <p className="text-sm text-muted">{item.period}</p>
              <ul className="mt-4 space-y-2 text-sm">{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </li>
          ))}
        </ul>
      </div>
    </SiteFrame>
  );
}

export function CoveragePage() {
  const lane = useLane();
  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-serif text-5xl">Coverage</h1>
        <p className="mt-3 max-w-2xl text-muted">Stations and lanes currently on the demo network. A live map connector can be tested from Administration, and is not called from this page.</p>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {lane.list("network/branches").concat(lane.list("network/ports"), lane.list("network/airports")).map((row) => (
            <li key={row.id} className="rounded-3xl border border-line bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-muted">{row.values.code}</p>
              <p className="font-semibold">{row.values.name}</p>
              <p className="text-sm text-muted">{row.values.city}, {row.values.country}</p>
            </li>
          ))}
        </ul>
      </div>
    </SiteFrame>
  );
}

export function BlogIndex() {
  const lane = useLane();
  const posts = lane.list("settings/blogs").filter((row) => row.values.status === "Published");
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-serif text-5xl">Journal</h1>
        <ul className="mt-8 space-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.values.slug}`}>
                <h2 className="font-serif text-3xl">{post.values.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{post.values.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SiteFrame>
  );
}

export function BlogPost({ slug }: { slug: string }) {
  const lane = useLane();
  const post = lane.list("settings/blogs").find((row) => row.values.slug === slug);
  return (
    <SiteFrame>
      <article className="mx-auto max-w-3xl px-4 py-12">
        {post ? (
          <>
            <h1 className="font-serif text-5xl">{post.values.title}</h1>
            <p className="mt-6 whitespace-pre-wrap text-lg leading-8">{post.values.body}</p>
          </>
        ) : <p>This story is not published.</p>}
      </article>
    </SiteFrame>
  );
}

export function GuidesPage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-serif text-5xl">Guides</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {MODULES.map((mod) => (
            <article key={mod.key} className="rounded-3xl border border-line bg-white p-5">
              <h2 className="font-serif text-2xl">{GUIDES[mod.key].title}</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
                {GUIDES[mod.key].steps.map((step) => <li key={step.title}><span className="font-semibold text-ink">{step.title}.</span> {step.detail}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}

function LeadForm({ source, title, lede }: { source: string; title: string; lede: string }) {
  const lane = useLane();
  const [form, setForm] = useState({ name: "", company: "", email: "", note: "" });
  const [done, setDone] = useState(false);
  return (
    <SiteFrame>
      <Panel className="mx-auto mt-10 max-w-xl">
        <h1 className="font-serif text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{lede}</p>
        {done ? <p className="mt-4 text-sm">Saved. The sales desk in this browser can open it under Leads.</p> : (
          <form className="mt-4 grid gap-3" onSubmit={(event) => {
            event.preventDefault();
            lane.create("sales/leads", { name: form.name, company: form.company, source, email: form.email, status: "New" }, form.note);
            setDone(true);
          }}>
            <label><FieldLabel>Name</FieldLabel><TextInput required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label><FieldLabel>Company</FieldLabel><TextInput required value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></label>
            <label><FieldLabel>Email</FieldLabel><TextInput type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label><FieldLabel>What do you move?</FieldLabel><TextArea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
            <Button type="submit">Send</Button>
          </form>
        )}
      </Panel>
    </SiteFrame>
  );
}

export function ContactPage() {
  return <LeadForm source="Contact" title="Contact" lede="Tell us the lanes and the modes. A person on the sales desk picks it up." />;
}

export function DemoPage() {
  return <LeadForm source="Demo" title="Book a demo" lede="We will walk the late parcel, the truck on the M9, and the box held for a missing licence." />;
}

export function SolutionPage({ slug }: { slug: string }) {
  const item = solution(slug);
  if (!item) return <SiteFrame><p className="px-4 py-12">That solution is not listed.</p></SiteFrame>;
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea">Solutions</p>
        <h1 className="mt-2 font-serif text-5xl">{item.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{item.lede}</p>
        <ul className="mt-6 space-y-2">{item.points.map((point) => <li key={point} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">{point}</li>)}</ul>
        <Link href="/demo" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-semibold text-paper">Book a demo</Link>
      </div>
    </SiteFrame>
  );
}

export function LegalPage({ slug }: { slug: string }) {
  const page = legalPage(slug);
  return (
    <SiteFrame>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-serif text-5xl">{page?.title || "Notice"}</h1>
        <div className="mt-6 space-y-4 text-base leading-7">
          {page?.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <ul className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
          {LEGAL.map((item) => <li key={item.slug}><Link href={`/legal/${item.slug}`}>{item.title}</Link></li>)}
        </ul>
      </article>
    </SiteFrame>
  );
}
