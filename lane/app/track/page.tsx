import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackPage } from "@/components/public";

export const metadata: Metadata = { title: "Track a shipment" };

export default function Page() {
  return <Suspense fallback={<p className="p-8 text-sm">Loading tracking…</p>}><TrackPage /></Suspense>;
}
