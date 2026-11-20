"use client";

import { Shell } from "@/components/shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell mode="app">{children}</Shell>;
}
