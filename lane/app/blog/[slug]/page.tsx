import type { Metadata } from "next";
import { BlogPost } from "@/components/public";

export const metadata: Metadata = { title: "Journal" };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPost slug={slug} />;
}
