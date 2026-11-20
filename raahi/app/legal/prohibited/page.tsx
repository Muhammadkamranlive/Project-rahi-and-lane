import { LegalShell } from "@/components/LegalShell";
import { PROHIBITED_KEYWORDS } from "@/lib/compliance";

export default function ProhibitedPage() {
  return (
    <LegalShell title="Prohibited and restricted items">
      <p>Travelers on Raahi are not a courier company. If a licensed operator would need a special licence, it does not belong here.</p>
      <h2 className="font-serif text-2xl">Never</h2>
      <p>{PROHIBITED_KEYWORDS.join(", ")}.</p>
      <h2 className="font-serif text-2xl">Restricted</h2>
      <p>Electronics with IMEI, OTC medicine in original packaging, dry sealed food. Commercial quantities are blocked.</p>
    </LegalShell>
  );
}
