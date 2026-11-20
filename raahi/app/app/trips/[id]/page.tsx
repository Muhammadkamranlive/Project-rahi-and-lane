"use client";

import { Avatar, Badge, Button, Card, Empty } from "@/components/ui";
import { money, prettyDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, me, requestCarry } = useStore();
  const trip = state.trips.find((item) => item.id === params.id);
  const traveler = state.users.find((user) => user.id === trip?.travelerId);
  const myParcels = state.parcels.filter((parcel) => parcel.senderId === me?.id && parcel.status === "open");
  const [parcelId, setParcelId] = useState(myParcels[0]?.id || "");
  const [error, setError] = useState("");

  if (!trip || !traveler) return <Empty title="Trip missing" body="It may have been cancelled." />;

  const isMine = me?.id === trip.travelerId;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        {trip.direction === "out_of_pakistan" ? "Leaving Pakistan" : "Coming into Pakistan"}
      </p>
      <h1 className="font-serif text-4xl leading-tight">
        {trip.fromCity} to {trip.toCity}
      </h1>
      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={traveler.displayName} size="lg" />
          <div>
            <p className="font-semibold">{traveler.displayName}</p>
            <p className="text-sm text-[var(--muted)]">
              Trust {traveler.trustScore} · {traveler.completedDeliveries} completed · {traveler.rating}★
            </p>
            <div className="mt-1 flex gap-1">
              {traveler.kyc.status === "verified" && <Badge tone="ok">KYC</Badge>}
              {trip.itineraryVerified && <Badge tone="gold">Ticket checked</Badge>}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{traveler.bio}</p>
      </Card>
      <Card>
        <p className="text-sm">{prettyDate(trip.departDate)} · {trip.fromAirport} → {trip.toAirport} · {trip.airline} {trip.flightNoMasked}</p>
        <p className="mt-2 text-sm">Village drops: <b>{trip.villageStops.join(", ") || "Airport city only"}</b></p>
        <p className="mt-2 text-sm">{trip.remainingKg}kg spare · {money(trip.feePerKgGbp)} per kg</p>
        {trip.notes && <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{trip.notes}</p>}
      </Card>

      {!isMine && (
        <Card>
          <h2 className="font-serif text-2xl">Ask this traveler to carry</h2>
          {me?.kyc.status !== "verified" ? (
            <div className="mt-3">
              <p className="text-sm text-[var(--muted)]">KYC is required before a request. That is the trust layer.</p>
              <Button className="mt-3" href="/app/kyc">Complete KYC</Button>
            </div>
          ) : myParcels.length === 0 ? (
            <div className="mt-3">
              <p className="text-sm text-[var(--muted)]">Create a parcel first so we can screen items and build a consignment note.</p>
              <Button className="mt-3" href="/app/send">Create parcel</Button>
            </div>
          ) : (
            <form
              className="mt-3 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                const result = requestCarry(trip.id, parcelId);
                if (result.error) setError(result.error);
                else if (result.id) router.push(`/app/jobs/${result.id}`);
              }}
            >
              <select className="w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-3 text-sm" value={parcelId} onChange={(e) => setParcelId(e.target.value)}>
                {myParcels.map((parcel) => (
                  <option key={parcel.id} value={parcel.id}>
                    {parcel.destVillage || parcel.destCity} · {parcel.totalWeightKg}kg · {money(parcel.totalValueGbp)}
                  </option>
                ))}
              </select>
              {error && <p className="text-sm text-[#9b2c1f]">{error}</p>}
              <Button type="submit">Send legally protected request</Button>
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
