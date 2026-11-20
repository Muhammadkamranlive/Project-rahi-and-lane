import type { Metadata } from "next";
import { Landing } from "@/components/landing";

export const metadata: Metadata = { title: "Lane — logistics operating system" };

export default function Page() {
  return <Landing />;
}
