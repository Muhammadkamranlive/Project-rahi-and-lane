"use client";

import { TripCard } from "@/components/TripCard";
import { Badge, Button, Card } from "@/components/ui";
import { JobBadge } from "@/components/JobBadge";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function HomePage() {
  const { me, state } = useStore();
  if (!me) return null;

  const myJobs = state.jobs.filter((job) => job.senderId === me.id || job.travelerId === me.id);
  const openTrips = state.trips.filter((trip) => trip.status === "open").slice(0, 3);

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">Assalamu alaikum</p>
        <h1 className="mt-1 font-serif text-4xl leading-tight">{me.displayName.split(" ")[0]}, who is flying your way?</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {me.kyc.status === "verified"
            ? "Identity verified. You can match, sign and fund escrow."
            : "Finish KYC to unlock matching. Listings stay visible, contracts do not."}
        </p>
      </section>

      {me.kyc.status !== "verified" && (
        <Card className="bg-[var(--gold-soft)]">
          <p className="font-serif text-xl">KYC required</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Passport or CNIC, liveness, address and a PEP declaration.</p>
          <div className="mt-3">
            <Button href="/app/kyc">Start verification</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button href="/app/send">Send a parcel</Button>
        <Button href="/app/trips/new" variant="secondary">
          Post my trip
        </Button>
      </div>

      {myJobs.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-serif text-2xl">Your live jobs</h2>
          {myJobs.slice(0, 3).map((job) => {
            const trip = state.trips.find((item) => item.id === job.tripId);
            const parcel = state.parcels.find((item) => item.id === job.parcelId);
            return (
              <Link key={job.id} href={`/app/jobs/${job.id}`} className="block rounded-3xl bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    {trip?.fromCity} → {parcel?.destVillage || trip?.toCity}
                  </p>
                  <JobBadge status={job.status} />
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{parcel?.items.map((item) => item.name).join(" · ")}</p>
              </Link>
            );
          })}
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl">Travelers this month</h2>
          <Link href="/app/trips" className="text-sm font-semibold text-[var(--green)]">
            See all
          </Link>
        </div>
        {openTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} traveler={state.users.find((user) => user.id === trip.travelerId)} />
        ))}
      </section>

      <Card>
        <Badge tone="gold">Village last-mile</Badge>
        <p className="mt-2 font-serif text-2xl">Not a depot. A person going home.</p>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          Filter travelers by the village they will actually visit. Escrow stays frozen until family enter the delivery
          code.
        </p>
      </Card>
    </div>
  );
}
