import type { Metadata } from "next";
import { DemoPage } from "@/components/public";

export const metadata: Metadata = { title: "Book a demo" };

export default function Page() {
  return <DemoPage />;
}
