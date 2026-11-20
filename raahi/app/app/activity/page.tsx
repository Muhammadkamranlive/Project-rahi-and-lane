"use client";

import { JobBadge } from "@/components/JobBadge";
import { Empty } from "@/components/ui";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function ActivityPage() {
  const { me, state } = useStore();
  if (!me) return null;
  const jobs = state.jobs.filter((job) => job.senderId === me.id || job.travelerId === me.id);

  return (
    <div className="space-y-3">
      <h1 className="font-serif text-4xl">Jobs</h1>
      <p className="text-sm text-[var(--muted)]">Every carry that has a contract, escrow or handover on this account.</p>
      {jobs.length === 0 ? (
        <Empty title="No jobs yet" body="Request a traveler or wait for a sender to find your trip." />
      ) : (
        jobs.map((job) => {
          const trip = state.trips.find((item) => item.id === job.tripId);
          const parcel = state.parcels.find((item) => item.id === job.parcelId);
          return (
            <Link key={job.id} href={`/app/jobs/${job.id}`} className="block rounded-3xl bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">
                  {trip?.fromCity} → {parcel?.destVillage}
                </p>
                <JobBadge status={job.status} />
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {money(job.escrow.amountGbp)} · {me.id === job.senderId ? "You are sending" : "You are carrying"}
              </p>
            </Link>
          );
        })
      )}
    </div>
  );
}
