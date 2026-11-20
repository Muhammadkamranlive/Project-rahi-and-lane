import type { Metadata } from "next";
import { BlogIndex } from "@/components/public";

export const metadata: Metadata = { title: "Journal" };

export default function Page() {
  return <BlogIndex />;
}
