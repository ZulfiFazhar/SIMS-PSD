import { type User, type Startup, UserRole, StartupStatus } from "../types";

const KEYS = {
  USERS: "inbiskom_users",
  STARTUPS: "inbiskom_startups",
  CURRENT_USER: "inbiskom_current_user",
};

// Initial Dummy Data
const seedUsers: User[] = [
  {
    id: "u1",
    name: "Budi Santoso (Mhs)",
    email: "budi@student.univ.ac.id",
    password: "123456",
    role: UserRole.STUDENT,
    phone: "08123456789",
  },
  {
    id: "u2",
    name: "Siti Aminah (Admin)",
    email: "admin@inbiskom.univ.ac.id",
    password: "123456",
    role: UserRole.ADMIN,
  },
  {
    id: "u3",
    name: "Dr. Hendra Wijaya",
    email: "hendra@dosen.univ.ac.id",
    password: "123456",
    role: UserRole.LECTURER,
    nip: "198203122005011002",
    title: "M.M., M.Kom",
  },
  {
    id: "u4",
    name: "Prof. Rina Kartika",
    email: "rina@dosen.univ.ac.id",
    password: "123456",
    role: UserRole.LECTURER,
    nip: "197505202000122001",
    title: "Ph.D",
  },
];

const seedStartups: Startup[] = [
  {
    id: "s1",
    studentId: "u1",
    businessName: "KampusKopi",
    category: "Kuliner & F&B",
    addressType: "Offline",
    addressDetails: "Kantin Fakultas Teknik",
    teamLeader: "Budi Santoso",
    teamMembers: ["Joko", "Anwar"],
    faculty: "Teknik",
    isGrowing: true,
    businessDuration: "6 Bulan",
    dailyRevenue: 500000,
    documents: { logo: "logo.png", proposal: true },
    status: StartupStatus.SUBMITTED,
    submissionDate: new Date().toISOString(),
  },
];

export const storageService = {
  init: () => {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
    }
    if (!localStorage.getItem(KEYS.STARTUPS)) {
      localStorage.setItem(KEYS.STARTUPS, JSON.stringify(seedStartups));
    }
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getStartups: (): Startup[] => {
    return JSON.parse(localStorage.getItem(KEYS.STARTUPS) || "[]");
  },

  saveStartup: (startup: Startup) => {
    const startups = storageService.getStartups();
    const index = startups.findIndex((s) => s.id === startup.id);
    if (index >= 0) {
      startups[index] = startup;
    } else {
      startups.push(startup);
    }
    localStorage.setItem(KEYS.STARTUPS, JSON.stringify(startups));
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  login: (userId: string): User | null => {
    const users = storageService.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },
};
