import { useState, useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContext";
import type { User } from "../types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const session = authService.getCurrentSession();

          if (session && authService.isSessionValid()) {
            setUser(session.user);
          } else if (session && !authService.isSessionValid()) {
            try {
              const newToken = await firebaseUser.getIdToken(true);
              authService.updateSessionToken(newToken);
              setUser(session.user);
            } catch (error) {
              console.error('Token refresh failed:', error);
              await authService.signOut();
              setUser(null);
            }
          } else {
            try {
              const idToken = await firebaseUser.getIdToken();
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
                method: "GET",
                headers: {
                  "Accept": "application/json",
                  "Authorization": `Bearer ${idToken}`,
                },
              });

              if (response.ok) {
                const data = await response.json();
                const backendUser = data.data;
                const userData = {
                  id: backendUser.id,
                  email: backendUser.email,
                  name: backendUser.display_name,
                  role: backendUser.role.toUpperCase(),
                  phone: backendUser.phone_number,
                };

                const userSession = {
                  user: userData,
                  idToken,
                  timestamp: Date.now(),
                };
                localStorage.setItem("auth_session", JSON.stringify(userSession));
                setUser(userData);
              } else {
                await authService.signOut();
                setUser(null);
              }
            } catch (error) {
              console.error('Failed to restore session:', error);
              await authService.signOut();
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.signInWithGoogle();
      setUser(userData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      const errorMsg = err instanceof Error ? err.message : "Logout failed";
      setError(errorMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
