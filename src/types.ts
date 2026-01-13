export const UserRole = {
  TENANT: "TENANT",
  ADMIN: "ADMIN",
  GUEST: "GUEST",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const StartupStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  GRADED: "GRADED",
} as const;
export type StartupStatus = (typeof StartupStatus)[keyof typeof StartupStatus];

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
}

export interface ScoringCriteria {
  background: number; // 5%
  noblePurpose: number; // 10%
  potentialConsumer: number; // 10%
  innovativeProduct: number; // 25%
  marketingStrategy: number; // 15%
  resources: number; // 15%
  financialReport: number; // 10%
  rab: number; // 10%
}

export interface Startup {
  id: string;
  tenantId: string;
  // Step 1: Identity
  businessName: string;
  category: string;
  addressType: "Online" | "Offline";
  addressDetails: string;
  teamLeader: string;
  teamMembers: string[];
  faculty: string;

  // Step 2: Status
  isGrowing: boolean;
  businessDuration?: string;
  dailyRevenue?: number;

  // Step 3: Documents (Simulated URLs/Flags)
  documents: {
    logo?: string;
    socialMedia?: string;
    nib?: boolean;
    bmc?: boolean;
    financial?: boolean;
    rab?: boolean;
    productPhoto?: boolean;
    proposal?: boolean;
  };

  // System Status
  status: StartupStatus;
  submissionDate?: string;

  // Admin Verification
  adminFeedback?: string;
  assignedTenantId?: string;
  curationDate?: string;

  // Grading
  scores?: ScoringCriteria;
  totalScore?: number;
}

export const CATEGORIES = [
  "Teknologi & Digital",
  "Kuliner & F&B",
  "Jasa & Pelayanan",
  "Fashion & Kreatif",
  "Agribisnis",
  "Sosial & Lingkungan",
];

export const TenantRegistrationStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;
export type TenantRegistrationStatus = (typeof TenantRegistrationStatus)[keyof typeof TenantRegistrationStatus];

export interface TenantRegistration {
  id: string;
  nama_bisnis: string;
  nama_ketua_tim: string;
  nim_nidn_ketua: string;
  fakultas: string;
  prodi: string;
  kategori_bisnis: string;
  jenis_usaha: string;
  alamat_usaha: string;
  nomor_telepon: string;
  lama_usaha?: number;
  omzet?: number;
  status: TenantRegistrationStatus;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  files?: {
    logo?: string;
    proposal?: string;
    bmc?: string;
    nib?: string;
    financial_report?: string;
    rab?: string;
    product_photos?: string[];
  };
}
