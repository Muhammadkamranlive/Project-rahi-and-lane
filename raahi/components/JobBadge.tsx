import { Badge } from "@/components/ui";
import type { JobStatus } from "@/lib/types";

const copy: Record<JobStatus, { label: string; tone: "sage" | "gold" | "ink" | "danger" | "ok" }> = {
  requested: { label: "Request sent", tone: "gold" },
  accepted: { label: "Accepted", tone: "sage" },
  contracted: { label: "Contract signed", tone: "ok" },
  escrow_funded: { label: "Escrow held", tone: "ok" },
  picked_up: { label: "Picked up", tone: "sage" },
  in_transit: { label: "In the air", tone: "ink" },
  delivered: { label: "Delivered", tone: "ok" },
  disputed: { label: "Dispute open", tone: "danger" },
  refunded: { label: "Refunded", tone: "gold" },
  cancelled: { label: "Cancelled", tone: "sage" },
};

export function JobBadge({ status }: { status: JobStatus }) {
  const item = copy[status];
  return <Badge tone={item.tone}>{item.label}</Badge>;
}
