export type KycStatus = "none" | "pending" | "verified" | "rejected";
export type KycDocumentType = "passport" | "cnic" | "national_id" | "residence_permit";
export type Direction = "into_pakistan" | "out_of_pakistan" | "domestic";
export type UserRole = "sender" | "traveler" | "both";
export type TripStatus = "open" | "full" | "completed" | "cancelled";
export type ParcelStatus = "open" | "matched" | "in_transit" | "delivered" | "cancelled";
export type JobStatus =
  | "requested"
  | "accepted"
  | "contracted"
  | "escrow_funded"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "disputed"
  | "refunded"
  | "cancelled";
export type EscrowStatus = "unfunded" | "held" | "released" | "refunded" | "frozen";
export type ItemCategory =
  | "gift"
  | "clothes"
  | "documents"
  | "electronics"
  | "food_dry"
  | "medicine_otc"
  | "other";

export type ConsentRecord = {
  version: string;
  acceptedAt: string;
  marketing: boolean;
  profiling: boolean;
  lawfulBasis: "contract" | "consent" | "legal_obligation" | "legitimate_interest";
};

export type KycProfile = {
  status: KycStatus;
  legalName: string;
  dateOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  addressLine: string;
  city: string;
  postalCode: string;
  documentType: KycDocumentType | "";
  documentNumberMasked: string;
  documentExpiry: string;
  selfieOnFile: boolean;
  addressProofOnFile: boolean;
  pepDeclaration: boolean;
  sanctionsDeclaration: boolean;
  amlRisk: "low" | "medium" | "high";
  submittedAt?: string;
  verifiedAt?: string;
  notes?: string;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  handle: string;
  role: UserRole;
  phone: string;
  homeCity: string;
  homeCountry: string;
  bio: string;
  kyc: KycProfile;
  consent: ConsentRecord;
  rating: number;
  completedDeliveries: number;
  trustScore: number;
  verifiedItineraries: number;
  languages: string[];
  createdAt: string;
  isDemo?: boolean;
};

export type Trip = {
  id: string;
  travelerId: string;
  fromCity: string;
  fromCountry: string;
  fromAirport: string;
  toCity: string;
  toCountry: string;
  toAirport: string;
  villageStops: string[];
  departDate: string;
  arriveDate: string;
  airline: string;
  flightNoMasked: string;
  itineraryVerified: boolean;
  capacityKg: number;
  remainingKg: number;
  feePerKgGbp: number;
  notes: string;
  status: TripStatus;
  direction: Direction;
};

export type ParcelItem = {
  name: string;
  category: ItemCategory;
  qty: number;
  weightKg: number;
  declaredValueGbp: number;
  serialOrImei?: string;
};

export type Parcel = {
  id: string;
  senderId: string;
  originCity: string;
  originCountry: string;
  destCity: string;
  destCountry: string;
  destVillage: string;
  recipientName: string;
  recipientPhoneMasked: string;
  items: ParcelItem[];
  totalWeightKg: number;
  totalValueGbp: number;
  isGift: boolean;
  personalUseOnly: boolean;
  preferredFrom: string;
  preferredTo: string;
  notes: string;
  status: ParcelStatus;
  direction: Direction;
  customsReady: boolean;
};

export type Contract = {
  version: string;
  senderSignedAt?: string;
  travelerSignedAt?: string;
  liabilityCapGbp: number;
};

export type Escrow = {
  amountGbp: number;
  status: EscrowStatus;
  fundedAt?: string;
  releasedAt?: string;
  paymentPartner: "licensed_escrow_partner";
};

export type Handover = {
  pickupOtp: string;
  deliveryOtp: string;
  pickupAt?: string;
  pickupNote?: string;
  deliveryAt?: string;
  deliveryNote?: string;
  photosOnFile: boolean;
};

export type Job = {
  id: string;
  tripId: string;
  parcelId: string;
  senderId: string;
  travelerId: string;
  feeGbp: number;
  insuranceGbp: number;
  status: JobStatus;
  contract: Contract;
  escrow: Escrow;
  handover: Handover;
  disputeReason?: string;
  createdAt: string;
};

export type Thread = {
  id: string;
  jobId: string;
  participantIds: string[];
};

export type ChatMessage = {
  id: string;
  threadId: string;
  fromId: string;
  text: string;
  createdAt: string;
  system?: boolean;
};

export type AppState = {
  users: User[];
  trips: Trip[];
  parcels: Parcel[];
  jobs: Job[];
  threads: Thread[];
  messages: ChatMessage[];
  currentUserId: string | null;
  cookieConsent: "unknown" | "essential" | "all";
};
