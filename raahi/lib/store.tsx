"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CONTRACT_VERSION, LIABILITY_CAP_GBP, POLICY_VERSION, screenParcel } from "./compliance";
import { randomOtp, uid } from "./format";
import { createEmptyKyc, makeSeedState } from "./seed";
import type {
  AppState,
  ChatMessage,
  ConsentRecord,
  ItemCategory,
  Job,
  JobStatus,
  KycProfile,
  Parcel,
  Trip,
  User,
} from "./types";

const STORAGE_KEY = "raahi-state-v1";

type CreateTripInput = Omit<Trip, "id" | "travelerId" | "status" | "remainingKg" | "direction">;
type CreateParcelInput = Omit<Parcel, "id" | "senderId" | "status" | "direction" | "totalWeightKg" | "totalValueGbp">;

type Store = {
  ready: boolean;
  state: AppState;
  me: User | null;
  login: (userId: string) => void;
  logout: () => void;
  register: (input: { displayName: string; email: string; role: User["role"]; homeCity: string; homeCountry: string }) => void;
  setCookieConsent: (value: AppState["cookieConsent"]) => void;
  updateConsent: (patch: Partial<ConsentRecord>) => void;
  submitKyc: (profile: KycProfile) => void;
  createTrip: (input: CreateTripInput) => string;
  createParcel: (input: CreateParcelInput) => { id?: string; error?: string };
  requestCarry: (tripId: string, parcelId: string) => { id?: string; error?: string };
  setJobStatus: (jobId: string, status: JobStatus, extra?: Partial<Job>) => void;
  signContract: (jobId: string) => void;
  fundEscrow: (jobId: string) => void;
  confirmPickup: (jobId: string, otp: string) => { ok: boolean; error?: string };
  confirmDelivery: (jobId: string, otp: string) => { ok: boolean; error?: string };
  raiseDispute: (jobId: string, reason: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  exportMyData: () => string;
  deleteMyAccount: () => void;
};

const StoreContext = createContext<Store | null>(null);

function directionOf(fromCountry: string, toCountry: string) {
  if (toCountry === "Pakistan" && fromCountry !== "Pakistan") return "into_pakistan" as const;
  if (fromCountry === "Pakistan" && toCountry !== "Pakistan") return "out_of_pakistan" as const;
  return "domestic" as const;
}

function loadState(): AppState {
  const seed = makeSeedState();
  if (typeof window === "undefined") return seed;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return seed;
  try {
    const parsed = JSON.parse(raw) as AppState;
    return { ...seed, ...parsed, users: parsed.users?.length ? parsed.users : seed.users };
  } catch {
    return seed;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => makeSeedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const me = state.users.find((user) => user.id === state.currentUserId) ?? null;

  const api = useMemo<Store>(() => {
    const updateUser = (userId: string, patch: Partial<User> | ((user: User) => User)) => {
      setState((prev) => ({
        ...prev,
        users: prev.users.map((user) => {
          if (user.id !== userId) return user;
          return typeof patch === "function" ? patch(user) : { ...user, ...patch };
        }),
      }));
    };

    return {
      ready,
      state,
      me,
      login: (userId) => setState((prev) => ({ ...prev, currentUserId: userId })),
      logout: () => setState((prev) => ({ ...prev, currentUserId: null })),
      register: (input) => {
        const id = uid("user");
        const user: User = {
          id,
          email: input.email,
          displayName: input.displayName,
          handle: input.email.split("@")[0],
          role: input.role,
          phone: "",
          homeCity: input.homeCity,
          homeCountry: input.homeCountry,
          bio: "",
          kyc: createEmptyKyc(),
          consent: {
            version: POLICY_VERSION,
            acceptedAt: new Date().toISOString(),
            marketing: false,
            profiling: false,
            lawfulBasis: "contract",
          },
          rating: 0,
          completedDeliveries: 0,
          trustScore: 20,
          verifiedItineraries: 0,
          languages: ["English"],
          createdAt: new Date().toISOString(),
        };
        setState((prev) => ({ ...prev, users: [user, ...prev.users], currentUserId: id }));
      },
      setCookieConsent: (value) => setState((prev) => ({ ...prev, cookieConsent: value })),
      updateConsent: (patch) => {
        if (!me) return;
        updateUser(me.id, { consent: { ...me.consent, ...patch, version: POLICY_VERSION, acceptedAt: new Date().toISOString() } });
      },
      submitKyc: (profile) => {
        if (!me) return;
        updateUser(me.id, {
          kyc: {
            ...profile,
            status: "verified",
            submittedAt: new Date().toISOString(),
            verifiedAt: new Date().toISOString(),
            selfieOnFile: true,
            addressProofOnFile: true,
            amlRisk: "low",
            documentNumberMasked: profile.documentNumberMasked || "••••verified",
          },
          trustScore: Math.max(me.trustScore, 70),
        });
      },
      createTrip: (input) => {
        if (!me) return "";
        const id = uid("trip");
        const trip: Trip = {
          ...input,
          id,
          travelerId: me.id,
          remainingKg: input.capacityKg,
          status: "open",
          direction: directionOf(input.fromCountry, input.toCountry),
        };
        setState((prev) => ({ ...prev, trips: [trip, ...prev.trips] }));
        return id;
      },
      createParcel: (input) => {
        if (!me) return { error: "Sign in first." };
        const screening = screenParcel(input.items);
        if (!screening.allowed) return { error: screening.blocked[0]?.detail || "Item is not allowed." };
        const id = uid("parcel");
        const totalWeightKg = input.items.reduce((sum, item) => sum + item.weightKg, 0);
        const totalValueGbp = input.items.reduce((sum, item) => sum + item.declaredValueGbp, 0);
        const parcel: Parcel = {
          ...input,
          id,
          senderId: me.id,
          totalWeightKg,
          totalValueGbp,
          status: "open",
          direction: directionOf(input.originCountry, input.destCountry),
        };
        setState((prev) => ({ ...prev, parcels: [parcel, ...prev.parcels] }));
        return { id };
      },
      requestCarry: (tripId, parcelId) => {
        if (!me) return { error: "Sign in first." };
        if (me.kyc.status !== "verified") return { error: "Complete KYC before matching." };
        const trip = state.trips.find((item) => item.id === tripId);
        const parcel = state.parcels.find((item) => item.id === parcelId);
        if (!trip || !parcel) return { error: "Trip or parcel missing." };
        if (parcel.totalWeightKg > trip.remainingKg) return { error: "Not enough spare baggage." };
        if (state.jobs.some((job) => job.tripId === tripId && job.parcelId === parcelId && job.status !== "cancelled")) {
          return { error: "This request is already open." };
        }
        const feeGbp = Math.max(15, Math.round(parcel.totalWeightKg * trip.feePerKgGbp));
        const id = uid("job");
        const threadId = uid("thread");
        const job: Job = {
          id,
          tripId,
          parcelId,
          senderId: parcel.senderId,
          travelerId: trip.travelerId,
          feeGbp,
          insuranceGbp: parcel.totalValueGbp > 100 ? 6 : 0,
          status: "requested",
          createdAt: new Date().toISOString(),
          contract: { version: CONTRACT_VERSION, liabilityCapGbp: LIABILITY_CAP_GBP },
          escrow: {
            amountGbp: feeGbp + (parcel.totalValueGbp > 100 ? 6 : 0),
            status: "unfunded",
            paymentPartner: "licensed_escrow_partner",
          },
          handover: { pickupOtp: randomOtp(), deliveryOtp: randomOtp(), photosOnFile: false },
        };
        const intro: ChatMessage = {
          id: uid("msg"),
          threadId,
          fromId: "system",
          text: "Match opened. Keep payment and personal addresses on-platform until escrow is funded.",
          createdAt: new Date().toISOString(),
          system: true,
        };
        setState((prev) => ({
          ...prev,
          jobs: [job, ...prev.jobs],
          threads: [{ id: threadId, jobId: id, participantIds: [job.senderId, job.travelerId] }, ...prev.threads],
          messages: [intro, ...prev.messages],
        }));
        return { id };
      },
      setJobStatus: (jobId, status, extra) => {
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((job) => (job.id === jobId ? { ...job, status, ...extra } : job)),
        }));
      },
      signContract: (jobId) => {
        if (!me) return;
        const now = new Date().toISOString();
        setState((prev) => {
          const jobs = prev.jobs.map((job) => {
            if (job.id !== jobId) return job;
            const contract = {
              ...job.contract,
              senderSignedAt: me.id === job.senderId ? now : job.contract.senderSignedAt,
              travelerSignedAt: me.id === job.travelerId ? now : job.contract.travelerSignedAt,
            };
            const both = Boolean(contract.senderSignedAt && contract.travelerSignedAt);
            return { ...job, contract, status: both ? "contracted" : job.status === "requested" ? "accepted" : job.status };
          });
          return { ...prev, jobs };
        });
      },
      fundEscrow: (jobId) => {
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status: "escrow_funded",
                  escrow: { ...job.escrow, status: "held", fundedAt: new Date().toISOString() },
                }
              : job,
          ),
        }));
      },
      confirmPickup: (jobId, otp) => {
        const job = state.jobs.find((item) => item.id === jobId);
        if (!job) return { ok: false, error: "Delivery not found." };
        if (otp.trim() !== job.handover.pickupOtp) return { ok: false, error: "Pickup code does not match." };
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((item) =>
            item.id === jobId
              ? {
                  ...item,
                  status: "in_transit",
                  handover: { ...item.handover, pickupAt: new Date().toISOString(), photosOnFile: true },
                }
              : item,
          ),
          parcels: prev.parcels.map((parcel) => (parcel.id === job.parcelId ? { ...parcel, status: "in_transit" } : parcel)),
        }));
        return { ok: true };
      },
      confirmDelivery: (jobId, otp) => {
        const job = state.jobs.find((item) => item.id === jobId);
        if (!job) return { ok: false, error: "Delivery not found." };
        if (otp.trim() !== job.handover.deliveryOtp) return { ok: false, error: "Delivery code does not match." };
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((item) =>
            item.id === jobId
              ? {
                  ...item,
                  status: "delivered",
                  escrow: { ...item.escrow, status: "released", releasedAt: new Date().toISOString() },
                  handover: { ...item.handover, deliveryAt: new Date().toISOString() },
                }
              : item,
          ),
          parcels: prev.parcels.map((parcel) => (parcel.id === job.parcelId ? { ...parcel, status: "delivered" } : parcel)),
          trips: prev.trips.map((trip) =>
            trip.id === job.tripId ? { ...trip, remainingKg: Math.max(0, trip.remainingKg - (prev.parcels.find((p) => p.id === job.parcelId)?.totalWeightKg ?? 0)) } : trip,
          ),
          users: prev.users.map((user) =>
            user.id === job.travelerId
              ? { ...user, completedDeliveries: user.completedDeliveries + 1, trustScore: Math.min(99, user.trustScore + 1) }
              : user,
          ),
        }));
        return { ok: true };
      },
      raiseDispute: (jobId, reason) => {
        setState((prev) => ({
          ...prev,
          jobs: prev.jobs.map((job) =>
            job.id === jobId
              ? { ...job, status: "disputed", disputeReason: reason, escrow: { ...job.escrow, status: "frozen" } }
              : job,
          ),
        }));
      },
      sendMessage: (threadId, text) => {
        if (!me || !text.trim()) return;
        const message: ChatMessage = {
          id: uid("msg"),
          threadId,
          fromId: me.id,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        };
        setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
      },
      exportMyData: () => {
        if (!me) return "{}";
        return JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            regulation: "UK GDPR / EU GDPR Article 15 and 20",
            user: me,
            parcels: state.parcels.filter((parcel) => parcel.senderId === me.id),
            trips: state.trips.filter((trip) => trip.travelerId === me.id),
            jobs: state.jobs.filter((job) => job.senderId === me.id || job.travelerId === me.id),
            messages: state.messages.filter((message) => {
              const thread = state.threads.find((item) => item.id === message.threadId);
              return thread?.participantIds.includes(me.id);
            }),
          },
          null,
          2,
        );
      },
      deleteMyAccount: () => {
        if (!me) return;
        const id = me.id;
        setState((prev) => ({
          ...prev,
          currentUserId: null,
          users: prev.users.filter((user) => user.id !== id),
          trips: prev.trips.filter((trip) => trip.travelerId !== id),
          parcels: prev.parcels.filter((parcel) => parcel.senderId !== id),
          jobs: prev.jobs.map((job) => (job.senderId === id || job.travelerId === id ? { ...job, status: "cancelled" } : job)),
        }));
      },
    };
  }, [me, ready, state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}

export function categoryLabel(category: ItemCategory) {
  const labels: Record<ItemCategory, string> = {
    gift: "Gift",
    clothes: "Clothes",
    documents: "Documents",
    electronics: "Electronics",
    food_dry: "Dry food",
    medicine_otc: "OTC medicine",
    other: "Other",
  };
  return labels[category];
}
