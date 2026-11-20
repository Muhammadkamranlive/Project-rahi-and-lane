import { Badge } from "@/components/ui";
import { money, prettyDate } from "@/lib/format";
import type { Trip, User } from "@/lib/types";
import { MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function TripCard({ trip, traveler }: { trip: Trip; traveler?: User }) {
  return (
    <Link href={`/app/trips/${trip.id}`} className="block rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(26,36,28,.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
            {trip.direction === "out_of_pakistan" ? "Leaving Pakistan" : "Into Pakistan"}
          </p>
          <h3 className="mt-1 font-serif text-2xl leading-tight">
            {trip.fromCity} <span className="text-[var(--muted)]">→</span> {trip.toCity}
          </h3>
        </div>
        {trip.itineraryVerified ? <Badge tone="ok">Flight verified</Badge> : <Badge>Unverified</Badge>}
      </div>
      <p className="mt-2 flex items-center gap-1 text-sm text-[var(--muted)]">
        <MapPin size={14} /> {prettyDate(trip.departDate)} · {trip.fromAirport}–{trip.toAirport}
      </p>
      {trip.villageStops.length > 0 && (
        <p className="mt-2 text-sm text-[var(--ink)]">
          Village drops: <span className="font-semibold">{trip.villageStops.join(", ")}</span>
        </p>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3 text-sm">
        <span className="flex items-center gap-2">
          {traveler ? (
            <>
              <ShieldCheck size={16} className="text-[var(--green)]" />
              {traveler.displayName} · {traveler.completedDeliveries} carries
            </>
          ) : (
            "Traveler"
          )}
        </span>
        <span className="font-semibold">
          {money(trip.feePerKgGbp)}/kg · {trip.remainingKg}kg left
        </span>
      </div>
    </Link>
  );
}
