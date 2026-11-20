import type { Metadata } from "next";
import { LegalPage } from "@/components/public";
import { legalPage } from "@/lib/legal";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: legalPage(slug)?.title || "Legal" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegalPage slug={slug} />;
}
