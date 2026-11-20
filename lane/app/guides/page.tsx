import type { Metadata } from "next";
import { GuidesPage } from "@/components/public";

export const metadata: Metadata = { title: "Guides" };

export default function Page() {
  return <GuidesPage />;
}
