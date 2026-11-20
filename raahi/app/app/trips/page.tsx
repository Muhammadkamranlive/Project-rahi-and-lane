"use client";

import { TripCard } from "@/components/TripCard";
import { Button, Empty, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";

export default function TripsPage() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [direction, setDirection] = useState("all");

  const trips = useMemo(() => {
    return state.trips.filter((trip) => {
      const blob = `${trip.fromCity} ${trip.toCity} ${trip.villageStops.join(" ")}`.toLowerCase();
      const matchesQuery = blob.includes(q.toLowerCase());
      const matchesDir = direction === "all" || trip.direction === direction;
      return trip.status === "open" && matchesQuery && matchesDir;
    });
  }, [state.trips, q, direction]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-4xl">Find a traveler</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Search a city or village. Example: Gujranwala, Charsadda, Southall.</p>
      </div>
      <input className={inputClass} placeholder="Village, city or airport" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex gap-2">
        {[
          ["all", "All"],
          ["into_pakistan", "Into PK"],
          ["out_of_pakistan", "Leaving PK"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setDirection(value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              direction === value ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--muted)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <Button href="/app/trips/new" variant="ghost">
        I am traveling — post spare kilos
      </Button>
      {trips.length === 0 ? (
        <Empty title="No matching trips" body="Post a parcel anyway. Travelers can offer when they list a route." />
      ) : (
        trips.map((trip) => <TripCard key={trip.id} trip={trip} traveler={state.users.find((user) => user.id === trip.travelerId)} />)
      )}
    </div>
  );
}
