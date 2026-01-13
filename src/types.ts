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
  user_id: string;
  nama_bisnis: string;
  nama_ketua_tim: string;
  nim_nidn_ketua: string;
  nama_anggota_tim: string; // JSON string array
  nim_nidn_anggota: string; // JSON string array
  fakultas: string;
  prodi: string;
  kategori_bisnis: string;
  jenis_usaha: string;
  alamat_usaha: string;
  nomor_telepon: string;
  lama_usaha: number;
  omzet: string; // Decimal as string from backend
  status: TenantRegistrationStatus;
  created_at: string;
  updated_at: string;
  rejection_reason: string | null;
  business_documents: {
    id: number;
    tenant_id: string;
    logo_url: string;
    akun_medsos: string; // JSON string object
    sertifikat_nib_url: string;
    proposal_url: string;
    bmc_url: string;
    rab_url: string;
    laporan_keuangan_url: string;
    foto_produk_urls: string; // JSON string array
    created_at: string;
    updated_at: string;
  };
}
