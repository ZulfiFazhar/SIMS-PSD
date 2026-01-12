import {
    signInWithPopup,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import type { User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BackendAuthResponse {
    message: string;
    status: string;
    user?: User;
}

interface AuthSession {
    user: User;
    idToken: string;
    timestamp: number;
}

export const authService = {

    async signInWithGoogle(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const idToken = await firebaseUser.getIdToken();

            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Authentication failed: ${response.statusText}`);
            }

            const data: BackendAuthResponse = await response.json();

            const user: User = data.user || {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || firebaseUser.email || "User",
                role: "TENANT" as const,
            };

            const userSession: AuthSession = {
                user,
                idToken,
                timestamp: Date.now(),
            };

            localStorage.setItem("auth_session", JSON.stringify(userSession));

            return user;
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    },


    async signOut(): Promise<void> {
        try {
            await firebaseSignOut(auth);
            localStorage.removeItem("auth_session");
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    },


    getCurrentSession(): AuthSession | null {
        const session = localStorage.getItem("auth_session");
        if (!session) return null;

        try {
            return JSON.parse(session);
        } catch {
            return null;
        }
    },


    isSessionValid(): boolean {
        const sessionStr = localStorage.getItem("auth_session");
        if (!sessionStr) return false;

        try {
            const session: AuthSession = JSON.parse(sessionStr);
            const age = Date.now() - session.timestamp;
            return age < 86400000;
        } catch {
            return false;
        }
    },

    async getCurrentUserProfile() {
        try {
            const session = this.getCurrentSession();
            if (!session?.idToken) {
                throw new Error("Not authenticated");
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${session.idToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to fetch profile: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Get profile error:", error);
            throw error;
        }
    },
};
