import type { MetadataRoute } from "next";
import { LEGAL } from "@/lib/legal";
import { SOLUTIONS } from "@/lib/marketing";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/track",
    "/quote",
    "/pricing",
    "/coverage",
    "/blog",
    "/guides",
    "/contact",
    "/demo",
    "/login",
    ...SOLUTIONS.map((item) => `/solutions/${item.slug}`),
    ...LEGAL.map((item) => `/legal/${item.slug}`)
  ];
  return paths.map((path) => ({ url: `http://localhost:3010${path}`, lastModified: new Date("2026-09-28") }));
}
