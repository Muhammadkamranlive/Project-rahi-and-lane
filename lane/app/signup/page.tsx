import type { Metadata } from "next";
import { SignupForm } from "@/components/auth";

export const metadata: Metadata = { title: "Create a company" };

export default function Page() {
  return <SignupForm />;
}
