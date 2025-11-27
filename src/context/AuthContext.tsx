import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { type User } from "../types";
import { storageService } from "../services/storageService";

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    storageService.init();
    return storageService.getCurrentUser();
  });

  const login = (userId: string) => {
    const loggedIn = storageService.login(userId);
    if (loggedIn) {
      setUser(loggedIn);
    }
  };

  const logout = () => {
    storageService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
