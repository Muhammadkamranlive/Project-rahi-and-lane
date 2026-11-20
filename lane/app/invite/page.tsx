import type { Metadata } from "next";
import { InviteForm } from "@/components/auth";

export const metadata: Metadata = { title: "Accept an invite" };

export default function Page() {
  return <InviteForm />;
}
