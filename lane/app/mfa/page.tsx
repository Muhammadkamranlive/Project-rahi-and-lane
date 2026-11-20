import type { Metadata } from "next";
import { MfaForm } from "@/components/auth";

export const metadata: Metadata = { title: "Verification" };

export default function Page() {
  return <MfaForm />;
}
