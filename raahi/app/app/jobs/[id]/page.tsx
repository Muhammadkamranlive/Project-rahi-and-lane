"use client";

import { JobBadge } from "@/components/JobBadge";
import { Button, Card, Empty, inputClass } from "@/components/ui";
import { CONTRACT_VERSION } from "@/lib/compliance";
import { money, prettyDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function JobPage() {
  const params = useParams<{ id: string }>();
  const { state, me, signContract, fundEscrow, confirmPickup, confirmDelivery, raiseDispute, sendMessage } = useStore();
  const job = state.jobs.find((item) => item.id === params.id);
  const trip = state.trips.find((item) => item.id === job?.tripId);
  const parcel = state.parcels.find((item) => item.id === job?.parcelId);
  const thread = state.threads.find((item) => item.jobId === job?.id);
  const messages = state.messages.filter((item) => item.threadId === thread?.id);
  const [otp, setOtp] = useState("");
  const [chat, setChat] = useState("");
  const [dispute, setDispute] = useState("");
  const [flash, setFlash] = useState("");

  const counterpart = useMemo(() => {
    if (!job || !me) return null;
    const otherId = me.id === job.senderId ? job.travelerId : job.senderId;
    return state.users.find((user) => user.id === otherId) || null;
  }, [job, me, state.users]);

  if (!job || !trip || !parcel || !me) return <Empty title="Job not found" body="It may have been removed." />;

  const iAmSender = me.id === job.senderId;
  const bothSigned = Boolean(job.contract.senderSignedAt && job.contract.travelerSignedAt);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">Protected carry</p>
          <h1 className="font-serif text-3xl leading-tight">
            {trip.fromCity} → {parcel.destVillage}
          </h1>
        </div>
        <JobBadge status={job.status} />
      </div>

      <Card>
        <p className="text-sm">With {counterpart?.displayName} · fee {money(job.feeGbp)} · insurance {money(job.insuranceGbp)}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{parcel.items.map((item) => item.name).join(" · ")}</p>
        <p className="mt-2 text-sm">Recipient: {parcel.recipientName} · {parcel.recipientPhoneMasked}</p>
      </Card>

      <Card>
        <h2 className="font-serif text-2xl">1. Bailment contract</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {CONTRACT_VERSION}. Traveler is bailee. Sender stays owner. Liability cap {money(job.contract.liabilityCapGbp)}.
          Traveler will declare accompanying baggage. No off-platform payment.
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Sender {job.contract.senderSignedAt ? `signed ${prettyDateTime(job.contract.senderSignedAt)}` : "not signed"} ·
          Traveler {job.contract.travelerSignedAt ? `signed ${prettyDateTime(job.contract.travelerSignedAt)}` : "not signed"}
        </p>
        {(!iAmSender && !job.contract.travelerSignedAt) || (iAmSender && !job.contract.senderSignedAt) ? (
          <Button className="mt-3" onClick={() => signContract(job.id)}>
            Sign consignment note
          </Button>
        ) : null}
      </Card>

      <Card>
        <h2 className="font-serif text-2xl">2. Licensed escrow</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Status: {job.escrow.status}. Amount {money(job.escrow.amountGbp)}. In production this is a payment-institution
          hold, not a wallet inside the app.
        </p>
        {iAmSender && bothSigned && job.escrow.status === "unfunded" && (
          <Button className="mt-3" onClick={() => fundEscrow(job.id)}>
            Fund escrow
          </Button>
        )}
        {job.escrow.status === "held" && <p className="mt-2 text-sm text-[var(--green)]">Funds held until village OTP.</p>}
        {job.escrow.status === "released" && <p className="mt-2 text-sm text-[var(--green)]">Released to traveler.</p>}
        {job.escrow.status === "frozen" && <p className="mt-2 text-sm text-[#9b2c1f]">Frozen for dispute review.</p>}
      </Card>

      <Card>
        <h2 className="font-serif text-2xl">3. Handover codes</h2>
        {job.status === "escrow_funded" || job.status === "in_transit" || job.status === "delivered" ? (
          <div className="mt-2 space-y-3">
            {iAmSender && !job.handover.pickupAt && (
              <p className="rounded-2xl bg-[var(--sage)] p-3 font-serif text-3xl tracking-[0.3em]">{job.handover.pickupOtp}</p>
            )}
            {iAmSender && job.handover.pickupAt && !job.handover.deliveryAt && (
              <div>
                <p className="text-sm text-[var(--muted)]">Share this with family in the village.</p>
                <p className="rounded-2xl bg-[var(--sage)] p-3 font-serif text-3xl tracking-[0.3em]">{job.handover.deliveryOtp}</p>
              </div>
            )}
            {!iAmSender && (
              <form
                className="space-y-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const result = job.handover.pickupAt ? confirmDelivery(job.id, otp) : confirmPickup(job.id, otp);
                  setFlash(result.ok ? "Recorded." : result.error || "Try again");
                }}
              >
                <input className={inputClass} placeholder={job.handover.pickupAt ? "Village delivery code" : "Airport pickup code"} value={otp} onChange={(e) => setOtp(e.target.value)} />
                <Button type="submit">{job.handover.pickupAt ? "Confirm village delivery" : "Confirm pickup"}</Button>
              </form>
            )}
            {flash && <p className="text-sm">{flash}</p>}
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">Codes appear after escrow is funded.</p>
        )}
      </Card>

      {thread && (
        <Card>
          <h2 className="font-serif text-2xl">On-platform chat</h2>
          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`rounded-2xl px-3 py-2 text-sm ${message.system || message.fromId === "system" ? "bg-[var(--cream-2)] text-[var(--muted)]" : message.fromId === me.id ? "bg-[var(--green)] text-[var(--cream)]" : "bg-[var(--sage)]"}`}>
                {message.text}
                <p className="mt-1 text-[10px] opacity-70">{prettyDateTime(message.createdAt)}</p>
              </div>
            ))}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(thread.id, chat);
              setChat("");
            }}
          >
            <input className={inputClass} value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Message" />
            <Button type="submit" className="w-auto px-4">Send</Button>
          </form>
        </Card>
      )}

      {job.status !== "delivered" && job.status !== "cancelled" && job.status !== "refunded" && (
        <Card>
          <h2 className="font-serif text-2xl">Dispute</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Freezes escrow. Evidence: chat, OTPs, photos, contract.</p>
          <textarea className={`${inputClass} mt-2`} rows={3} value={dispute} onChange={(e) => setDispute(e.target.value)} />
          <Button variant="danger" className="mt-2" onClick={() => dispute && raiseDispute(job.id, dispute)}>
            Freeze escrow and open dispute
          </Button>
        </Card>
      )}
    </div>
  );
}
