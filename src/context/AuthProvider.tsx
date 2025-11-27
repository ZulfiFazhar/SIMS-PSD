import { useState, type ReactNode } from "react";
import { type User } from "../types";
import { storageService } from "../services/storageService";
import { AuthContext } from "./AuthContext";

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
