import { Brand, Button } from "@/components/ui";
import { TRUST_PILLARS } from "@/lib/compliance";
import Link from "next/link";

const corridors = [
  ["London", "Lahore · Gujranwala villages"],
  ["Birmingham", "Sialkot · Wazirabad"],
  ["Manchester", "Faisalabad · Jaranwala"],
  ["Toronto", "Peshawar · Charsadda"],
  ["Karachi", "London · Southall"],
  ["Islamabad", "Manchester · Bradford"],
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[var(--cream)] text-[var(--ink)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Brand />
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/legal/trust" className="hidden sm:inline">
            Trust & law
          </Link>
          <Link href="/login" className="rounded-full bg-[var(--green)] px-4 py-2 text-[var(--cream)]">
            Open app
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">Pakistan travel corridor</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[1.05] sm:text-6xl">
            Send a gift home with someone already going to the village.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
            TCS and international couriers are expensive, and they stop at a depot. Raahi matches you with KYC-verified
            travelers flying into or out of Pakistan who can hand a personal parcel to family — with escrow, a signed
            contract, and customs checks.
          </p>
          <div className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
            <Button href="/login">Try the live demo</Button>
            <Button href="/app/trips" variant="ghost">
              Browse travelers
            </Button>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-[var(--ink)] sm:grid-cols-2">
            {[
              "CNIC / passport KYC before matching",
              "UK GDPR data rights built in",
              "Escrow held until village OTP",
              "No cash, no commercial cargo",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--green)] text-[9px] text-[var(--cream)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] bg-[var(--ink)] p-5 text-[var(--cream)] shadow-[0_30px_80px_rgba(23,35,28,.25)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-soft)]">Open trip</p>
          <p className="mt-3 font-serif text-4xl">Birmingham → Lahore</p>
          <p className="mt-2 text-sm text-white/70">Then Gujranwala, Sialkot, Wazirabad · 18 Sep · 7.5kg spare</p>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-white/8 p-4">
              <p className="text-sm font-semibold">Ayesha, London</p>
              <p className="text-sm text-white/70">Winter clothes + a gifted phone for Qila Didar Singh. Not a depot drop.</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[var(--green)] p-4">
              <span className="text-sm">Escrow held · contract signed</span>
              <span className="font-serif text-xl">£48</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] py-16 text-[var(--cream)]">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold-soft)]">How it works</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl">People are already flying. Raahi makes the carry legal and checkable.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                mark: "01",
                title: "Post the parcel or the trip",
                body: "Senders list a gift and a village. Travelers list spare kilos, airport, and the towns they will actually visit.",
              },
              {
                mark: "02",
                title: "Identity, contract, escrow",
                body: "Both sides pass KYC. They sign a bailment consignment. The fee sits with a licensed payment partner until handover.",
              },
              {
                mark: "03",
                title: "OTP in the village",
                body: "Pickup code at the airport. Delivery code with family. Photos optional. Then escrow releases. Dispute freeze if something is wrong.",
              },
            ].map((step) => (
              <div key={step.title} className="rounded-3xl bg-white/6 p-5">
                <p className="font-serif text-3xl text-[var(--gold-soft)]">{step.mark}</p>
                <h3 className="mt-4 font-serif text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-4xl">The trust problem, solved in product — not in WhatsApp.</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Informal “can you take this for my cousin?” is how families already move gifts. The risk is theft, customs
          seizure, and unlicensed courier activity. Raahi is a matching marketplace, not a postal operator. The legal
          structure is bailment + escrow + identity + customs warranties.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {TRUST_PILLARS.map((pillar) => (
            <div key={pillar.title} className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(26,36,28,.06)]">
              <h3 className="font-serif text-2xl">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pillar.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button href="/legal/trust" variant="ghost" className="sm:w-auto">
            Read the full legal model
          </Button>
        </div>
      </section>

      <section className="bg-[var(--sage)] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl">Corridors people actually need</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {corridors.map(([from, to]) => (
              <div key={from + to} className="rounded-3xl bg-white px-5 py-4">
                <p className="text-sm text-[var(--muted)]">{from}</p>
                <p className="font-serif text-2xl">{to}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-[2rem] bg-[var(--green)] p-8 text-[var(--cream)] md:p-12">
          <h2 className="max-w-xl font-serif text-4xl">Not a cheaper TCS. A verified person going to the same village.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
            Commercial stock, cash, and prohibited goods still belong on a licensed courier. Raahi is for personal gifts
            and used belongings that fit in accompanying baggage — with the paperwork to show that.
          </p>
          <div className="mt-6 max-w-xs">
            <Button href="/login" variant="secondary">
              Open the app
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] px-5 py-10 text-sm text-[var(--muted)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <div className="flex flex-wrap gap-4">
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/cookies">Cookies</Link>
            <Link href="/legal/customs">Customs</Link>
            <Link href="/legal/prohibited">Prohibited</Link>
            <Link href="/legal/gdpr">GDPR</Link>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-xs">
          Raahi is a product template. Operating this commercially requires Pakistan and UK legal counsel, a licensed
          payment partner, and a KYC vendor. It is not legal advice.
        </p>
      </footer>
    </div>
  );
}
