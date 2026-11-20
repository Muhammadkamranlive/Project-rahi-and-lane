import { LegalShell } from "@/components/LegalShell";

export default function CustomsPage() {
  return (
    <LegalShell title="Customs and PTA notes">
      <p>
        Cross-border traveler-carry is legal only when the goods are genuine accompanying baggage / personal gifts, not a
        disguised import business.
      </p>
      <h2 className="font-serif text-2xl">Into Pakistan</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Traveler declares items at the airport. Keep receipts and the Raahi consignment note.</li>
        <li>New phones may need PTA approval and may attract duty. Share IMEI. One personal/gift device is very different from a box of sealed stock.</li>
        <li>Used clothes and modest family gifts are the intended use-case.</li>
        <li>Gold, large cash, commercial quantities, and restricted medicines are out of scope.</li>
      </ul>
      <h2 className="font-serif text-2xl">Out of Pakistan</h2>
      <p>
        Export of antiques, large amounts of currency, and some electronics can be restricted. Family gifts and used
        personal items going to a relative abroad are the intended use-case.
      </p>
      <h2 className="font-serif text-2xl">United Kingdom / EU</h2>
      <p>
        Sending new goods of significant value can create an import for the person in Pakistan and an export record in the
        UK. Raahi’s value cap and prohibited-item screen exist to keep jobs inside personal-use territory.
      </p>
      <p>
        This page is operational guidance for the product, not a substitute for Pakistan Customs, FBR, PTA, HMRC or a
        licensed customs agent.
      </p>
    </LegalShell>
  );
}
