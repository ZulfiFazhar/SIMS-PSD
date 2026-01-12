export const UserRole = {
  TENANT: "TENANT",
  ADMIN: "ADMIN",
  PUBLIC: "PUBLIC",
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
