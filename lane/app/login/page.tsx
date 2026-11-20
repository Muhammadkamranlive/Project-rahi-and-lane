import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <Suspense fallback={<p className="p-8 text-sm">Opening sign in…</p>}><LoginForm /></Suspense>;
}
