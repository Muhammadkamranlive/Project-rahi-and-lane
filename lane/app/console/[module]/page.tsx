"use client";

import { ScreenRouter } from "@/components/desk";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ module: string }>();
  return <ScreenRouter moduleKey={params.module} />;
}
