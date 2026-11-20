# Raahi

Trusted traveler delivery between Pakistan and the rest of the world. Next.js + Firebase, mobile-app layout, KYC, escrow, GDPR.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo logins (already KYC-verified):

- **Ayesha Malik** — sender in London with a gift parcel for Qila Didar Singh, Gujranwala
- **Bilal Hussain** — traveler Birmingham → Lahore, dropping in Gujranwala / Sialkot / Wazirabad

Walk the legal flow: request → both sign consignment → fund escrow → pickup OTP → village delivery OTP → funds release.

## What this is

People already ask travelers to carry phones, clothes and gifts because TCS and international couriers are expensive and stop at a depot. Informal WhatsApp arrangements create theft, customs and unlicensed-courier risk.

Raahi is a **matching marketplace**, not a postal operator:

1. KYC / AML before matching (passport or Pakistan CNIC)
2. Verified itinerary
3. Digital bailment contract (traveler is bailee, sender stays owner)
4. Licensed escrow until recipient OTP
5. Prohibited-item and commercial-quantity screens
6. Customs / PTA warnings for electronics
7. GDPR export, consent and deletion

## Firebase (production)

Copy `.env.example` to `.env.local` and add a Firebase web app config. Deploy `firestore.rules` and `storage.rules`.

You still need, before charging real users:

- A KYC vendor (Veriff / Onfido) and NADRA Verisys for CNIC
- A UK EMI / payment institution for escrow (do not hold customer funds in Firebase)
- Pakistan and England & Wales counsel to stamp the terms
- PTA / customs operating procedures for devices

Until keys are present, the app runs as a full demo on-device (localStorage).
