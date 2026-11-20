import { LegalShell } from "@/components/LegalShell";

export default function TermsPage() {
  return (
    <LegalShell title="Terms of use">
      <p>By creating an account you enter a contract with the platform operator to use a matching marketplace.</p>
      <h2 className="font-serif text-2xl">Roles</h2>
      <p>
        Sender remains owner of the goods. Traveler is a bailee who agrees to carry described personal items as
        accompanying baggage on a named itinerary. Raahi is not a party to the carriage except as an introducer and
        records-keeper.
      </p>
      <h2 className="font-serif text-2xl">Eligibility</h2>
      <p>18+. Successful KYC. No use for commercial courier activity, cash, or prohibited goods.</p>
      <h2 className="font-serif text-2xl">Fees and escrow</h2>
      <p>
        Carry fees are agreed in-app and paid to a licensed partner. Funds release when the recipient OTP is confirmed, or
        refund/split after a dispute decision. Off-platform payment is a breach and voids protection.
      </p>
      <h2 className="font-serif text-2xl">Liability cap</h2>
      <p>
        Unless insurance is purchased, traveler liability is capped at the lower of declared value and £250. The platform’s
        liability for marketplace failures is limited to fees paid on that job, except where the law does not allow a limit
        (for example death or personal injury from negligence).
      </p>
      <h2 className="font-serif text-2xl">Customs</h2>
      <p>
        Sender warrants accurate description and value. Traveler must declare goods as required at exit and entry. Duties
        and PTA device taxes are the sender’s cost unless agreed otherwise in the consignment.
      </p>
    </LegalShell>
  );
}
