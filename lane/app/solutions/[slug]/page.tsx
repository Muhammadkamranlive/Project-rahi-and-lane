import type { Metadata } from "next";
import { SolutionPage } from "@/components/public";
import { solution } from "@/lib/marketing";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: solution(slug)?.title || "Solutions" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SolutionPage slug={slug} />;
}
