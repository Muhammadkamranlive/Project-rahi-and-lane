import type { Metadata } from "next";
import { QuotePage } from "@/components/public";

export const metadata: Metadata = { title: "Request a rate" };

export default function Page() {
  return <QuotePage />;
}
