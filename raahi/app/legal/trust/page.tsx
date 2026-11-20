import { LegalShell } from "@/components/LegalShell";
import { TRUST_PILLARS } from "@/lib/compliance";

export default function TrustPage() {
  return (
    <LegalShell title="Trust and the legal model">
      <p>
        Informal traveler-carry already happens on WhatsApp. The failure modes are obvious: the traveler disappears, customs
        seizes a phone, or the arrangement is treated as an unlicensed courier or money-transmission business.
      </p>
      <p>
        Raahi’s answer is not “trust strangers.” It is a marketplace that only allows a carry after identity, itinerary,
        contract, escrow and customs warranties are in place.
      </p>
      {TRUST_PILLARS.map((pillar) => (
        <section key={pillar.title}>
          <h2 className="font-serif text-2xl">{pillar.title}</h2>
          <p>{pillar.body}</p>
        </section>
      ))}
      <h2 className="font-serif text-2xl">What Raahi is not</h2>
      <p>
        Raahi is not a postal operator, freight forwarder, customs agent, or bank. It does not take title to goods and must
        not hold customer funds. Live production needs a licensed escrow/payment partner (for example an EMI or payment
        institution in the UK) and a KYC vendor such as Veriff or Onfido, plus NADRA Verisys for Pakistan CNIC.
      </p>
      <h2 className="font-serif text-2xl">Why this is safer than TCS-for-cheap</h2>
      <p>
        Couriers are the right tool for commercial cargo. Raahi is for personal accompanying baggage going to a village a
        traveler is already visiting. If the item looks commercial, the app blocks or warns, because pretending to be a
        courier is the legal risk.
      </p>
    </LegalShell>
  );
}
