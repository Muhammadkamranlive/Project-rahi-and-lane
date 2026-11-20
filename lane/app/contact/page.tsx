import type { Metadata } from "next";
import { ContactPage } from "@/components/public";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return <ContactPage />;
}
